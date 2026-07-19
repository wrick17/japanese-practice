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

export const onRequestGet = async ({ request, env, waitUntil }) => {
  const text = getTtsText(request);
  if (!text) return errorResponse("Valid Japanese text is required", 400);
  if (!env.AI) return errorResponse("Speech service is unavailable", 503);

  const cache = globalThis.caches?.default;
  const cachedResponse = await cache?.match(request);
  if (cachedResponse) return cachedResponse;

  const result = await env.AI.run(model, { prompt: text, lang: "ja" });
  if (!result?.audio) return errorResponse("Speech generation failed", 502);

  const audio = decodeBase64(result.audio);
  const contentType =
    new TextDecoder().decode(audio.subarray(0, 4)) === "RIFF"
      ? "audio/wav"
      : "audio/mpeg";
  const response = new Response(audio, {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Type": contentType,
      "X-Content-Type-Options": "nosniff",
    },
  });
  if (cache) waitUntil(cache.put(request, response.clone()));
  return response;
};
