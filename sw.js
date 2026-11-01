// MPRINT CRM — дастур файлларини телефонда сақлаб туради (тез очилиши учун)
const KESH = 'mprint-crm-v1';
const FAYLLAR = ['./', 'index.html', 'config.js', 'manifest.webmanifest',
  'icons/logo.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/maskable-512.png', 'icons/apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(KESH).then(c => c.addAll(FAYLLAR)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(k => Promise.all(k.filter(n => n !== KESH).map(n => caches.delete(n))))
    .then(() => self.clients.claim()));
});

// Аввал интернетдан олади (доим янги версия), интернет бўлмаса — сақланганидан
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then(r => { const nusxa = r.clone(); caches.open(KESH).then(c => c.put(e.request, nusxa)); return r; })
      .catch(() => caches.match(e.request).then(r => r || caches.match('index.html')))
  );
});
