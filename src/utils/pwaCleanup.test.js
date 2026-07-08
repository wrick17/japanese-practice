import { expect, test } from "bun:test";

import { unregisterServiceWorkers } from "./pwaCleanup";

test("unregisters existing service workers", async () => {
  const unregistered = [];
  const registrations = [
    { unregister: () => unregistered.push("first") },
    { unregister: () => unregistered.push("second") },
  ];

  await unregisterServiceWorkers({
    getRegistrations: () => registrations,
  });

  expect(unregistered).toEqual(["first", "second"]);
});

test("does nothing when service workers are unavailable", async () => {
  await expect(unregisterServiceWorkers(undefined)).resolves.toEqual([]);
});
