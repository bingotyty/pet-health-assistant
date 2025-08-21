import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="zh-CN">
      <Head>
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Theme colors */}
        <meta name="theme-color" content="#f9a8d4" />
        <meta name="msapplication-TileColor" content="#f9a8d4" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Apple PWA */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="宠物健康小助手" />
        
        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/icon-192x192.svg" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icon-152x152.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icon-192x192.svg" />
        
        {/* Favicon */}
        <link rel="icon" type="image/svg+xml" sizes="32x32" href="/icon-32x32.svg" />
        <link rel="icon" type="image/svg+xml" sizes="16x16" href="/icon-16x16.svg" />
        <link rel="icon" href="/favicon.svg" />
        
        {/* App metadata */}
        <meta name="application-name" content="宠物健康小助手" />
        <meta name="description" content="用AI守护毛孩子的健康，专业的宠物粪便健康分析工具" />
        <meta name="keywords" content="宠物,健康,AI,粪便分析,宠物医疗,毛孩子" />
        
        {/* Viewport and mobile optimization */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* Social sharing */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="宠物健康小助手" />
        <meta property="og:description" content="用AI守护毛孩子的健康 💕" />
        <meta property="og:image" content="/icon-512x512.png" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="宠物健康小助手" />
        <meta name="twitter:description" content="用AI守护毛孩子的健康 💕" />
        <meta name="twitter:image" content="/icon-512x512.png" />
        
        {/* Preload critical fonts if using custom fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Service Worker 注册 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js', { scope: '/' })
                    .then(function(registration) {
                      console.log('🚀 PWA Service Worker 注册成功:', registration.scope);
                    })
                    .catch(function(error) {
                      console.log('❌ PWA Service Worker 注册失败:', error);
                    });
                });
              }
            `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}