import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { analyzeTrend } from '../lib/utils';
import ResultCard from '../components/ResultCard';

export default function HistoryPage() {
  const [records, setRecords] = useState([]);
  const [trendData, setTrendData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchHistoryRecords();
    generateTrendAnalysis();
  }, []);
  
  const fetchHistoryRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('feces_records')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
        
      if (error) throw error;
      
      setRecords(data || []);
    } catch (error) {
      console.error('Error fetching records:', error);
      setError('获取记录失败');
    } finally {
      setLoading(false);
    }
  };
  
  const generateTrendAnalysis = async () => {
    try {
      const { data, error } = await supabase
        .from('feces_records')
        .select('risk_level, created_at')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      const trend = analyzeTrend(data);
      setTrendData(trend);
    } catch (error) {
      console.error('Error generating trend:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            重试
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 pb-20">
        <header className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">健康记录</h1>
          <p className="text-gray-600">查看宠物的健康分析历史</p>
        </header>

        {trendData && (
          <div className="trend-card mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h2 className="text-lg font-semibold mb-2 text-blue-800">📊 7天趋势</h2>
            <p className="text-sm text-blue-700">{trendData.summary}</p>
          </div>
        )}

        {records.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无记录</h3>
            <p className="text-gray-600 mb-6">开始第一次健康检测吧</p>
            <button 
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              立即检测
            </button>
          </div>
        ) : (
          <div className="records-list space-y-4">
            {records.map(record => (
              <ResultCard key={record.id} record={record} />
            ))}
          </div>
        )}

        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
          <div className="flex justify-around py-2">
            <button 
              className="flex flex-col items-center py-2 px-4 text-gray-600"
              onClick={() => window.location.href = '/'}
            >
              <span className="text-lg">📸</span>
              <span className="text-xs">识别</span>
            </button>
            <button className="flex flex-col items-center py-2 px-4 text-blue-600">
              <span className="text-lg">📋</span>
              <span className="text-xs">历史</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}