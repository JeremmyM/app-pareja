const CACHE_VERSION = 'v1.0.3';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

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