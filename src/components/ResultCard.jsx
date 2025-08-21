import { formatDate } from '../lib/utils';

const getColorText = (color) => {
  const colorMap = {
    'brown': '棕色',
    'chocolate_brown': '巧克力色',
    'dark_brown': '深棕色',
    'light_brown': '浅棕色',
    'yellow': '黄色',
    'green': '绿色',
    'dark_red': '深红色',
    'black': '黑色'
  };
  return colorMap[color] || color;
};

const getTextureText = (texture) => {
  const textureMap = {
    'formed': '成型',
    'solid': '坚实',
    'soft': '软便',
    'loose': '松散',
    'watery': '水样',
    'tarry': '焦油状'
  };
  return textureMap[texture] || texture;
};

const getConsistencyText = (consistency) => {
  const consistencyMap = {
    'normal': '正常',
    'well_formed': '成型良好',
    'slightly_soft': '稍软',
    'soft': '软便',
    'loose': '松散',
    'watery': '水样',
    'bloody': '带血',
    'sticky': '粘稠'
  };
  return consistencyMap[consistency] || consistency;
};

const getSizeText = (size) => {
  const sizeMap = {
    'normal': '正常',
    'small': '偏小',
    'slightly_large': '稍大',
    'large_volume': '量大'
  };
  return sizeMap[size] || size || '正常';
};

const getAnalysisSourceIcon = (source) => {
  const iconMap = {
    'openai_vision': '🤖',
    'qwen': '🔍',
    'mock': '📊'
  };
  return iconMap[source] || '🔬';
};

const getAnalysisSourceText = (source) => {
  const textMap = {
    'openai_vision': 'OpenAI GPT-4 Vision分析',
    'qwen': 'Qwen多模态分析',
    'mock': '演示数据'
  };
  return textMap[source] || 'AI智能分析';
};

