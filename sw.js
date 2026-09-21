// Offline cache for BSB Reader. Bump VERSION whenever any file changes.
const VERSION = 'bsb-reader-v2';
const FILES = [
  './', 'index.html', 'manifest.webmanifest',
  'icon-192.png', 'icon-512.png', 'icon-maskable-512.png',
  'atkinson-hyperlegible-latin-400-normal.woff2',
  'atkinson-hyperlegible-latin-400-italic.woff2',
  'atkinson-hyperlegible-latin-700-normal.woff2',
  'atkinson-hyperlegible-latin-700-italic.woff2'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(hit => hit || fetch(e.request)));
});
