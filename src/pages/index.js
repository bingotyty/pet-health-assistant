import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Auth from '../components/Auth';
import UploadComponent from '../components/UploadComponent';
import ResultCard from '../components/ResultCard';
import UserProfile from '../components/UserProfile';
import InstallPrompt, { IOSInstallGuide } from '../components/InstallPrompt';
import OfflineIndicator from '../components/OfflineIndicator';
import CameraGuide from '../components/CameraGuide';

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  const { user, loading: authLoading } = useAuth();

  const handleAnalysisComplete = (result) => {
    setAnalysisResult(result);
    setLoading(false);
  };

  // 如果正在加载认证状态，显示loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-200 border-t-pink-500 mx-auto mb-4"></div>
          <div className="sparkle">
            <p className="text-pink-600 font-medium">🌸 加载中...</p>
          </div>
        </div>
      </div>
    );
  }

  // 如果用户未登录，显示登录页面
  if (!user) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 动态背景装饰 */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-pink-200 rounded-full opacity-40 animate-float"></div>
        <div className="absolute top-20 right-16 w-16 h-16 bg-rose-200 rounded-full opacity-30 animate-float-delayed"></div>
        <div className="absolute bottom-32 left-16 w-24 h-24 bg-pink-100 rounded-full opacity-50 animate-float-slow"></div>
        <div className="absolute bottom-40 right-12 w-12 h-12 bg-rose-300 rounded-full opacity-20 animate-bounce"></div>
        
        {/* 渐变背景层 */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50/80 via-rose-50/60 to-pink-100/40"></div>
      </div>

      <div className="relative z-10">
        {/* 顶部用户头像按钮 */}
        <div className="absolute top-6 right-6 z-50">
          <button
            onClick={() => setShowProfile(true)}
            className="w-14 h-14 bg-gradient-to-br from-white/80 to-pink-100/90 backdrop-blur-sm rounded-2xl flex items-center justify-center text-pink-600 font-bold hover:from-pink-100/90 hover:to-rose-200/80 transition-all duration-500 shadow-xl hover:shadow-2xl hover:scale-110 border border-pink-200/50 heart-pulse group"
          >
            <span className="text-lg group-hover:scale-110 transition-transform duration-300">
              {user.email?.[0]?.toUpperCase()}
            </span>
          </button>
        </div>

        {/* 主要内容区域 */}
        <div className="container mx-auto px-6 py-12">
          {/* Hero区域 */}
          <div className="text-center mb-12 relative">
            {/* 主标题区域 */}
            <div className="mb-8 relative">
              {/* 可爱的paw图标 */}
              <div className="inline-block relative mb-6">
                <div className="text-8xl animate-bounce-gentle filter drop-shadow-lg">🐾</div>
                <div className="absolute -top-2 -right-2 text-2xl animate-spin-slow">✨</div>
                <div className="absolute -bottom-1 -left-2 text-xl animate-pulse">💕</div>
              </div>
              
              {/* 标题文字 */}
              <h1 className="text-5xl md:text-6xl font-black mb-4 relative">
                <span className="bg-gradient-to-r from-pink-500 via-rose-400 to-pink-600 bg-clip-text text-transparent drop-shadow-sm">
                  宠物健康
                </span>
                <br />
                <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 bg-clip-text text-transparent">
                  小助手
                </span>
                <div className="absolute -top-4 right-0 text-2xl animate-bounce">🌸</div>
              </h1>
              
              {/* 副标题 */}
              <div className="space-y-2">
                <p className="text-xl md:text-2xl text-rose-600 font-semibold tracking-wide">
                  💕 用AI守护毛孩子的健康 💕
                </p>
                <p className="text-pink-500 font-medium">
                  <span className="inline-block animate-pulse">✨</span>
                  拍照识别 • 专业分析 • 贴心建议
                  <span className="inline-block animate-pulse">✨</span>
                </p>
                <p className="text-pink-400 text-sm">
                  📸 支持直接拍照 & 相册选择 📸
                </p>
              </div>
            </div>
          </div>

          {/* 主功能卡片 */}
          <div className="max-w-lg mx-auto relative">
            {/* 装饰性光环 */}
            <div className="absolute -inset-4 bg-gradient-to-r from-pink-200/30 to-rose-200/30 rounded-3xl blur-xl animate-pulse"></div>
            
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-pink-200/50">
              <UploadComponent 
                onAnalysisComplete={handleAnalysisComplete}
                onLoading={setLoading}
              />
            </div>
          </div>
          
          {/* 加载状态 */}
          {loading && (
            <div className="mt-8 text-center animate-fade-in">
              <div className="inline-block relative">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-lg border border-pink-200/50">
                  <div className="flex items-center justify-center space-x-3 mb-2">
                    <div className="w-6 h-6 relative">
                      <div className="w-6 h-6 border-3 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
                      <div className="absolute inset-0 w-6 h-6 border-3 border-transparent border-t-rose-400 rounded-full animate-spin animate-reverse"></div>
                    </div>
                    <span className="text-pink-600 font-semibold text-lg">AI小助手正在认真分析中</span>
                    <div className="text-xl animate-bounce">🔍</div>
                  </div>
                  <p className="text-pink-400 text-sm">请稍等片刻，马上就好~ 💝</p>
                </div>
                
                {/* 加载动画点点 */}
                <div className="flex justify-center mt-4 space-x-2">
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}

          {/* 结果显示 */}
          {analysisResult && (
            <div className="mt-8 animate-slide-up">
              <ResultCard record={analysisResult} />
            </div>
          )}

          {/* 底部留白，避免被导航栏遮挡 */}
          <div className="h-24"></div>
        </div>

        {/* 底部导航栏 */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-pink-200/50 shadow-2xl">
          <div className="flex justify-around py-4 px-6">
            <button className="flex flex-col items-center group relative">
              <div className="relative">
                <div className="text-3xl mb-1 group-hover:scale-110 transition-all duration-300 heart-pulse">📸</div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full animate-pulse shadow-lg"></div>
              </div>
              <span className="text-sm font-semibold text-pink-600 group-hover:text-pink-700">识别</span>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full opacity-80"></div>
            </button>
            
            <button 
              className="flex flex-col items-center group"
              onClick={() => window.location.href = '/history'}
            >
              <div className="text-3xl mb-1 group-hover:scale-110 transition-all duration-300 opacity-70 group-hover:opacity-100">📋</div>
              <span className="text-sm font-medium text-rose-400 group-hover:text-rose-600">历史</span>
            </button>
          </div>
        </nav>

        {showProfile && (
          <UserProfile onClose={() => setShowProfile(false)} />
        )}
        
        {/* PWA组件 */}
        <OfflineIndicator />
        <InstallPrompt />
        <IOSInstallGuide />
        
        {/* 拍照指导 */}
        <CameraGuide />
      </div>
    </div>
  );
}