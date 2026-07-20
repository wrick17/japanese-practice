import { expect, test } from "bun:test";

import { getTtsText, onRequestGet } from "./tts";

test("accepts short Japanese study text only", () => {
  expect(
    getTtsText(new Request("https://example.com/api/tts?text=日本語")),
  ).toBe("日本語");
  expect(
    getTtsText(new Request("https://example.com/api/tts?text=hello")),
  ).toBe(undefined);
  expect(
    getTtsText(
      new Request(`https://example.com/api/tts?text=${"あ".repeat(33)}`),
    ),
  ).toBe(undefined);
});

test("returns generated audio with long-lived cache headers", async () => {
  const calls = [];
  const response = await onRequestGet({
    request: new Request("https://example.com/api/tts?text=かな"),
    env: {
      AI: {
        run: async (...arguments_) => {
          calls.push(arguments_);
          return new Response("ID3audio", {
            headers: { "Content-Type": "audio/mpeg" },
          });
        },
      },
    },
    waitUntil: () => {},
  });

  expect(calls).toEqual([
    [
      "@cf/myshell-ai/melotts",
      { prompt: "かな", lang: "JP" },
      { returnRawResponse: true },
    ],
  ]);
  expect(response.headers.get("Content-Type")).toBe("audio/mpeg");
  expect(response.headers.get("Accept-Ranges")).toBe("bytes");
  expect(response.headers.get("Cache-Control")).toContain("immutable");
  expect(await response.text()).toBe("ID3audio");
});

test("serves valid media byte ranges", async () => {
  const response = await onRequestGet({
    request: new Request("https://example.com/api/tts?text=かな", {
      headers: { Range: "bytes=0-3" },
    }),
    env: {
      AI: { run: async () => new Response("ID3audio") },
    },
    waitUntil: () => {},
  });

  expect(response.status).toBe(206);
  expect(response.headers.get("Content-Range")).toBe("bytes 0-3/8");
  expect(response.headers.get("Content-Length")).toBe("4");
  expect(await response.text()).toBe("ID3a");
});

test("rejects invalid input before calling Workers AI", async () => {
  let called = false;
  const response = await onRequestGet({
    request: new Request("https://example.com/api/tts?text=hello"),
    env: { AI: { run: async () => (called = true) } },
    waitUntil: () => {},
  });

  expect(response.status).toBe(400);
  expect(called).toBe(false);
});
