import { createHash } from "node:crypto";
import { writeFile } from "node:fs/promises";
import { gunzipSync } from "node:zlib";

const levelSource = {
  name: "kanji-data",
  commit: "00fd7079c3890f430759536f91aa5e854ec0ca4f",
  url: "https://github.com/davidluzgouveia/kanji-data",
};
const levelSourceFile = `https://raw.githubusercontent.com/davidluzgouveia/kanji-data/${levelSource.commit}/kanji.json`;
const kanjidicSource = {
  name: "KANJIDIC2",
  url: "https://www.edrdg.org/kanjidic/kanjidic2.xml.gz",
  projectUrl: "https://www.edrdg.org/wiki/KANJIDIC_Project.html",
  licenseUrl: "https://www.edrdg.org/edrdg/licence.html",
};
const outputFile = new URL("../src/constants/kanjiV1.json", import.meta.url);
const levels = [5, 4, 3, 2, 1];
const oldLevelFallback = { 1: 1, 2: 2, 3: 4, 4: 5 };

const getEstimatedLevel = (item) =>
  item.jlpt_new ?? oldLevelFallback[item.jlpt_old];

const decodeXml = (value) => {
  const entities = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    quot: '"',
  };

  return value.replace(/&(#x[\da-f]+|#\d+|\w+);/gi, (match, entity) => {
    if (entity.startsWith("#x")) {
      return String.fromCodePoint(Number.parseInt(entity.slice(2), 16));
    }
    if (entity.startsWith("#")) {
      return String.fromCodePoint(Number.parseInt(entity.slice(1), 10));
    }
    return entities[entity] ?? match;
  });
};

const parseKanjidic = (xml) => {
  const entries = new Map();

  for (const match of xml.matchAll(/<character>([\s\S]*?)<\/character>/g)) {
    const block = match[1];
    const japanese = block.match(/<literal>([^<]+)<\/literal>/)?.[1];
    if (!japanese) continue;

    entries.set(japanese, {
      on: [
        ...block.matchAll(
          /<reading\b[^>]*r_type="ja_on"[^>]*>([^<]+)<\/reading>/g,
        ),
      ].map((reading) => decodeXml(reading[1])),
      kun: [
        ...block.matchAll(
          /<reading\b[^>]*r_type="ja_kun"[^>]*>([^<]+)<\/reading>/g,
        ),
      ].map((reading) => decodeXml(reading[1])),
      meanings: [...block.matchAll(/<meaning>([^<]+)<\/meaning>/g)].map(
        (meaning) => decodeXml(meaning[1]),
      ),
    });
  }

  return entries;
};

const [levelResponse, kanjidicResponse] = await Promise.all([
  fetch(levelSourceFile),
  fetch(kanjidicSource.url),
]);
if (!levelResponse.ok) {
  throw new Error(`JLPT estimate download failed: ${levelResponse.status}`);
}
if (!kanjidicResponse.ok) {
  throw new Error(`KANJIDIC2 download failed: ${kanjidicResponse.status}`);
}

const levelData = await levelResponse.json();
const compressedKanjidic = new Uint8Array(await kanjidicResponse.arrayBuffer());
const kanjidicXml = gunzipSync(compressedKanjidic).toString("utf8");
const kanjidic = parseKanjidic(kanjidicXml);
const fallbackCharacters = Object.entries(levelData)
  .filter(([, item]) => item.jlpt_new == null && getEstimatedLevel(item))
  .map(([japanese]) => japanese);
const kanji = levels.map((level) => ({
  group: `n${level}`,
  label: `N${level}`,
  items: Object.entries(levelData)
    .filter(([, item]) => getEstimatedLevel(item) === level)
    .toSorted(
      ([characterA, itemA], [characterB, itemB]) =>
        (itemA.freq ?? Infinity) - (itemB.freq ?? Infinity) ||
        itemA.strokes - itemB.strokes ||
        characterA.localeCompare(characterB, "ja"),
    )
    .map(([japanese]) => {
      const item = kanjidic.get(japanese);
      if (!item?.meanings.length || !(item.on.length || item.kun.length)) {
        throw new Error(`Incomplete KANJIDIC2 entry: ${japanese}`);
      }
      return Object.assign({ japanese }, item);
    }),
}));

const source = {
  levels: {
    ...levelSource,
    sourceFile: levelSourceFile,
    field: "jlpt_new",
    nullFallback: {
      oldField: "jlpt_old",
      oldToNew: oldLevelFallback,
      characters: fallbackCharacters,
    },
  },
  kanjidic: {
    ...kanjidicSource,
    databaseVersion: kanjidicXml.match(/<database_version>([^<]+)/)?.[1],
    dateOfCreation: kanjidicXml.match(/<date_of_creation>([^<]+)/)?.[1],
    gzipSha256: createHash("sha256").update(compressedKanjidic).digest("hex"),
  },
};

await writeFile(
  outputFile,
  `${JSON.stringify({ source, levels: kanji }, null, 2)}\n`,
);

console.log(
  `Wrote ${kanji.reduce((total, level) => total + level.items.length, 0)} Kanji from KANJIDIC2 ${source.kanjidic.databaseVersion} to ${outputFile.pathname}`,
);
