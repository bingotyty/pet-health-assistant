import { useState, useEffect } from 'react';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);

  useEffect(() => {
    // 初始状态
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineMessage(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineMessage(true);
    };

    // 监听网络状态变化
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Service Worker 缓存状态检测
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        // 检查是否有缓存可用
        console.log('Service Worker ready:', registration);
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 自动隐藏在线消息
  useEffect(() => {
    if (isOnline && showOfflineMessage) {
      const timer = setTimeout(() => {
        setShowOfflineMessage(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, showOfflineMessage]);

  if (!showOfflineMessage && isOnline) {
    return null;
  }

  return (
    <div className={`offline-indicator ${
      isOnline ? 'bg-gradient-to-r from-emerald-500 to-green-500' : 'bg-gradient-to-r from-amber-500 to-orange-500'
    }`}>
      <div className="flex items-center justify-center space-x-2">
        <span className="text-lg">
          {isOnline ? '🌐' : '📱'}
        </span>
        <span>
          {isOnline ? '🎉 网络已恢复！' : '📱 当前离线 - 可继续使用已缓存的功能'}
        </span>
        {!isOnline && (
          <div className="ml-2 animate-pulse">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  );
}