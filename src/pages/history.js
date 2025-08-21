import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import Auth from '../components/Auth';
import { analyzeTrend } from '../lib/utils';
import { getRecordsClient, getTrendsClient } from '../lib/client-api';
import ResultCard from '../components/ResultCard';
import UserProfile from '../components/UserProfile';
import OfflineIndicator from '../components/OfflineIndicator';

export default function HistoryPage() {
  const [records, setRecords] = useState([]);
  const [trendData, setTrendData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  
  const { user, loading: authLoading } = useAuth();
  
  useEffect(() => {
    if (user) {
      fetchHistoryRecords();
      generateTrendAnalysis();
    }
  }, [user]);
  
  const fetchHistoryRecords = async () => {
    if (!user || !user.id) return;
    
    try {
      // 根据环境选择API调用方式
      const isStatic = process.env.DEPLOY_TARGET === 'cloudflare' || process.env.NODE_ENV === 'production';
      
      if (isStatic) {
        // 生产环境使用客户端API
        const records = await getRecordsClient(user.id);
        setRecords(records);
      } else {
        // 开发环境使用API路由
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        
        const response = await fetch('/api/records', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });
        
        if (response.ok) {
          const result = await response.json();
          setRecords(result.data || []);
        }
      }
    } catch (error) {
      console.error('Error fetching records:', error);
      setError('获取记录失败');
    } finally {
      setLoading(false);
    }
  };
  
  const generateTrendAnalysis = async () => {
    if (!user || !user.id) return;
    
    try {
      // 根据环境选择API调用方式
      const isStatic = process.env.DEPLOY_TARGET === 'cloudflare' || process.env.NODE_ENV === 'production';
      
      if (isStatic) {
        // 生产环境使用客户端API
        const trendRecords = await getTrendsClient(user.id, 7);
        const trend = analyzeTrend(trendRecords);
        setTrendData(trend);
      } else {
        // 开发环境使用API路由
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        
        const response = await fetch('/api/trends', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });
        
        if (response.ok) {
          const result = await response.json();
          const trend = analyzeTrend(result.data);
          setTrendData(trend);
        }
      }
    } catch (error) {
      console.error('Error generating trend:', error);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-200 border-t-pink-500 mx-auto mb-4"></div>
          <p className="text-pink-600 font-medium">📋 加载记录中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😿</div>
          <p className="text-rose-600 mb-4 font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-pink px-6 py-3"
          >
            🔄 重试
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 动态背景装饰 */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-16 right-10 w-16 h-16 bg-pink-200 rounded-full opacity-40 animate-float"></div>
        <div className="absolute top-32 left-12 w-20 h-20 bg-rose-200 rounded-full opacity-30 animate-float-delayed"></div>
        <div className="absolute bottom-40 right-16 w-12 h-12 bg-pink-100 rounded-full opacity-50 animate-float-slow"></div>
        <div className="absolute bottom-60 left-8 w-24 h-24 bg-rose-300 rounded-full opacity-20 animate-bounce"></div>
        
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
        <div className="container mx-auto px-6 py-12 pb-24">
          {/* Hero区域 */}
          <div className="text-center mb-12 relative">
            <div className="mb-8 relative">
              {/* 可爱的记录本图标 */}
              <div className="inline-block relative mb-6">
                <div className="text-8xl animate-bounce-gentle filter drop-shadow-lg">📚</div>
                <div className="absolute -top-2 -right-2 text-2xl animate-spin-slow">✨</div>
                <div className="absolute -bottom-1 -left-2 text-xl animate-pulse">💕</div>
              </div>
              
              {/* 标题文字 */}
              <h1 className="text-5xl md:text-6xl font-black mb-4 relative">
                <span className="bg-gradient-to-r from-pink-500 via-rose-400 to-pink-600 bg-clip-text text-transparent drop-shadow-sm">
                  健康记录本
                </span>
                <div className="absolute -top-4 right-0 text-2xl animate-bounce">📋</div>
              </h1>
              
              {/* 副标题 */}
              <div className="space-y-2">
                <p className="text-xl md:text-2xl text-rose-600 font-semibold tracking-wide">
                  💕 毛孩子的健康成长日记 💕
                </p>
                <p className="text-pink-500 font-medium">
                  <span className="inline-block animate-pulse">✨</span>
                  记录每一次关爱 • 见证健康成长
                  <span className="inline-block animate-pulse">✨</span>
                </p>
              </div>
            </div>
          </div>

          {/* 健康趋势卡片 */}
          {trendData && (
            <div className="mb-8 relative">
              {/* 装饰性光环 */}
              <div className="absolute -inset-4 bg-gradient-to-r from-pink-200/30 to-rose-200/30 rounded-3xl blur-xl animate-pulse"></div>
              
              <div className="relative bg-gradient-to-br from-white/90 via-pink-50/70 to-white/85 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-pink-200/50 overflow-hidden">
                {/* 顶部装饰波浪 */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-300 via-rose-300 to-pink-300"></div>
                
                {/* 装饰sparkles */}
                <div className="absolute top-4 right-4 text-2xl animate-pulse opacity-60">✨</div>
                <div className="absolute bottom-4 left-4 text-xl animate-bounce opacity-50">📈</div>
                
                <div className="text-center mb-6">
                  <div className="inline-flex items-center bg-gradient-to-r from-pink-100 to-rose-100 rounded-2xl px-6 py-3 border border-pink-200 mb-4">
                    <span className="text-3xl mr-3 animate-bounce-gentle">📈</span>
                    <h2 className="font-black text-2xl text-pink-600">
                      7天健康趋势
                    </h2>
                    <span className="text-2xl ml-3 animate-pulse">💖</span>
                  </div>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-pink-200/50 shadow-lg">
                  <p className="text-pink-700 font-semibold leading-relaxed text-center text-lg">
                    {trendData.summary}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 记录列表或空状态 */}
          {records.length === 0 ? (
            <div className="text-center py-16 relative">
              {/* 装饰性光环 */}
              <div className="absolute -inset-8 bg-gradient-to-r from-pink-200/20 to-rose-200/20 rounded-3xl blur-2xl"></div>
              
              <div className="relative bg-gradient-to-br from-white/80 via-pink-50/60 to-white/80 backdrop-blur-sm rounded-3xl p-12 border border-pink-200/50 shadow-xl overflow-hidden">
                {/* 装饰元素 */}
                <div className="absolute top-6 left-6 text-2xl animate-float opacity-40">🌸</div>
                <div className="absolute top-6 right-6 text-2xl animate-bounce opacity-40">✨</div>
                <div className="absolute bottom-6 left-8 text-xl animate-pulse opacity-40">💕</div>
                <div className="absolute bottom-6 right-8 text-xl animate-spin-slow opacity-30">🌺</div>
                
                <div className="text-8xl mb-8 animate-bounce-gentle">🌸</div>
                <h3 className="text-3xl font-black text-rose-600 mb-4">还没有记录哦~</h3>
                <p className="text-pink-500 font-semibold mb-10 leading-relaxed text-lg max-w-md mx-auto">
                  开始为毛孩子创建第一个健康档案吧！
                  <br />
                  <span className="text-pink-400">让AI守护TA的每一天 ✨</span>
                </p>
                
                <button 
                  onClick={() => window.location.href = '/'}
                  className="relative inline-block group"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 to-rose-400 rounded-2xl opacity-60 blur group-hover:opacity-80 transition duration-300"></div>
                  <div className="relative bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 text-white font-black py-5 px-10 rounded-2xl shadow-lg transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl border border-pink-300">
                    <div className="flex items-center space-x-3 text-xl">
                      <span className="text-2xl animate-bounce">📸</span>
                      <span>立即开始检测</span>
                      <span className="text-2xl animate-bounce" style={{animationDelay: '0.5s'}}>💝</span>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="inline-flex items-center bg-gradient-to-r from-pink-100 to-rose-100 rounded-2xl px-6 py-3 border border-pink-200">
                  <span className="text-2xl mr-3 animate-pulse">📋</span>
                  <p className="font-black text-xl text-pink-600">
                    共 {records.length} 条健康记录
                  </p>
                  <span className="text-2xl ml-3 animate-bounce">💖</span>
                </div>
              </div>
              
              <div className="records-list space-y-6">
                {records.map((record, index) => (
                  <div key={record.id} className="animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                    <ResultCard record={record} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 底部导航栏 */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-pink-200/50 shadow-2xl">
          <div className="flex justify-around py-4 px-6">
            <button 
              className="flex flex-col items-center group"
              onClick={() => window.location.href = '/'}
            >
              <div className="text-3xl mb-1 group-hover:scale-110 transition-all duration-300 opacity-70 group-hover:opacity-100">📸</div>
              <span className="text-sm font-medium text-rose-400 group-hover:text-rose-600">识别</span>
            </button>
            
            <button className="flex flex-col items-center group relative">
              <div className="relative">
                <div className="text-3xl mb-1 group-hover:scale-110 transition-all duration-300 heart-pulse">📋</div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full animate-pulse shadow-lg"></div>
              </div>
              <span className="text-sm font-semibold text-pink-600 group-hover:text-pink-700">历史</span>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full opacity-80"></div>
            </button>
          </div>
        </nav>

        {showProfile && (
          <UserProfile onClose={() => setShowProfile(false)} />
        )}
        
        {/* PWA组件 */}
        <OfflineIndicator />
      </div>
    </div>
  );
}