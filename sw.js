// Sube este número cada vez que quieras forzar una actualización en los celulares (v1.0.4, v1.0.5...)
const CACHE_NAME = 'nosotros-cache-v1.0.5';

self.addEventListener('install', (event) => {
  // Obliga al Service Worker a instalarse inmediatamente sin esperar
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Limpia cualquier caché antigua almacenada en el iPhone o Android
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// ESCUCHA DE MENSAJE MANUAL DESDE LA INTERFAZ
self.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

// (Mantén aquí el resto de tu código de notificaciones push de sw.js)
self.addEventListener('push', (event) => {
  let payload = { title: 'Nosotros ❤️', body: 'Te acaban de mandar un abrazo' };
  if (event.data) {
    try {
      payload = event.data.json();
    } catch (e) {
      payload.body = event.data.text();
    }
  }

  const options = {
    body: payload.body,
    icon: 'https://cdn-icons-png.flaticon.com/512/833/833472.png',
    badge: 'https://cdn-icons-png.flaticon.com/512/833/833472.png',
    vibrate: [500, 200, 500, 200, 800],
    tag: 'touch-channel',
    renotify: true,
    requireInteraction: true,
    silent: false,
    data: { url: './' }
  };

  event.waitUntil(
    self.registration.showNotification(payload.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow('./');
    })
  );
});