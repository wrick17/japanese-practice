export const unregisterServiceWorkers = async (
  serviceWorker = globalThis.navigator?.serviceWorker,
  cacheStorage = globalThis.caches,
) => {
  const registrations =
    typeof serviceWorker?.getRegistrations === "function"
      ? await serviceWorker.getRegistrations()
      : [];

  await Promise.all(
    registrations.map((registration) => registration.unregister()),
  );
  if (typeof cacheStorage?.keys === "function") {
    const keys = await cacheStorage.keys();
    await Promise.all(
      keys
        .filter((key) => PIPER_CACHE_NAMES.has(key))
        .map((key) => cacheStorage.delete(key)),
    );
  }
  return registrations;
};
const PIPER_CACHE_NAMES = new Set([
  "japanese-practice-v1",
  "japanese-practice-v2",
]);
