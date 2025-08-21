import { useState } from 'react';
import UploadComponent from '../components/UploadComponent';
import ResultCard from '../components/ResultCard';

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalysisComplete = (result) => {
    setAnalysisResult(result);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🐾 宠物粪便健康识别
          </h1>
          <p className="text-gray-600">
            通过AI技术帮助您了解宠物的健康状况
          </p>
        </header>

        <div className="max-w-md mx-auto">
          <UploadComponent 
            onAnalysisComplete={handleAnalysisComplete}
            onLoading={setLoading}
          />
          
          {loading && (
            <div className="mt-6 text-center">
              <div className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-50">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                <span className="text-blue-600">正在分析中...</span>
              </div>
            </div>
          )}

          {analysisResult && (
            <div className="mt-6">
              <ResultCard record={analysisResult} />
            </div>
          )}
        </div>

        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
          <div className="flex justify-around py-2">
            <button className="flex flex-col items-center py-2 px-4 text-blue-600">
              <span className="text-lg">📸</span>
              <span className="text-xs">识别</span>
            </button>
            <button 
              className="flex flex-col items-center py-2 px-4 text-gray-600"
              onClick={() => window.location.href = '/history'}
            >
              <span className="text-lg">📋</span>
              <span className="text-xs">历史</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}