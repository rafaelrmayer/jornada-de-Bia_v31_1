const CACHE = 'jornada-bia-v30';
const CORE = ['./','./index.html','./css/style.css','./js/security.js','./js/storage.js','./js/backup.js','./js/app.js','./manifest.json'];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch', e => { if(e.request.method!=='GET') return; e.respondWith(caches.match(e.request).then(cached=>cached || fetch(e.request).then(r=>{ if(r.ok && new URL(e.request.url).origin===location.origin){ const clone=r.clone(); caches.open(CACHE).then(c=>c.put(e.request,clone)); } return r; }).catch(()=>cached))); });
