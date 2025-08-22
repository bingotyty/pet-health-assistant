import { useState, useEffect } from 'react';
import { useTranslations } from '../lib/i18n';
import { compressImage } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { analyzePoopClient } from '../lib/client-api';
import { supabase } from '../lib/supabase';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Camera, Image, Upload, Sparkles, Heart, Star, Zap, Shield, Clock } from 'lucide-react';

export default function UploadComponentNew({ onAnalysisComplete, onLoading }) {
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deviceCapabilities, setDeviceCapabilities] = useState({
    hasCamera: false,
    isIOS: false,
    isPWA: false,
    isMobile: false
  });
  const { user } = useAuth();
  const t = useTranslations();

  useEffect(() => {
    // 检测设备能力
    const checkDeviceCapabilities = () => {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isPWA = window.matchMedia('(display-mode: standalone)').matches;
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const hasCamera = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);

      setDeviceCapabilities({
        hasCamera,
        isIOS,
        isPWA,
        isMobile
      });
    };

    checkDeviceCapabilities();
  }, []);

  const handleFileUpload = async (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert(t('errors.invalid_file'));
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert(t('errors.file_too_large'));
      return;
    }

    onLoading(true);
    setUploadProgress(0);

    try {
      // 模拟上传进度
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      const compressedFile = await compressImage(file);
      
      // 检查用户登录状态
      if (!user || !user.id) {
        throw new Error(t('errors.login_required'));
      }
      
      setUploadProgress(95);
      
      // 统一使用服务端API路由（安全方式）
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error(t('errors.login_required'));
      }
      
      const formData = new FormData();
      formData.append('image', compressedFile);
      
      const response = await fetch('/api/analyze-poop', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || t('errors.analysis_failed'));
      }

      const result = await response.json();
      setUploadProgress(100);
      onAnalysisComplete(result.data);
      
    } catch (error) {
      console.error('Analysis failed:', error);
      alert(error.message || t('errors.analysis_failed'));
      setUploadProgress(0);
    } finally {
      onLoading(false);
      setTimeout(() => setUploadProgress(0), 2000);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    handleFileUpload(file);
  };

  // 专门的拍照功能
  const handleCameraCapture = () => {
    const cameraInput = document.getElementById('camera-input');
    if (cameraInput) {
      cameraInput.click();
    }
  };

  // 从相册选择
  const handleGallerySelect = () => {
    const galleryInput = document.getElementById('gallery-input');
    if (galleryInput) {
      galleryInput.click();
    }
  };

  return (
    <div className="space-y-6">
      {/* 主上传区域 */}
      <Card 
        className={`relative overflow-hidden transition-all duration-300 bg-white/90 backdrop-blur-sm border-2 border-dashed ${
          dragOver 
            ? 'border-pink-400 bg-pink-50/80 scale-105' 
            : 'border-pink-200 hover:border-pink-300 hover:bg-white'
        } shadow-lg hover:shadow-xl rounded-2xl`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="p-12 text-center">
          <div className="space-y-6">
            {/* 上传图标 */}
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
              <Upload className="w-10 h-10 text-pink-500" />
            </div>

            {/* 标题和描述 */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-800">
                上传宠物粪便照片
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                拖拽文件到此处，或点击下方按钮选择文件
              </p>
            </div>

          {/* 隐藏的文件输入 */}
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleInputChange}
            className="hidden"
            id="camera-input"
          />
          
          <input
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
            id="gallery-input"
          />

            {/* 按钮组 */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={handleCameraCapture}
                  size="lg"
                  className="px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  拍照上传
                </Button>

                <div className="flex items-center">
                  <span className="text-gray-400 text-sm">或</span>
                </div>

                <Button 
                  onClick={handleGallerySelect}
                  variant="outline"
                  size="lg"
                  className="px-8 py-4 border-2 border-pink-300 text-pink-600 hover:bg-pink-50 font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <Image className="w-5 h-5 mr-2" />
                  相册选择
                </Button>
              </div>
              
              {/* 简化的特性展示 */}
              <div className="flex justify-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span>秒级分析</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>隐私保护</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span>24/7可用</span>
                </div>
              </div>
            </div>

            {/* 进度条 */}
            {uploadProgress > 0 && (
              <div className="mt-6 p-4 bg-pink-50 rounded-xl border border-pink-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-pink-600">上传中...</span>
                  <span className="text-sm text-pink-600">{Math.round(uploadProgress)}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
          </div>

          {/* 拖拽覆盖层 */}
          {dragOver && (
            <div className="absolute inset-0 bg-pink-100/80 flex items-center justify-center rounded-2xl border-4 border-dashed border-pink-400">
              <div className="text-center">
                <Upload className="w-12 h-12 text-pink-500 mx-auto mb-2" />
                <p className="text-pink-600 font-semibold">释放文件上传</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* iOS 提示 */}
      {deviceCapabilities.isIOS && (
        <Card className="bg-gradient-to-br from-blue-50/80 via-indigo-50/60 to-cyan-50/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center mb-4 space-x-2">
              <div className="text-3xl animate-bounce">🍎</div>
              <Badge variant="outline" className="px-3 py-1 bg-blue-100 text-blue-700 border-blue-200">
                iOS 优化提示
              </Badge>
              <div className="text-3xl animate-bounce" style={{animationDelay: '0.2s'}}>📸</div>
            </div>
            <div className="space-y-3">
              <h4 className="text-lg font-bold text-blue-700">
                为了获得最佳拍照体验
              </h4>
              <p className="text-blue-600 leading-relaxed">
                建议使用"拍照上传"按钮，可直接调用相机获得最佳图片质量
                {deviceCapabilities.isPWA && (
                  <>
                    <br />
                    <Badge variant="success" className="mt-2">
                      PWA模式已启用 - 体验更流畅
                    </Badge>
                  </>
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}