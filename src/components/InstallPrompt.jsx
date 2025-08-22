import { useState, useEffect } from 'react';
import { useTranslations } from '../lib/i18n';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const t = useTranslations();

  useEffect(() => {
    // 检查是否已经安装
    if (window.matchMedia('(display-mode: standalone)').matches || 
        window.navigator.standalone === true) {
      setIsInstalled(true);
      return;
    }

    // 监听 beforeinstallprompt 事件
    const handleBeforeInstallPrompt = (e) => {
      // 阻止默认的安装提示
      e.preventDefault();
      setDeferredPrompt(e);
      
      // 延迟显示自定义安装提示
      setTimeout(() => {
        setShowInstallPrompt(true);
      }, 3000); // 3秒后显示
    };

    // 监听 appinstalled 事件
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // 显示安装提示
    deferredPrompt.prompt();

    // 等待用户选择
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted installation');
    } else {
      console.log('User declined installation');
    }

    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // 24小时后再次显示
    localStorage.setItem('installPromptDismissed', Date.now());
  };

  // 检查是否在24小时内被dismiss过
  useEffect(() => {
    const dismissedTime = localStorage.getItem('installPromptDismissed');
    if (dismissedTime && Date.now() - parseInt(dismissedTime) < 24 * 60 * 60 * 1000) {
      setShowInstallPrompt(false);
    }
  }, []);

  // 如果已安装或不显示提示，则不渲染
  if (isInstalled || !showInstallPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 animate-slide-up">
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 border-2 border-pink-200 rounded-2xl p-4 shadow-2xl backdrop-blur-sm">
        <div className="flex items-start space-x-3">
          <div className="text-3xl animate-bounce">📱</div>
          <div className="flex-1">
            <h3 className="font-bold text-rose-600 mb-1">
              💝 {t('install.title')}
            </h3>
            <p className="text-pink-600 text-sm leading-relaxed mb-3">
              {t('install.description')}
            </p>
            <div className="flex space-x-2">
              <button
                onClick={handleInstallClick}
                className="btn-pink px-4 py-2 text-sm font-bold flex-1"
              >
                <span className="mr-1">⬇️</span>
                {t('install.install_now')}
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2 text-sm text-pink-500 hover:text-pink-600 bg-white/70 rounded-xl border border-pink-200 transition-colors duration-200"
              >
                {t('install.remind_later')}
              </button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-pink-400 hover:text-pink-600 p-1"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

// iOS Safari安装指引组件
export function IOSInstallGuide() {
  const [showGuide, setShowGuide] = useState(false);
  const t = useTranslations();
  
  useEffect(() => {
    // 检测是否是iOS Safari且未安装
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || 
                              window.navigator.standalone === true;
    const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    
    if (isIOS && !isInStandaloneMode && isSafari) {
      setTimeout(() => setShowGuide(true), 5000); // 5秒后显示iOS指引
    }
  }, []);

  if (!showGuide) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 max-w-sm mx-auto text-center sparkle">
        <div className="text-6xl mb-4">📱</div>
        <h3 className="text-xl font-bold text-rose-600 mb-3">
          {t('install.ios_guide.title')}
        </h3>
        <div className="space-y-3 text-sm text-pink-600">
          <div className="flex items-center space-x-2">
            <span className="text-blue-500 text-lg">📤</span>
            <span>{t('install.ios_guide.step1')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg">⬇️</span>
            <span>{t('install.ios_guide.step2')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg">✅</span>
            <span>{t('install.ios_guide.step3')}</span>
          </div>
        </div>
        <button
          onClick={() => setShowGuide(false)}
          className="btn-pink w-full mt-6 py-3 text-base font-bold"
        >
          {t('install.ios_guide.got_it')}
        </button>
      </div>
    </div>
  );
}