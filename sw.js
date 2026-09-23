/* ─────────────────────────────────────────────────────────
   Kasa · Service Worker (offline-first PWA)
   Sube la versión (CACHE_VERSION) cada vez que cambies la app
   para forzar la actualización del caché en los dispositivos.
───────────────────────────────────────────────────────── */
const CACHE_VERSION = 'kasa-v1.6.0';
const APP_SHELL = `${CACHE_VERSION}-shell`;
const RUNTIME = `${CACHE_VERSION}-runtime`;

// Recursos que forman el "app shell" (se precargan al instalar).
const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
];

// ── INSTALL: precargar shell ──────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(APP_SHELL)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
      .catch(err => console.warn('[SW] Precache parcial:', err))
  );
});

// ── ACTIVATE: limpiar cachés viejos ───────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => !k.startsWith(CACHE_VERSION)).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// ── FETCH: estrategias por tipo de petición ───────────────
self.addEventListener('fetch', event => {
  const req = event.request;

  // Solo GET; deja pasar POST/PUT, etc. sin interferir.
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // 1) Navegaciones (cargar la app): red primero, caché de respaldo.
  //    Así se ven los despliegues nuevos, pero funciona sin conexión.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(APP_SHELL).then(c => c.put('./index.html', copy));
          return res;
        })
        .catch(() => caches.match('./index.html').then(r => r || caches.match('./')))
    );
    return;
  }

  // 2) Fuentes de Google: cache-first (rara vez cambian) → offline OK.
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.match(req).then(cached => cached || fetch(req).then(res => {
        const copy = res.clone();
        caches.open(RUNTIME).then(c => c.put(req, copy));
        return res;
      }).catch(() => cached))
    );
    return;
  }

  // 3) Mismo origen (iconos, assets): stale-while-revalidate.
  //    Responde al instante desde caché y actualiza en segundo plano.
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(req).then(cached => {
        const network = fetch(req).then(res => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(APP_SHELL).then(c => c.put(req, copy));
          }
          return res;
        }).catch(() => cached);
        return cached || network;
      })
    );
  }
});

// Permite que la app pida activar la nueva versión inmediatamente.
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
