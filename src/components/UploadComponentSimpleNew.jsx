import { useState, useEffect } from 'react';
import { useTranslations } from '../lib/i18n';
import { compressImage } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Camera, Image, Upload, Zap, Shield, Clock } from 'lucide-react';

export default function UploadComponentSimpleNew({ onAnalysisComplete, onLoading }) {
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
      alert(t('errors.invalid_file') || '请选择图片文件');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert(t('errors.file_too_large') || '文件过大，请选择小于10MB的图片');
      return;
    }

    onLoading(true);
    setUploadProgress(0);

    try {
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
      
      if (!user || !user.id) {
        throw new Error(t('errors.login_required') || '请先登录');
      }
      
      setUploadProgress(95);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error(t('errors.login_required') || '请先登录');
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
        throw new Error(errorData.message || t('errors.analysis_failed') || '分析失败');
      }

      const result = await response.json();
      setUploadProgress(100);
      onAnalysisComplete(result.data);
      
    } catch (error) {
      console.error('Analysis failed:', error);
      alert(error.message || t('errors.analysis_failed') || '分析失败，请重试');
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

  const handleCameraCapture = () => {
    const cameraInput = document.getElementById('camera-input');
    if (cameraInput) {
      cameraInput.click();
    }
  };

  const handleGallerySelect = () => {
    const galleryInput = document.getElementById('gallery-input');
    if (galleryInput) {
      galleryInput.click();
    }
  };

  return (
    <div className="space-y-4">
      {/* 主上传区域 */}
      <div 
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          dragOver 
            ? 'border-pink-400 bg-pink-50' 
            : 'border-gray-300 hover:border-pink-300 bg-white'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          {/* 上传图标 */}
          <div className="w-16 h-16 mx-auto bg-pink-50 rounded-lg flex items-center justify-center">
            <Upload className="w-8 h-8 text-pink-500" />
          </div>

          {/* 标题和描述 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              上传宠物粪便照片
            </h3>
            <p className="text-sm text-gray-500">
              拖拽文件到此处，或点击下方按钮选择文件
            </p>
          </div>

          {/* 按钮组 */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={handleCameraCapture}
              className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Camera className="w-4 h-4 mr-2" />
              拍照上传
            </Button>

            <Button 
              onClick={handleGallerySelect}
              variant="outline"
              className="px-6 py-2 border border-pink-300 text-pink-600 hover:bg-pink-50 text-sm font-medium rounded-lg transition-colors"
            >
              <Image className="w-4 h-4 mr-2" />
              相册选择
            </Button>
          </div>

          {/* 特性标签 */}
          <div className="flex justify-center space-x-4 text-xs text-gray-500">
            <span className="flex items-center space-x-1">
              <Zap className="w-3 h-3" />
              <span>秒级分析</span>
            </span>
            <span className="flex items-center space-x-1">
              <Shield className="w-3 h-3" />
              <span>隐私保护</span>
            </span>
            <span className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>24/7可用</span>
            </span>
          </div>

          {/* 进度条 */}
          {uploadProgress > 0 && (
            <div className="mt-4 p-3 bg-pink-50 rounded-lg border border-pink-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-pink-600">上传中...</span>
                <span className="text-sm text-pink-600">{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} className="h-1" />
            </div>
          )}

          {/* 拖拽覆盖层 */}
          {dragOver && (
            <div className="absolute inset-0 bg-pink-100/80 flex items-center justify-center rounded-lg">
              <div className="text-center">
                <Upload className="w-10 h-10 text-pink-500 mx-auto mb-2" />
                <p className="text-pink-600 font-medium">释放文件上传</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* iOS 提示 */}
      {deviceCapabilities.isIOS && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-lg">🍎</span>
            <span className="text-sm font-medium text-blue-700">iOS 优化提示</span>
          </div>
          <p className="text-xs text-blue-600">
            建议使用"拍照上传"获得更好的图片质量
          </p>
        </div>
      )}
      
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
    </div>
  );
}