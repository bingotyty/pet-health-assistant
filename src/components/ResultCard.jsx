import { formatDate } from '../lib/utils';

export default function ResultCard({ record }) {
  const getRiskColor = (level) => {
    const colors = {
      'low': 'text-green-600',
      'medium': 'text-yellow-600', 
      'high': 'text-red-600'
    };
    return colors[level] || 'text-gray-600';
  };
  
  const getRiskIcon = (level) => {
    const icons = {
      'low': '✅',
      'medium': '⚠️',
      'high': '❌'
    };
    return icons[level] || '❓';
  };

  const getRiskText = (level) => {
    const texts = {
      'low': '正常',
      'medium': '轻度异常',
      'high': '严重异常'
    };
    return texts[level] || '未知';
  };
  
  return (
    <div className="result-card bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <span className="text-2xl mr-2">{getRiskIcon(record.risk_level)}</span>
        <h3 className={`text-lg font-semibold ${getRiskColor(record.risk_level)}`}>
          健康状态：{getRiskText(record.risk_level)}
        </h3>
      </div>
      
      {record.qwen_analysis && (
        <div className="analysis-details mb-4">
          <h4 className="font-medium mb-2 text-gray-800">分析结果：</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-gray-50 p-2 rounded">
              <span className="text-gray-600">颜色：</span>
              <span className="font-medium">{record.qwen_analysis.color || '正常'}</span>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <span className="text-gray-600">质地：</span>
              <span className="font-medium">{record.qwen_analysis.texture || '正常'}</span>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <span className="text-gray-600">血丝：</span>
              <span className="font-medium">{record.qwen_analysis.blood ? '有' : '无'}</span>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <span className="text-gray-600">寄生虫：</span>
              <span className="font-medium">{record.qwen_analysis.worms ? '疑似有' : '未发现'}</span>
            </div>
          </div>
          {record.qwen_analysis.confidence && (
            <div className="mt-2 text-xs text-gray-500">
              识别置信度: {Math.round(record.qwen_analysis.confidence * 100)}%
            </div>
          )}
        </div>
      )}
      
      {record.gpt_report && (
        <div className="gpt-report">
          <h4 className="font-medium mb-2 text-gray-800">健康建议：</h4>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
              {record.gpt_report}
            </p>
          </div>
        </div>
      )}
      
      {record.created_at && (
        <div className="timestamp text-xs text-gray-400 mt-4 text-center">
          {formatDate(record.created_at)}
        </div>
      )}
    </div>
  );
}