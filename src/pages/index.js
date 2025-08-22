import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // 重定向到现代化版本
    window.location.href = '/modern';
  }, []);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-rose-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-pink-600 font-medium">正在跳转到新版本...</p>
      </div>
    </div>
  );
}