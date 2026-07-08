import { mkdtemp, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { $ } from "bun";
import { toRomaji } from "wanakana";

import { japanese } from "../src/constants/constantsV2.js";

const releaseApi =
  "https://api.github.com/repos/scriptin/jmdict-simplified/releases/latest";
const outputFile = new URL("../src/constants/wordsV2.json", import.meta.url);

const kanaKeyByScript = {
  hiragana: "kana",
  katakana: "kanaK",
};

const getKnownUnits = (script) => {
  const key = kanaKeyByScript[script];
  return japanese
    .flatMap((group) => group.rows.flatMap((row) => row))
    .filter((item) => item.roumaji)
    .map((item) => item[key])
    .toSorted((a, b) => b.length - a.length);
};

const knownUnits = {
  hiragana: getKnownUnits("hiragana"),
  katakana: getKnownUnits("katakana"),
};

const canSegment = (input, units) => {
  let index = 0;
  while (index < input.length) {
    const unit = units.find((value) => input.startsWith(value, index));
    if (!unit) return false;
    index += unit.length;
  }
  return true;
};

const isHiragana = (input) => /^[\u3041-\u3096]+$/.test(input);
const isKatakana = (input) => /^[\u30A1-\u30FA\u30FD-\u30FF]+$/.test(input);

const getEnglish = (word) =>
  word.sense
    .flatMap((sense) => sense.gloss)
    .find((gloss) => gloss.lang === "eng")?.text;

const collectWords = (jmdict, source) => {
  const seen = new Set();
  const words = [];

  for (const word of jmdict.words) {
    const english = getEnglish(word);
    if (!english) continue;

    for (const kana of word.kana) {
      const scripts = [
        ["hiragana", isHiragana(kana.text)],
        ["katakana", isKatakana(kana.text)],
      ];

      for (const [script, matchesScript] of scripts) {
        if (!matchesScript || !canSegment(kana.text, knownUnits[script])) {
          continue;
        }

        const key = `${script}:${kana.text}`;
        if (seen.has(key)) continue;
        seen.add(key);
        words.push({
          script,
          japanese: kana.text,
          romaji: toRomaji(kana.text),
          english,
        });
      }
    }
  }

  words.sort(
    (a, b) =>
      a.script.localeCompare(b.script) ||
      a.japanese.length - b.japanese.length ||
      a.japanese.localeCompare(b.japanese),
  );

  return {
    source,
    words,
  };
};

const downloadLatestCommonDictionary = async (dir) => {
  const release = await fetch(releaseApi).then((response) => response.json());
  const asset = release.assets.find((item) =>
    /^jmdict-eng-common-.*\.json\.tgz$/.test(item.name),
  );

  if (!asset) {
    throw new Error("Could not find the JMdict-Simplified English common data");
  }

  const archive = join(dir, asset.name);
  const response = await fetch(asset.browser_download_url);
  if (!response.ok) {
    throw new Error(`Download failed: ${response.status}`);
  }

  await writeFile(archive, Buffer.from(await response.arrayBuffer()));
  await $`tar -xzf ${archive} -C ${dir}`.quiet();

  const jsonFile = (await readdir(dir)).find((name) => name.endsWith(".json"));
  if (!jsonFile) throw new Error("Downloaded archive did not contain JSON");

  return {
    release: release.tag_name,
    archive: asset.name,
    url: asset.browser_download_url,
    json: await Bun.file(join(dir, jsonFile)).json(),
  };
};

const main = async () => {
  const dir = await mkdtemp(join(tmpdir(), "jmdict-"));
  try {
    const sourceData = await downloadLatestCommonDictionary(dir);
    const output = collectWords(sourceData.json, {
      name: "JMdict-Simplified",
      release: sourceData.release,
      dictDate: sourceData.json.dictDate,
      archive: sourceData.archive,
      url: sourceData.url,
    });

    await writeFile(
      `${outputFile.pathname}`,
      `${JSON.stringify(output, null, 2)}\n`,
    );
    console.log(`Wrote ${output.words.length} words to ${outputFile.pathname}`);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
};

await main();
