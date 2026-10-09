/* ─────────────────────────────────────────────────────────
   Kasa · Service Worker (offline-first PWA)
   Sube la versión (CACHE_VERSION) cada vez que cambies la app
   para forzar la actualización del caché en los dispositivos.
───────────────────────────────────────────────────────── */
const CACHE_VERSION = 'kasa-v2.0.0';
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

/* Respuesta de cortesía cuando no hay red NI copia en caché.
   Sin esto, respondWith() recibía undefined y el navegador lanzaba
   "the promise was resolved with an object that was not a Response". */
function respuestaSinConexion(req) {
  const acepta = req.headers.get('accept') || '';
  if (acepta.includes('text/html')) {
    return new Response(
      '<!DOCTYPE html><meta charset="utf-8">' +
      '<div style="font-family:system-ui;padding:2rem;text-align:center">' +
      '<h1>Sin conexión</h1><p>Abre Kasa de nuevo cuando tengas internet.</p></div>',
      { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }
  return new Response('', { status: 503, statusText: 'Sin conexión' });
}

// ── INSTALL: precargar shell ──────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(APP_SHELL).then(cache =>
      /* addAll es todo-o-nada: si un solo icono falla, no se cachea NADA
         y la app se queda sin soporte offline. Se cachea uno por uno para
         que un fallo aislado no arrastre al resto. */
      Promise.all(PRECACHE_URLS.map(url =>
        cache.add(url).catch(err => console.warn('[SW] No se pudo precachear', url, err))
      ))
    ).then(() => self.skipWaiting())
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

  let url;
  try { url = new URL(req.url); } catch (e) { return; }

  // Esquemas no cacheables (extensiones del navegador, blob:, data:).
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

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
        .catch(() => caches.match('./index.html')
          .then(r => r || caches.match('./'))
          // Última red de seguridad: siempre se devuelve una Response.
          .then(r => r || respuestaSinConexion(req)))
    );
    return;
  }

  // 2) Fuentes de Google: cache-first (rara vez cambian) → offline OK.
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.match(req).then(cached => {
        if (cached) return cached;
        return fetch(req).then(res => {
          if (res && (res.ok || res.type === 'opaque')) {
            const copy = res.clone();
            caches.open(RUNTIME).then(c => c.put(req, copy));
          }
          return res;
        }).catch(() => respuestaSinConexion(req));
      })
    );
    return;
  }

  // 3) Mismo origen (iconos, assets): stale-while-revalidate.
  //    Responde al instante desde caché y actualiza en segundo plano.
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(req).then(cached => {
        const network = fetch(req).then(res => {
          if (res && res.status === 200 && res.type === 'basic') {
            const copy = res.clone();
            caches.open(APP_SHELL).then(c => c.put(req, copy));
          }
          return res;
        }).catch(() => cached || respuestaSinConexion(req));
        // Si hay copia se sirve ya; si no, se espera a la red.
        return cached || network;
      })
    );
  }
});

// Permite que la app pida activar la nueva versión inmediatamente.
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
