// 宠物健康小助手 Service Worker
const CACHE_NAME = 'pet-health-v2';
const urlsToCache = [
  '/',
  '/history',
  '/modern',
  '/manifest.json'
];

// 安装 Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('🎉 PWA缓存已打开');
        return cache.addAll(urlsToCache);
      })
  );
});

// 激活 Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🧹 清理旧缓存:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 拦截网络请求
self.addEventListener('fetch', (event) => {
  // 不缓存API请求
  if (event.request.url.includes('/api/')) {
    return; // 让API请求直接通过
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 如果有缓存则返回缓存
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          (response) => {
            // 检查是否是有效响应
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // 克隆响应用于缓存
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                // 只缓存GET请求，不缓存API
                if (event.request.method === 'GET' && !event.request.url.includes('/api/')) {
                  cache.put(event.request, responseToCache);
                }
              });

            return response;
          }
        );
      })
      .catch(() => {
        // 如果是页面请求且离线，返回离线页面
        if (event.request.destination === 'document') {
          return caches.match('/');
        }
      })
  );
});

// 显示通知 (可选)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon-192x192.svg',
      badge: '/icon-72x72.svg',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey
      }
    };
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});