export default function ResultCard({ record }) {
  const getRiskColor = (level) => {
    const colors = {
      'low': 'text-emerald-600',
      'medium': 'text-amber-600', 
      'high': 'text-rose-600'
    };
    return colors[level] || 'text-pink-400';
  };
  
  const getRiskBg = (level) => {
    const backgrounds = {
      'low': 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200',
      'medium': 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200',
      'high': 'bg-gradient-to-r from-rose-50 to-pink-50 border-rose-200'
    };
    return backgrounds[level] || 'bg-pink-50 border-pink-200';
  };
  
  const getRiskIcon = (level) => {
    const icons = {
      'low': '🌸',
      'medium': '🌼',
      'high': '🌺'
    };
    return icons[level] || '💝';
  };

  const getRiskText = (level) => {
    const texts = {
      'low': '健康正常',
      'medium': '需要关注',
      'high': '建议就医'
    };
    return texts[level] || '分析中';
  };
  
  return (
    <div className="relative group animate-slide-up">
      {/* 装饰性背景光环 */}
      <div className="absolute -inset-2 bg-gradient-to-r from-pink-300/20 to-rose-300/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
      
      <div className="relative bg-gradient-to-br from-white/95 via-pink-50/50 to-white/95 backdrop-blur-sm rounded-3xl border border-pink-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
        {/* 顶部装饰波浪 */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-300 via-rose-300 to-pink-300"></div>
        
        <div className="p-8">
          {/* 主要结果展示区域 */}
          <div className={`${getRiskBg(record.risk_level)} rounded-2xl p-6 mb-8 border-2 relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-300`}>
            {/* 装饰性sparkles */}
            <div className="absolute top-2 right-2 text-xl animate-pulse opacity-60">✨</div>
            <div className="absolute bottom-2 left-2 text-lg animate-bounce opacity-50">💫</div>
            
            <div className="text-center">
              <div className="mb-4">
                <span className="text-6xl filter drop-shadow-lg animate-bounce-gentle inline-block">
                  {getRiskIcon(record.risk_level)}
                </span>
              </div>
              <h3 className={`text-3xl font-black mb-2 ${getRiskColor(record.risk_level)}`}>
                {getRiskText(record.risk_level)}
              </h3>
              <div className="flex items-center justify-center">
                <div className="bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-pink-200/50">
                  <p className="text-sm text-pink-600 font-bold flex items-center">
                    <span className="text-lg mr-2 animate-pulse">🤖</span>
                    AI智能分析结果
                  </p>
                </div>
              </div>
            </div>
          </div>
      
      {record.qwen_analysis && (
        <div className="analysis-details mb-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center bg-gradient-to-r from-rose-100 to-pink-100 rounded-2xl px-6 py-3 border border-rose-200">
              <span className="text-2xl mr-3 animate-spin-slow">🔍</span>
              <h4 className="font-black text-xl text-rose-600">
                详细分析结果
              </h4>
              <span className="text-2xl ml-3 animate-pulse">✨</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="group hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-pink-50 via-white to-rose-50 p-5 rounded-2xl border border-pink-200 shadow-md hover:shadow-lg h-full relative overflow-hidden">
                <div className="absolute top-2 right-2 text-2xl animate-bounce opacity-30">🎨</div>
                <div className="flex items-center mb-3">
                  <span className="text-3xl mr-3 group-hover:animate-bounce">🎨</span>
                  <div>
                    <p className="text-pink-600 font-bold text-sm uppercase tracking-wide">颜色特征</p>
                    <p className="font-black text-xl text-gray-800">{getColorText(record.qwen_analysis.color)}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="group hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-purple-50 via-white to-pink-50 p-5 rounded-2xl border border-purple-200 shadow-md hover:shadow-lg h-full relative overflow-hidden">
                <div className="absolute top-2 right-2 text-2xl animate-pulse opacity-30">✨</div>
                <div className="flex items-center mb-3">
                  <span className="text-3xl mr-3 group-hover:animate-bounce">✨</span>
                  <div>
                    <p className="text-purple-600 font-bold text-sm uppercase tracking-wide">质地状态</p>
                    <p className="font-black text-xl text-gray-800">{getTextureText(record.qwen_analysis.texture)}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="group hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-rose-50 via-white to-pink-50 p-5 rounded-2xl border border-rose-200 shadow-md hover:shadow-lg h-full relative overflow-hidden">
                <div className="absolute top-2 right-2 text-2xl animate-spin-slow opacity-30">🔮</div>
                <div className="flex items-center mb-3">
                  <span className="text-3xl mr-3 group-hover:animate-bounce">🔮</span>
                  <div>
                    <p className="text-rose-600 font-bold text-sm uppercase tracking-wide">形状分析</p>
                    <p className="font-black text-xl text-gray-800">{getConsistencyText(record.qwen_analysis.consistency)}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="group hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-fuchsia-50 via-white to-pink-50 p-5 rounded-2xl border border-fuchsia-200 shadow-md hover:shadow-lg h-full relative overflow-hidden">
                <div className="absolute top-2 right-2 text-2xl animate-float opacity-30">📏</div>
                <div className="flex items-center mb-3">
                  <span className="text-3xl mr-3 group-hover:animate-bounce">📏</span>
                  <div>
                    <p className="text-fuchsia-600 font-bold text-sm uppercase tracking-wide">大小评估</p>
                    <p className="font-black text-xl text-gray-800">{getSizeText(record.qwen_analysis.size)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center bg-gradient-to-r from-pink-100 to-rose-100 rounded-2xl px-6 py-3 border border-pink-200">
                <span className="text-2xl mr-3 animate-pulse">💝</span>
                <h5 className="font-black text-xl text-pink-600">
                  健康指标检查
                </h5>
                <span className="text-2xl ml-3 animate-bounce">🔬</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div className={`group hover:scale-105 transition-all duration-300 ${record.qwen_analysis.blood ? 'animate-pulse' : ''}`}>
                <div className={`p-6 rounded-2xl text-center border-2 shadow-lg hover:shadow-xl transition-all duration-300 ${record.qwen_analysis.blood ? 'bg-gradient-to-br from-red-50 via-pink-50 to-red-50 text-red-600 border-red-300' : 'bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-50 text-emerald-600 border-emerald-300'} relative overflow-hidden`}>
                  <div className="absolute top-2 right-2 text-xl opacity-30 animate-bounce">
                    {record.qwen_analysis.blood ? '⚠️' : '✅'}
                  </div>
                  <div className="flex items-center justify-center mb-2">
                    <span className="text-3xl mr-3 group-hover:animate-bounce">
                      {record.qwen_analysis.blood ? '🩸' : '💚'}
                    </span>
                    <div className="text-left">
                      <p className="font-black text-lg">
                        {record.qwen_analysis.blood ? '检测到血丝' : '无血丝异常'}
                      </p>
                      <p className="text-sm opacity-80 font-medium">
                        {record.qwen_analysis.blood ? '建议关注，必要时就医' : '健康正常指标'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={`group hover:scale-105 transition-all duration-300 ${record.qwen_analysis.mucus ? 'animate-pulse' : ''}`}>
                <div className={`p-6 rounded-2xl text-center border-2 shadow-lg hover:shadow-xl transition-all duration-300 ${record.qwen_analysis.mucus ? 'bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-50 text-amber-600 border-amber-300' : 'bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-50 text-emerald-600 border-emerald-300'} relative overflow-hidden`}>
                  <div className="absolute top-2 right-2 text-xl opacity-30 animate-bounce">
                    {record.qwen_analysis.mucus ? '⚠️' : '✅'}
                  </div>
                  <div className="flex items-center justify-center mb-2">
                    <span className="text-3xl mr-3 group-hover:animate-bounce">
                      {record.qwen_analysis.mucus ? '🟡' : '💚'}
                    </span>
                    <div className="text-left">
                      <p className="font-black text-lg">
                        {record.qwen_analysis.mucus ? '检测到粘液' : '无粘液异常'}
                      </p>
                      <p className="text-sm opacity-80 font-medium">
                        {record.qwen_analysis.mucus ? '可能有消化问题' : '消化系统健康'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={`group hover:scale-105 transition-all duration-300 ${record.qwen_analysis.worms ? 'animate-pulse' : ''}`}>
                <div className={`p-6 rounded-2xl text-center border-2 shadow-lg hover:shadow-xl transition-all duration-300 ${record.qwen_analysis.worms ? 'bg-gradient-to-br from-red-50 via-pink-50 to-red-50 text-red-600 border-red-300' : 'bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-50 text-emerald-600 border-emerald-300'} relative overflow-hidden`}>
                  <div className="absolute top-2 right-2 text-xl opacity-30 animate-bounce">
                    {record.qwen_analysis.worms ? '⚠️' : '✅'}
                  </div>
                  <div className="flex items-center justify-center mb-2">
                    <span className="text-3xl mr-3 group-hover:animate-bounce">
                      {record.qwen_analysis.worms ? '🐛' : '💚'}
                    </span>
                    <div className="text-left">
                      <p className="font-black text-lg">
                        {record.qwen_analysis.worms ? '疑似寄生虫' : '无寄生虫'}
                      </p>
                      <p className="text-sm opacity-80 font-medium">
                        {record.qwen_analysis.worms ? '建议及时驱虫处理' : '体内环境健康'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {record.qwen_analysis.confidence && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-xl border border-purple-100">
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-purple-600 font-medium">🎯 AI置信度</span>
                <span className="font-bold text-purple-700">{Math.round(record.qwen_analysis.confidence * 100)}%</span>
              </div>
              {record.qwen_analysis.analyzed_at && (
                <div className="text-xs text-purple-500">
                  📅 分析时间: {formatDate(record.qwen_analysis.analyzed_at)}
                </div>
              )}
              {record.qwen_analysis.source && (
                <div className="text-xs text-purple-400 flex items-center mt-2">
                  <span className="mr-1">{getAnalysisSourceIcon(record.qwen_analysis.source)}</span>
                  <span>{getAnalysisSourceText(record.qwen_analysis.source)}</span>
                  {record.qwen_analysis.fallback && (
                    <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-600 rounded-full text-xs">
                      💭 演示模式
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {record.gpt_report && (
        <div className="gpt-report mb-4">
          <h4 className="font-bold mb-3 text-rose-600 flex items-center">
            <span className="mr-2">💌</span>
            专属健康建议
          </h4>
          <div className="bg-gradient-to-r from-pink-50 via-rose-50 to-pink-50 p-4 rounded-2xl border-2 border-pink-200 relative overflow-hidden">
            <div className="absolute top-2 right-2 text-pink-300">💝</div>
            <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed font-medium">
              {record.gpt_report}
            </p>
          </div>
        </div>
      )}
      
          {/* 时间戳显示区域 */}
          {record.created_at && (
            <div className="text-center mt-6">
              <div className="inline-flex items-center bg-gradient-to-r from-pink-100/80 to-rose-100/80 backdrop-blur-sm px-6 py-3 rounded-full border border-pink-200/50 shadow-md">
                <span className="text-2xl mr-3 animate-pulse">🕐</span>
                <div className="text-center">
                  <p className="text-pink-600 text-sm font-bold">分析时间</p>
                  <p className="text-pink-500 text-xs font-medium">
                    {formatDate(record.created_at)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}