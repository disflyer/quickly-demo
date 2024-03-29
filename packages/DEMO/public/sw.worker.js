const CACHE_NAME = 'test_cache'

const filesToCache = ['/test.wasm', 'https://unpkg.com/@ffmpeg/core@0.8.5/dist/ffmpeg-core.wasm']

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      cache.addAll(filesToCache)
    })
  )
})
self.addEventListener('activate', (event) => {
  console.log('activate')
})
self.addEventListener('fetch', (event) => {
  console.debug('fetch')
  event.respondWith(
    caches.match(event.request).then((res) => {
      if (res) {
        return res
      } else {
        return fetch(event.request)
      }
    })
  )
})
