/* Motorhome Compass v1.3g - visible mobile Settings dialog.
   Clears legacy caches and always checks the network for the current app shell. */
const CACHE_VERSION = 'motorhome-compass-v1.3g-20260812'

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
      const response = await fetch(request, { cache: 'no-store' })
      return response
    } catch (error) {
      const cached = await caches.match(request)
      if (cached) return cached
      throw error
    }
  })())
})
