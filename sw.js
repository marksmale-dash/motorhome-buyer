/* Motorhome Compass v1.2i - body-level, viewport-pinned gallery
   Clears legacy cached builds and uses the network for current app files. */
const CACHE_VERSION = 'motorhome-compass-v1.2i-20260809'

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys()
    await Promise.all(keys.map((key) => caches.delete(key)))
    await self.clients.claim()
  })())
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  event.respondWith((async () => {
    try {
      return await fetch(request, { cache: 'no-store' })
    } catch (error) {
      const cached = await caches.match(request)
      if (cached) return cached
      throw error
    }
  })())
})
