import { useState, useEffect } from 'react';

export default function CameraGuide() {
  const [deviceInfo, setDeviceInfo] = useState({
    isIOS: false,
    isPWA: false,
    isMobile: false,
    isStandalone: false
  });
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isPWA = window.matchMedia('(display-mode: standalone)').matches;
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isStandalone = window.navigator.standalone === true;

      setDeviceInfo({
        isIOS,
        isPWA: isPWA || isStandalone,
        isMobile,
        isStandalone
      });
    };

    checkDevice();
    
    // 第一次访问时显示指导
    const hasSeenGuide = localStorage.getItem('camera-guide-seen');
    if (!hasSeenGuide && (deviceInfo.isIOS || deviceInfo.isMobile)) {
      setTimeout(() => setShowGuide(true), 2000);
    }
  }, []);

  const handleCloseGuide = () => {
    setShowGuide(false);
    localStorage.setItem('camera-guide-seen', 'true');
  };

  if (!showGuide) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-white/95 via-pink-50/90 to-white/95 backdrop-blur-md rounded-3xl p-8 max-w-md mx-auto border border-pink-200/50 shadow-2xl relative overflow-hidden animate-slide-up">
        {/* 装饰性元素 */}
        <div className="absolute top-4 right-4 text-2xl animate-spin-slow opacity-30">✨</div>
        <div className="absolute bottom-4 left-4 text-xl animate-pulse opacity-40">💕</div>
        
        <div className="text-center">
          {/* 标题 */}
          <div className="mb-6">
            <div className="text-6xl mb-4 animate-bounce-gentle">📸</div>
            <h3 className="text-2xl font-black text-pink-600 mb-2">拍照功能指南</h3>
            <p className="text-pink-500 text-sm font-medium">
              {deviceInfo.isPWA ? 'PWA模式拍照体验' : '移动端拍照说明'}
            </p>
          </div>

          {/* iOS 专门指导 */}
          {deviceInfo.isIOS && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 mb-6 border border-blue-200">
              <div className="flex items-center justify-center mb-3">
                <span className="text-2xl mr-2">🍎</span>
                <h4 className="font-bold text-blue-600">iOS Safari 拍照</h4>
              </div>
              <div className="text-left space-y-2 text-sm text-blue-700">
                <div className="flex items-start">
                  <span className="mr-2">1️⃣</span>
                  <span>点击"立即拍照"按钮</span>
                </div>
                <div className="flex items-start">
                  <span className="mr-2">2️⃣</span>
                  <span>Safari会询问相机权限</span>
                </div>
                <div className="flex items-start">
                  <span className="mr-2">3️⃣</span>
                  <span>选择"允许"开启拍照功能</span>
                </div>
                {deviceInfo.isPWA && (
                  <div className="mt-3 p-2 bg-blue-100 rounded-lg">
                    <span className="text-blue-800 font-medium text-xs">
                      🌟 PWA模式下拍照功能与原生App体验一致！
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Android 指导 */}
          {!deviceInfo.isIOS && deviceInfo.isMobile && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 mb-6 border border-green-200">
              <div className="flex items-center justify-center mb-3">
                <span className="text-2xl mr-2">🤖</span>
                <h4 className="font-bold text-green-600">Android 拍照</h4>
              </div>
              <div className="text-left space-y-2 text-sm text-green-700">
                <div className="flex items-start">
                  <span className="mr-2">📱</span>
                  <span>点击拍照按钮直接调起相机</span>
                </div>
                <div className="flex items-start">
                  <span className="mr-2">📷</span>
                  <span>支持前置/后置摄像头切换</span>
                </div>
                <div className="flex items-start">
                  <span className="mr-2">⚡</span>
                  <span>拍照后自动返回分析界面</span>
                </div>
              </div>
            </div>
          )}

          {/* 拍照技巧 */}
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-4 mb-6 border border-pink-200">
            <h4 className="font-bold text-pink-600 mb-3 flex items-center justify-center">
              <span className="mr-2">💡</span>
              拍照小贴士
              <span className="ml-2">💡</span>
            </h4>
            <div className="text-left space-y-2 text-sm text-pink-700">
              <div className="flex items-start">
                <span className="mr-2">🔆</span>
                <span>确保光线充足，避免阴影</span>
              </div>
              <div className="flex items-start">
                <span className="mr-2">📐</span>
                <span>垂直拍摄，保持相机稳定</span>
              </div>
              <div className="flex items-start">
                <span className="mr-2">🔍</span>
                <span>拍摄目标清晰可见</span>
              </div>
            </div>
          </div>

          {/* 关闭按钮 */}
          <button
            onClick={handleCloseGuide}
            className="relative inline-block group w-full"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 to-rose-400 rounded-2xl opacity-60 blur group-hover:opacity-80 transition duration-300"></div>
            <div className="relative bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 text-white font-bold py-3 px-6 rounded-2xl shadow-lg transform transition-all duration-300 group-hover:scale-105 border border-pink-300">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-lg">✨</span>
                <span>我知道了，开始拍照</span>
                <span className="text-lg">📸</span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}