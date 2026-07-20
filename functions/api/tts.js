const model = "@cf/myshell-ai/melotts";
const japaneseText =
  /^[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}ー々〆〇ヶ\s・、。！？〜～]+$/u;

const errorResponse = (message, status) =>
  Response.json(
    { error: message },
    { status, headers: { "Cache-Control": "no-store" } },
  );

export const getTtsText = (request) => {
  const text = new URL(request.url).searchParams
    .get("text")
    ?.normalize("NFKC")
    .trim();
  if (!text || [...text].length > 32 || !japaneseText.test(text)) return;
  return text;
};

const decodeBase64 = (value) =>
  Uint8Array.from(atob(value), (character) => character.charCodeAt(0));

const getByteRange = (header, length) => {
  const match = /^bytes=(\d*)-(\d*)$/.exec(header ?? "");
  if (!match || (!match[1] && !match[2])) return;

  const start = match[1]
    ? Number(match[1])
    : Math.max(0, length - Number(match[2]));
  const end = match[2] && match[1] ? Number(match[2]) : length - 1;
  if (
    !Number.isSafeInteger(start) ||
    !Number.isSafeInteger(end) ||
    start < 0 ||
    start >= length ||
    end < start
  ) {
    return;
  }
  return [start, Math.min(end, length - 1)];
};

export const onRequestGet = async ({ request, env, waitUntil }) => {
  const text = getTtsText(request);
  if (!text) return errorResponse("Valid Japanese text is required", 400);
  if (!env.AI) return errorResponse("Speech service is unavailable", 503);

  const cache = globalThis.caches?.default;
  const cacheKey = new Request(request.url);
  let response = await cache?.match(cacheKey);

  if (!response) {
    const result = await env.AI.run(model, { prompt: text, lang: "ja" });
    if (!result?.audio) return errorResponse("Speech generation failed", 502);

    const audio = decodeBase64(result.audio);
    const contentType =
      new TextDecoder().decode(audio.subarray(0, 4)) === "RIFF"
        ? "audio/wav"
        : "audio/mpeg";
    response = new Response(audio, {
      headers: {
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Length": String(audio.byteLength),
        "Content-Type": contentType,
        "X-Content-Type-Options": "nosniff",
      },
    });
    if (cache) waitUntil(cache.put(cacheKey, response.clone()));
  }

  const rangeHeader = request.headers.get("Range");
  if (!rangeHeader) return response;

  const audio = new Uint8Array(await response.arrayBuffer());
  const range = getByteRange(rangeHeader, audio.byteLength);
  if (!range) {
    return new Response(null, {
      status: 416,
      headers: { "Content-Range": `bytes */${audio.byteLength}` },
    });
  }

  const [start, end] = range;
  const headers = new Headers(response.headers);
  headers.set("Content-Length", String(end - start + 1));
  headers.set("Content-Range", `bytes ${start}-${end}/${audio.byteLength}`);
  return new Response(audio.slice(start, end + 1), {
    status: 206,
    headers,
  });
};
