self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Receptor de alertas Push con pantalla apagada
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
    // Triple pulso pesado: vibra 600ms, pausa 200ms, vibra 600ms, pausa 200ms, remate 900ms
    vibrate: [600, 200, 600, 200, 900],
    tag: 'touch-alert',
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