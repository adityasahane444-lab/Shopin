/* Shopin service worker placeholder. Kept intentionally minimal until push/offline caching is enabled. */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
