export const unregisterServiceWorkers = async (
  serviceWorker = globalThis.navigator?.serviceWorker,
) => {
  if (typeof serviceWorker?.getRegistrations !== "function") return [];

  const registrations = await serviceWorker.getRegistrations();
  await Promise.all(
    registrations.map((registration) => registration.unregister()),
  );
  return registrations;
};
