const CACHE = 'stimuli-v1';
const ASSETS = ['/', '/stimuli.html', '/manifest.json'];

// Allowlist: only cache/fetch from trusted origins
const ALLOWED_ORIGINS = [
  self.location.origin,
  'https://cdn.jsdelivr.net',
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // Only handle requests from allowed origins
  if (!ALLOWED_ORIGINS.some(origin => e.request.url.startsWith(origin))) return;
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});