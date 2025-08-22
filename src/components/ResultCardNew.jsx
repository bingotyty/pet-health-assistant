import { useTranslations } from '../lib/i18n';
import { formatDate } from '../lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { 
  CheckCircle, 
  AlertTriangle, 
  AlertCircle, 
  Calendar,
  Eye,
  Palette,
  Droplets,
  Bug,
  Sparkles,
  Heart,
  TrendingUp
} from 'lucide-react';

// 风险等级配置
const getRiskConfig = (level) => {
  const configs = {
    'low': {
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      emoji: '✅',
      gradient: 'from-emerald-50 to-green-50'
    },
    'medium': {
      icon: AlertTriangle,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      emoji: '⚠️',
      gradient: 'from-amber-50 to-yellow-50'
    },
    'high': {
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      emoji: '❌',
      gradient: 'from-red-50 to-rose-50'
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

export default function ResultCardNew({ record }) {
  const t = useTranslations();
  const riskConfig = getRiskConfig(record.risk_level);
  const RiskIcon = riskConfig.icon;

  return (
    <Card className={`relative overflow-hidden transition-all duration-500 hover:shadow-3xl hover:scale-[1.03] ${riskConfig.borderColor} bg-gradient-to-br ${riskConfig.gradient} card-modern animate-in slide-in-from-bottom-8 fade-in-0 duration-700 border-0 shadow-2xl`}>
      {/* 装饰性背景 */}
      <div className="absolute top-0 right-0 w-40 h-40 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-rose-400 to-purple-400 rounded-full transform translate-x-20 -translate-y-20 animate-float-slow" />
      </div>
      <div className="absolute bottom-0 left-0 w-24 h-24 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-400 via-pink-400 to-rose-400 rounded-full transform -translate-x-12 translate-y-12 animate-float-delayed" />
      </div>
      
      {/* 状态指示器 */}
      <div className={`absolute top-6 right-6 w-4 h-4 ${riskConfig.bgColor} rounded-full border-3 border-white shadow-lg animate-pulse`}></div>
      <div className={`absolute top-5 right-5 w-6 h-6 ${riskConfig.bgColor} rounded-full opacity-30 animate-ping`}></div>

      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className={`relative w-16 h-16 ${riskConfig.bgColor} rounded-3xl flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-xl`}>
              <RiskIcon className={`w-8 h-8 ${riskConfig.color}`} />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md">
                <span className="text-xs">{riskConfig.emoji}</span>
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl mb-2 font-bold">
                {t(`result_card.risk_levels.${record.risk_level}`)}
              </CardTitle>
              <div className="flex items-center text-base text-pink-600/80 font-medium">
                <Calendar className="w-5 h-5 mr-2" />
                {formatDate(record.created_at)}
              </div>
            </div>
          </div>
          
          {/* 趋势指示器 */}
          <div className="flex items-center space-x-2 opacity-60 hover:opacity-100 transition-opacity duration-300">
            <div className="p-2 bg-white/50 rounded-full shadow-sm hover:shadow-md transition-shadow duration-200">
              <TrendingUp className="w-5 h-5 text-pink-500" />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* 分析结果网格 */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 space-y-6 shadow-lg">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-pink-100 to-rose-100 rounded-xl">
              <Eye className="w-6 h-6 text-pink-600" />
            </div>
            <h4 className="font-bold text-pink-700 text-xl">{t('result_card.analysis_result')}</h4>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            {/* 颜色 */}
            <div className="flex items-center space-x-4 p-4 bg-white/70 rounded-2xl hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-md">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-100 via-rose-100 to-purple-100 rounded-2xl flex items-center justify-center shadow-md">
                <Palette className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <p className="text-sm text-pink-500/80 font-semibold mb-1">{t('result_card.analysis.color')}</p>
                <p className="font-bold text-pink-700 text-base">{getColorText(record.qwen_analysis?.color)}</p>
              </div>
            </div>

            {/* 质地 */}
            <div className="flex items-center space-x-4 p-4 bg-white/70 rounded-2xl hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-md">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 via-cyan-100 to-teal-100 rounded-2xl flex items-center justify-center shadow-md">
                <Droplets className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-blue-500/80 font-semibold mb-1">{t('result_card.analysis.texture')}</p>
                <p className="font-bold text-blue-700 text-base">{getTextureText(record.qwen_analysis?.texture)}</p>
              </div>
            </div>

            {/* 血丝 */}
            <div className="flex items-center space-x-4 p-4 bg-white/70 rounded-2xl hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-md">
              <div className="w-12 h-12 bg-gradient-to-br from-red-100 via-rose-100 to-pink-100 rounded-2xl flex items-center justify-center shadow-md">
                <span className="text-2xl filter drop-shadow-sm">🩸</span>
              </div>
              <div>
                <p className="text-sm text-red-500/80 font-semibold mb-1">{t('result_card.analysis.blood')}</p>
                <p className="font-bold text-red-700 text-base">
                  {record.qwen_analysis?.blood ? t('result_card.analysis.yes') : t('result_card.analysis.no')}
                </p>
              </div>
            </div>

            {/* 寄生虫 */}
            <div className="flex items-center space-x-4 p-4 bg-white/70 rounded-2xl hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-md">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-100 via-amber-100 to-yellow-100 rounded-2xl flex items-center justify-center shadow-md">
                <Bug className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-orange-500/80 font-semibold mb-1">{t('result_card.analysis.worms')}</p>
                <p className="font-bold text-orange-700 text-base">
                  {record.qwen_analysis?.worms ? t('result_card.analysis.suspected') : t('result_card.analysis.not_found')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 健康建议 */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-lg">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-pink-100 to-rose-100 rounded-xl">
              <Heart className="w-6 h-6 text-pink-600 fill-current" />
            </div>
            <h4 className="font-bold text-pink-700 text-xl">{t('result_card.health_advice')}</h4>
          </div>
          <div className="prose prose-pink max-w-none">
            <div className="p-6 bg-gradient-to-br from-pink-50/80 to-rose-50/80 rounded-2xl border-l-4 border-pink-400">
              <p className="text-pink-700/90 leading-relaxed whitespace-pre-line text-base font-medium">
                {record.gpt_report}
              </p>
            </div>
          </div>
        </div>

        {/* 底部操作按钮 */}
        <div className="flex items-center justify-between pt-6">
          <div className="flex items-center space-x-3 text-sm text-pink-500">
            <div className="p-1 bg-pink-100 rounded-lg">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-semibold">AI 智能分析</span>
            <div className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
              精准度 95%
            </div>
          </div>
          
          <Button 
            size="sm"
            className="px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            查看详情
          </Button>
        </div>
      </CardContent>

      {/* 悬浮装饰 */}
      <div className="absolute -bottom-3 -right-3 w-20 h-20 bg-gradient-to-br from-pink-300/30 to-rose-300/30 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute -top-3 -left-3 w-16 h-16 bg-gradient-to-tr from-purple-300/20 to-pink-300/20 rounded-full blur-xl animate-float-slow"></div>
    </Card>
  );
}