// Cambia este número cada vez que hagas cambios importantes (v1.0.1, v1.0.2...)
const CACHE_VERSION = 'v1.0.1';

self.addEventListener('install', (event) => {
  // Obliga al nuevo Service Worker a instalarse sin esperar a que se cierre la app
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Toma el control inmediato de todas las ventanas abiertas
  event.waitUntil(
    clients.claim().then(() => {
      // Limpia cachés viejas si existieran
      return caches.keys().then((keys) => {
        return Promise.all(
          keys.map((key) => {
            if (key !== CACHE_VERSION) {
              return caches.delete(key);
            }
          })
        );
      });
    })
  );
});

// NOTIFICACIÓN PUSH CON SONIDO Y VIBRACIÓN NATIVA
self.addEventListener('push', (event) => {
  let payload = { title: 'Nosotros ❤️️', body: 'Te acaban de mandar un abrazo' };

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
    // Patrón de vibración estándar de hardware: pulso - pausa - pulso largo
    vibrate: [500, 150, 500, 150, 800],
    tag: 'touch-alert',
    renotify: true,
    requireInteraction: true,
    silent: false, // Forzar a que use el tono predeterminado del sistema
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