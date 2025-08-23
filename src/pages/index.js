import { useEffect, useState } from 'react';

export default function Home() {
  const [redirectFailed, setRedirectFailed] = useState(false);
  
  useEffect(() => {
    // 添加超时和错误处理的重定向
    const timer = setTimeout(() => {
      setRedirectFailed(true);
    }, 3000); // 3秒后显示错误信息
    
    // 检查/modern页面是否可访问
    fetch('/modern', { method: 'HEAD' })
      .then(response => {
        clearTimeout(timer);
        if (response.ok) {
          window.location.href = '/modern';
        } else {
          setRedirectFailed(true);
        }
      })
      .catch(() => {
        clearTimeout(timer);
        setRedirectFailed(true);
      });
      
    return () => clearTimeout(timer);
  }, []);
  
  if (redirectFailed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-rose-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-4">🐾</div>
          <h1 className="text-2xl font-bold text-pink-600 mb-4">宠物健康小助手</h1>
          <p className="text-gray-600 mb-6">用AI守护毛孩子的健康</p>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.href = '/modern'}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 px-6 rounded-lg hover:from-pink-600 hover:to-rose-600 transition-colors"
            >
              进入现代版
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors"
            >
              刷新页面
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-rose-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-pink-600 font-medium">正在跳转到新版本...</p>
      </div>
    </div>
  );
}