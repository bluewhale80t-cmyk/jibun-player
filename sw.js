// うさチルplayer © 2026 kiri.karasuba All rights reserved.
const C = 'usachill-v19';
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(C).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
function save(r, res) {
  if (res.ok && (res.type === 'basic' || res.type === 'cors')) {
    const cp = res.clone();
    caches.open(C).then(c => c.put(r, cp));
  }
  return res;
}
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  // ページ本体はネット優先(更新がすぐ届く)。オフラインなら保存済みを使う
  if (r.mode === 'navigate') {
    e.respondWith(fetch(r).then(res => save(r, res)).catch(() =>
      caches.match(r).then(hit => hit || caches.match('index.html'))));
    return;
  }
  e.respondWith(caches.match(r).then(hit => hit || fetch(r).then(res => save(r, res)).catch(() => Response.error())));
});
