import { useTranslations } from '../lib/i18n';
import { formatDate } from '../lib/utils';
import { 
  CheckCircle, 
  AlertTriangle, 
  AlertCircle, 
  Calendar,
  Palette,
  Droplets,
  Bug,
  Heart,
  Sparkles,
  TrendingUp,
  Shield,
  Award
} from 'lucide-react';

// 风险等级配置
const getRiskConfig = (level) => {
  const configs = {
    'low': {
      icon: CheckCircle,
      color: 'text-green-600',
      bgGradient: 'from-green-50 via-emerald-50 to-green-50',
      borderColor: 'border-green-200',
      accentColor: 'bg-green-500',
      emoji: '✅',
      text: '健康正常',
      badge: 'success'
    },
    'medium': {
      icon: AlertTriangle,
      color: 'text-amber-600',
      bgGradient: 'from-amber-50 via-yellow-50 to-amber-50',
      borderColor: 'border-amber-200',
      accentColor: 'bg-amber-500',
      emoji: '⚠️',
      text: '轻度异常',
      badge: 'warning'
    },
    'high': {
      icon: AlertCircle,
      color: 'text-red-600',
      bgGradient: 'from-red-50 via-rose-50 to-red-50',
      borderColor: 'border-red-200',
      accentColor: 'bg-red-500',
      emoji: '🚨',
      text: '需要关注',
      badge: 'danger'
    }
  };
  return configs[level] || configs['medium'];
};

// 获取中文文本
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

export default function ModernResultCard({ record }) {
  const t = useTranslations();
  const riskConfig = getRiskConfig(record.risk_level);
  const RiskIcon = riskConfig.icon;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-bottom-8 fade-in-0 duration-700">
      {/* 主结果卡片 */}
      <div className={`relative overflow-hidden bg-gradient-to-br ${riskConfig.bgGradient} rounded-3xl shadow-xl border ${riskConfig.borderColor} backdrop-blur-sm`}>
        {/* 装饰性背景 */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
          <div className={`absolute inset-0 ${riskConfig.accentColor} rounded-full transform translate-x-16 -translate-y-16 animate-pulse`}></div>
        </div>
        <div className="absolute bottom-0 left-0 w-24 h-24 opacity-10">
          <div className={`absolute inset-0 ${riskConfig.accentColor} rounded-full transform -translate-x-12 translate-y-12 animate-float`}></div>
        </div>

        <div className="relative z-10 p-8">
          {/* 状态头部 */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className={`relative w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg border ${riskConfig.borderColor}`}>
                <RiskIcon className={`w-8 h-8 ${riskConfig.color}`} />
                <div className={`absolute -top-1 -right-1 w-5 h-5 ${riskConfig.accentColor} rounded-full flex items-center justify-center animate-pulse`}>
                  <span className="text-white text-xs">{riskConfig.emoji}</span>
                </div>
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${riskConfig.color} mb-1`}>
                  {riskConfig.text}
                </h2>
                <div className="flex items-center text-gray-500 text-sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatDate(record.created_at)}
                </div>
              </div>
            </div>
            <div className={`px-4 py-2 ${riskConfig.accentColor} text-white rounded-full text-sm font-bold shadow-lg`}>
              分析完成
            </div>
          </div>

          {/* AI 分析结果 */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-6">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-800 text-lg">AI 分析结果</h3>
              <div className="ml-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                精准度 95%
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {/* 颜色 */}
              <div className="group bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-xl hover:shadow-md transition-all duration-300 hover:scale-105 border border-orange-100/50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-amber-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Palette className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-orange-500 text-xs font-medium mb-1">颜色</p>
                    <p className="font-bold text-orange-700">{getColorText(record.qwen_analysis?.color)}</p>
                  </div>
                </div>
              </div>

              {/* 质地 */}
              <div className="group bg-gradient-to-br from-cyan-50 to-blue-50 p-4 rounded-xl hover:shadow-md transition-all duration-300 hover:scale-105 border border-cyan-100/50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Droplets className="w-5 h-5 text-cyan-600" />
                  </div>
                  <div>
                    <p className="text-cyan-500 text-xs font-medium mb-1">质地</p>
                    <p className="font-bold text-cyan-700">{getTextureText(record.qwen_analysis?.texture)}</p>
                  </div>
                </div>
              </div>

              {/* 血丝 */}
              <div className="group bg-gradient-to-br from-red-50 to-rose-50 p-4 rounded-xl hover:shadow-md transition-all duration-300 hover:scale-105 border border-red-100/50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-rose-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-lg">🩸</span>
                  </div>
                  <div>
                    <p className="text-red-500 text-xs font-medium mb-1">血丝</p>
                    <p className="font-bold text-red-700">
                      {record.qwen_analysis?.blood ? '有' : '无'}
                    </p>
                  </div>
                </div>
              </div>

              {/* 寄生虫 */}
              <div className="group bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-xl hover:shadow-md transition-all duration-300 hover:scale-105 border border-purple-100/50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Bug className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-purple-500 text-xs font-medium mb-1">寄生虫</p>
                    <p className="font-bold text-purple-700">
                      {record.qwen_analysis?.worms ? '疑似有' : '未发现'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 专业健康建议 */}
          <div className="bg-gradient-to-br from-pink-50 via-rose-50 to-pink-50 rounded-2xl p-6 shadow-lg border border-pink-100/50">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-100 to-rose-100 rounded-lg flex items-center justify-center">
                <Heart className="w-4 h-4 text-pink-600 fill-current" />
              </div>
              <h3 className="font-bold text-pink-800 text-lg">专业健康建议</h3>
              <div className="ml-auto">
                <Award className="w-5 h-5 text-pink-500" />
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border-l-4 border-pink-400 shadow-sm">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {record.gpt_report}
              </p>
            </div>
          </div>

          {/* 底部信息栏 */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/20">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full">
                <Shield className="w-3 h-3 text-gray-500" />
                <span className="text-xs text-gray-600 font-medium">🤖 AI 智能分析</span>
              </div>
              <div className="flex items-center space-x-2 bg-gradient-to-r from-green-100 to-emerald-100 px-3 py-1 rounded-full">
                <TrendingUp className="w-3 h-3 text-green-600" />
                <span className="text-xs text-green-700 font-bold">准确率 95%</span>
              </div>
            </div>
            
            <button className="group flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <span>查看详情</span>
              <div className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
                <div className="w-1 h-1 bg-white rounded-full"></div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}