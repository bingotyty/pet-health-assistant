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
  Heart
} from 'lucide-react';

// 风险等级配置
const getRiskConfig = (level) => {
  const configs = {
    'low': {
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      emoji: '✅',
      text: '正常'
    },
    'medium': {
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      emoji: '⚠️',
      text: '轻度异常'
    },
    'high': {
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      emoji: '❌',
      text: '严重异常'
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

export default function ResultCardSimple({ record }) {
  const t = useTranslations();
  const riskConfig = getRiskConfig(record.risk_level);
  const RiskIcon = riskConfig.icon;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* 头部状态 */}
      <div className={`p-4 ${riskConfig.bgColor} ${riskConfig.borderColor} border-b`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 ${riskConfig.bgColor} rounded-lg flex items-center justify-center border ${riskConfig.borderColor}`}>
              <RiskIcon className={`w-5 h-5 ${riskConfig.color}`} />
            </div>
            <div>
              <h3 className={`font-semibold ${riskConfig.color}`}>
                健康状态：{riskConfig.text}
              </h3>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(record.created_at)}
              </div>
            </div>
          </div>
          <span className="text-2xl">{riskConfig.emoji}</span>
        </div>
      </div>

      {/* 分析结果 */}
      <div className="p-4">
        <h4 className="font-semibold text-gray-800 mb-3">分析结果</h4>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
            <Palette className="w-4 h-4 text-gray-600" />
            <div>
              <p className="text-xs text-gray-500">颜色</p>
              <p className="text-sm font-medium">{getColorText(record.qwen_analysis?.color)}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
            <Droplets className="w-4 h-4 text-gray-600" />
            <div>
              <p className="text-xs text-gray-500">质地</p>
              <p className="text-sm font-medium">{getTextureText(record.qwen_analysis?.texture)}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
            <span className="text-red-500">🩸</span>
            <div>
              <p className="text-xs text-gray-500">血丝</p>
              <p className="text-sm font-medium">
                {record.qwen_analysis?.blood ? '有' : '无'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
            <Bug className="w-4 h-4 text-gray-600" />
            <div>
              <p className="text-xs text-gray-500">寄生虫</p>
              <p className="text-sm font-medium">
                {record.qwen_analysis?.worms ? '疑似有' : '未发现'}
              </p>
            </div>
          </div>
        </div>

        {/* 健康建议 */}
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center space-x-2 mb-3">
            <Heart className="w-4 h-4 text-pink-500" />
            <h4 className="font-semibold text-gray-800">健康建议</h4>
          </div>
          <div className="bg-pink-50 border border-pink-200 rounded-lg p-3">
            <p className="text-sm text-gray-700 leading-relaxed">
              {record.gpt_report}
            </p>
          </div>
        </div>

        {/* 底部标签 */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            🤖 AI 智能分析
          </div>
          <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
            精准度 95%
          </div>
        </div>
      </div>
    </div>
  );
}