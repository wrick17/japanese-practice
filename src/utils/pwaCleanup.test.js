import { expect, test } from "bun:test";

import { unregisterServiceWorkers } from "./pwaCleanup";

test("unregisters existing service workers", async () => {
  const unregistered = [];
  const deleted = [];
  const registrations = [
    { unregister: () => unregistered.push("first") },
    { unregister: () => unregistered.push("second") },
  ];

  await unregisterServiceWorkers(
    {
      getRegistrations: () => registrations,
    },
    {
      delete: (key) => deleted.push(key),
      keys: () => [
        "japanese-practice-v1",
        "japanese-practice-v2",
        "japanese-practice-shell",
        "other-app",
      ],
    },
  );

  expect(unregistered).toEqual(["first", "second"]);
  expect(deleted).toEqual(["japanese-practice-v1", "japanese-practice-v2"]);
});

test("does nothing when service workers are unavailable", async () => {
  await expect(unregisterServiceWorkers(undefined)).resolves.toEqual([]);
});
