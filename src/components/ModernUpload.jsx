import { useState, useEffect } from 'react';
import { useTranslations } from '../lib/i18n';
import { compressImage } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Camera, Image, Upload, Sparkles, Zap, Shield, Clock, Plus } from 'lucide-react';

export default function ModernUpload({ onAnalysisComplete, onLoading }) {
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
      alert('请选择图片文件');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('文件过大，请选择小于10MB的图片');
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
        throw new Error('请先登录');
      }
      
      setUploadProgress(95);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('请先登录');
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
        let errorData;
        try {
          const responseText = await response.text();
          errorData = responseText ? JSON.parse(responseText) : {};
        } catch (e) {
          errorData = { message: `服务器错误 (${response.status})` };
        }
        throw new Error(errorData.message || `分析失败 (${response.status})`);
      }

      const responseText = await response.text();
      if (!responseText) {
        throw new Error('服务器返回空响应，请稍后再试');
      }
      
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        console.error('JSON解析错误:', responseText);
        throw new Error('服务器响应格式错误，请稍后再试');
      }
      setUploadProgress(100);
      onAnalysisComplete(result.data);
      
    } catch (error) {
      console.error('Analysis failed:', error);
      alert(error.message || '分析失败，请重试');
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
    <div className="max-w-2xl mx-auto space-y-6">
      {/* 现代化上传卡片 */}
      <div className="relative overflow-hidden bg-gradient-to-br from-white via-pink-50/30 to-rose-50/30 rounded-3xl shadow-xl border border-pink-100/50 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-transparent to-rose-500/5"></div>
        
        {/* 装饰性元素 */}
        <div className="absolute top-6 right-6 w-12 h-12 bg-gradient-to-br from-pink-400/20 to-rose-400/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-6 left-6 w-8 h-8 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full animate-bounce"></div>
        
        <div className="relative z-10 p-8">
          {/* 拖拽上传区域 */}
          <div 
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
              dragOver 
                ? 'border-pink-400 bg-pink-50/80 scale-[1.02]' 
                : 'border-pink-200/60 hover:border-pink-300 bg-white/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {/* 中央上传图标 */}
            <div className="relative mb-6">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
                <Upload className="w-10 h-10 text-pink-500" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center animate-bounce">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>

            {/* 标题和描述 */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                上传宠物粪便照片
              </h3>
              <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                拖拽图片到此处，或点击下方按钮选择图片文件
              </p>
            </div>

            {/* 现代化按钮组 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button 
                onClick={handleCameraCapture}
                className="group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-pink-500 via-pink-600 to-rose-500 hover:from-pink-600 hover:via-rose-600 hover:to-rose-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-shimmer"></div>
                <Camera className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                📸 拍照上传
              </Button>

              <div className="flex items-center">
                <div className="hidden sm:block w-px h-8 bg-gradient-to-b from-transparent via-gray-300 to-transparent mx-4"></div>
                <span className="sm:hidden text-gray-400 text-sm">或</span>
              </div>

              <Button 
                onClick={handleGallerySelect}
                variant="outline"
                className="group px-8 py-4 border-2 border-pink-200 text-pink-600 hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 hover:border-pink-300 font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Image className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                🖼️ 相册选择
              </Button>
            </div>

            {/* 拖拽覆盖层 */}
            {dragOver && (
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-rose-400/20 to-purple-500/20 flex items-center justify-center rounded-2xl backdrop-blur-sm border-2 border-dashed border-pink-400">
                <div className="text-center bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
                  <Upload className="w-12 h-12 text-pink-500 mx-auto mb-3 animate-bounce" />
                  <p className="text-pink-600 font-bold text-lg">释放文件开始分析</p>
                  <p className="text-pink-500 text-sm mt-1">AI将立即为您提供专业报告</p>
                </div>
              </div>
            )}

            {/* 进度条 */}
            {uploadProgress > 0 && (
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm font-semibold text-pink-600">AI正在分析中...</span>
                    </div>
                    <span className="text-sm font-bold text-pink-600">{Math.round(uploadProgress)}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2 bg-pink-100" />
                  <div className="flex justify-center space-x-1 mt-3">
                    <div className="w-1 h-1 bg-pink-400 rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-1 h-1 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 特性展示卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="group bg-gradient-to-br from-white via-green-50/30 to-emerald-50/30 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-green-100/50">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-bold text-green-700 mb-1">⚡ 秒级分析</h4>
            <p className="text-xs text-green-600">AI智能识别</p>
          </div>
        </div>

        <div className="group bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/30 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-blue-100/50">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-bold text-blue-700 mb-1">🔒 隐私保护</h4>
            <p className="text-xs text-blue-600">数据安全加密</p>
          </div>
        </div>

        <div className="group bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-purple-100/50">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-bold text-purple-700 mb-1">⏰ 24/7可用</h4>
            <p className="text-xs text-purple-600">随时随地使用</p>
          </div>
        </div>
      </div>

      {/* iOS 优化提示 */}
      {deviceCapabilities.isIOS && (
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border border-blue-200/50 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="text-3xl animate-bounce">🍎</div>
            <div className="flex-1">
              <h4 className="font-bold text-blue-800 mb-1">iOS 优化提示</h4>
              <p className="text-blue-700 text-sm">建议使用"拍照上传"功能，可直接调用相机获得最佳图片质量</p>
            </div>
            <div className="text-2xl animate-pulse">📸</div>
          </div>
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