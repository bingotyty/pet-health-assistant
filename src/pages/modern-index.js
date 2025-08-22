import { useState } from 'react';
import { useTranslations } from '../lib/i18n';
import { useAuth } from '../contexts/AuthContext';
import Auth from '../components/Auth';
import ModernUpload from '../components/ModernUpload';
import ModernResultCard from '../components/ModernResultCard';
import UserProfile from '../components/UserProfile';
import InstallPrompt, { IOSInstallGuide } from '../components/InstallPrompt';
import OfflineIndicator from '../components/OfflineIndicator';
import CameraGuide from '../components/CameraGuide';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Sparkles, Heart, Star, Zap, Shield, Users, TrendingUp } from 'lucide-react';

export default function ModernHome() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const t = useTranslations();
  
  const { user, loading: authLoading } = useAuth();

  const handleAnalysisComplete = (result) => {
    setAnalysisResult(result);
    setLoading(false);
  };

  // 如果正在加载认证状态，显示loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-rose-50">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-2xl animate-pulse">🐾</div>
            </div>
          </div>
          <p className="text-pink-600 font-medium">🌸 加载中...</p>
        </div>
      </div>
    );
  }

  // 如果用户未登录，显示登录页面
  if (!user) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 relative overflow-hidden">
      {/* 现代化动态背景 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-pink-300/20 to-rose-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-tr from-purple-300/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '3s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-rose-300/15 to-pink-300/15 rounded-full blur-2xl animate-float"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* 现代化顶部导航 */}
        <header className="backdrop-blur-xl bg-white/80 border-b border-pink-100/50 sticky top-0 z-50">
          <div className="container mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              {/* 左侧品牌 */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl animate-bounce-gentle">🐾</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center animate-pulse">
                    <Sparkles className="w-2 h-2 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 bg-clip-text text-transparent">
                    PetHealth AI
                  </h1>
                  <div className="flex items-center space-x-2">
                    <Badge className="text-xs bg-gradient-to-r from-pink-500 to-rose-500 text-white border-0">
                      ✨ 智能分析助手
                    </Badge>
                    <Badge variant="outline" className="text-xs border-pink-300 text-pink-600">
                      v2.0
                    </Badge>
                  </div>
                </div>
              </div>
              
              {/* 右侧用户区域 */}
              <div className="flex items-center space-x-4">
                <LanguageSwitcher />
                <div className="relative group">
                  <Avatar 
                    className="cursor-pointer hover:scale-110 transition-all duration-300 ring-2 ring-pink-200 hover:ring-pink-400 shadow-lg"
                    onClick={() => setShowProfile(true)}
                  >
                    <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-pink-100 to-rose-100 text-pink-700">
                      {user.email?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* 主要内容区域 */}
        <main className="flex-1 container mx-auto px-4 sm:px-6 py-12">
          {/* Hero 区域 */}
          <div className="text-center mb-16">
            <div className="relative inline-block mb-8">
              <h1 className="text-5xl sm:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 bg-clip-text text-transparent">
                  AI 守护
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 bg-clip-text text-transparent">
                  宠物健康
                </span>
              </h1>
              <div className="absolute -top-4 -right-4 animate-bounce">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
                  <Star className="w-4 h-4 text-white fill-current" />
                </div>
              </div>
            </div>
            
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              专业AI技术 • 秒级分析 • 科学建议
              <br />
              <span className="text-pink-600 font-semibold">让每一次关爱都更加精准</span>
            </p>

            {/* 统计信息 */}
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
                <Users className="w-4 h-4 text-blue-500" />
                <span className="text-gray-700">已服务 <strong className="text-blue-600">50,000+</strong> 宠物家庭</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-gray-700">分析准确率 <strong className="text-green-600">95%</strong></span>
              </div>
              <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-700">平均响应时间 <strong className="text-yellow-600">3秒</strong></span>
              </div>
            </div>
          </div>

          {/* 上传区域 */}
          <div className="mb-12">
            <ModernUpload 
              onAnalysisComplete={handleAnalysisComplete}
              onLoading={setLoading}
            />
          </div>
          
          {/* 加载状态 */}
          {loading && (
            <div className="mb-12 animate-in fade-in-0 zoom-in-95 duration-500">
              <Card className="mx-auto max-w-lg bg-gradient-to-br from-white via-pink-50/30 to-rose-50/30 backdrop-blur-xl border border-pink-100/50 shadow-2xl">
                <CardContent className="p-12 text-center">
                  <div className="relative mb-8">
                    <div className="w-20 h-20 mx-auto relative">
                      <div className="absolute inset-0 border-4 border-pink-200/50 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-transparent border-t-pink-500 rounded-full animate-spin"></div>
                      <div className="absolute inset-2 border-4 border-transparent border-t-rose-400 rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-3xl animate-pulse">🤖</div>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
                    AI 分析师正在工作中...
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    正在使用最先进的多模态AI技术
                    <br />
                    深度分析您上传的图片
                  </p>
                  
                  <div className="flex justify-center space-x-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gradient-to-r from-rose-400 to-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 结果显示 */}
          {analysisResult && (
            <div className="mb-12">
              <ModernResultCard record={analysisResult} />
            </div>
          )}
        </main>

        {/* 现代化底部导航 */}
        <nav className="backdrop-blur-xl bg-white/80 border-t border-pink-100/50 mt-auto">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex justify-center items-center py-6 space-x-12">
              <div className="flex flex-col items-center relative">
                <div className="relative p-3 bg-gradient-to-br from-pink-100 via-rose-100 to-purple-100 rounded-2xl shadow-lg mb-2">
                  <div className="text-2xl">📸</div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full animate-pulse"></div>
                </div>
                <span className="text-sm font-bold text-pink-600">AI识别</span>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
              </div>
              
              <button 
                className="flex flex-col items-center group transition-all duration-300 hover:scale-105"
                onClick={() => window.location.href = '/history'}
              >
                <div className="p-3 rounded-2xl group-hover:bg-gray-100 transition-all duration-300 shadow-md mb-2">
                  <div className="text-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-200">📋</div>
                </div>
                <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700">历史记录</span>
              </button>
            </div>
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