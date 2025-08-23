import { useState, useEffect } from 'react';
import { useTranslations } from '../lib/i18n';
import { compressImage } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Button } from './ui/button-simple';
import { Card, CardContent } from './ui/card-simple';
import { Progress } from './ui/progress-simple';

export default function UploadComponentSimple({ onAnalysisComplete, onLoading }) {
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
        throw new Error(t('errors.login_required'));
      }
      
      setUploadProgress(95);
      
      // 使用安全的API路由调用（所有环境）
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
    <div className="space-y-8">
      <Card 
        className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl ${
          dragOver ? 'border-pink-400 bg-pink-50/50 scale-[1.02]' : 'hover:scale-[1.01]'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50/80 via-transparent to-rose-50/50 pointer-events-none" />
        <div className="absolute top-4 right-4 text-pink-300/40 animate-bounce">
          <span className="text-2xl">✨</span>
        </div>
        <div className="absolute bottom-4 left-4 text-rose-300/40 animate-pulse">
          <span className="text-xl">💕</span>
        </div>

        <CardContent className="p-12 text-center relative">
          <div className="mb-8 relative">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-pink-100 to-rose-100 rounded-3xl flex items-center justify-center shadow-lg transition-all duration-300">
              <span className="text-4xl animate-bounce">📸</span>
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-white text-xs">⭐</span>
            </div>
          </div>

          <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
            📸 {t('home.upload.title')}
          </h3>
          
          <p className="text-pink-600/80 mb-8 text-lg font-medium">
            💕 {t('home.upload.description')} 💕
          </p>

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

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button 
              onClick={handleCameraCapture}
              size="lg"
              className="group relative overflow-hidden"
            >
              <span className="text-xl mr-2 group-hover:scale-110 transition-transform duration-200">📸</span>
              {t('home.upload.camera_button')}
              {deviceCapabilities.isPWA && (
                <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">PWA</span>
              )}
            </Button>

            <div className="text-pink-400 font-medium text-sm">或</div>

            <Button 
              onClick={handleGallerySelect}
              variant="secondary"
              size="lg"
              className="group"
            >
              <span className="text-xl mr-2 group-hover:scale-110 transition-transform duration-200">🖼️</span>
              {t('home.upload.gallery_button')}
            </Button>
          </div>

          {uploadProgress > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-pink-600">分析中...</span>
                <span className="text-sm font-medium text-pink-600">{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {dragOver && (
            <div className="absolute inset-0 bg-pink-50/90 backdrop-blur-sm flex items-center justify-center rounded-2xl animate-in fade-in-0 zoom-in-95 duration-200">
              <div className="text-center">
                <span className="text-6xl animate-bounce mb-3 block">📤</span>
                <p className="text-pink-700 font-bold text-xl">松开鼠标即可上传！</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="group hover:scale-105 transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
              <span className="text-2xl">📱</span>
            </div>
            <h4 className="font-bold text-pink-600 mb-2">{t('home.upload.tips.format')}</h4>
            <p className="text-sm text-pink-500">{t('home.upload.tips.format_desc')}</p>
          </CardContent>
        </Card>

        <Card className="group hover:scale-105 transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
              <span className="text-2xl">🔍</span>
            </div>
            <h4 className="font-bold text-pink-600 mb-2">{t('home.upload.tips.photo')}</h4>
            <p className="text-sm text-pink-500">{t('home.upload.tips.photo_desc')}</p>
          </CardContent>
        </Card>

        <Card className="group hover:scale-105 transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
              <span className="text-2xl">⚡</span>
            </div>
            <h4 className="font-bold text-pink-600 mb-2">{t('home.upload.tips.speed')}</h4>
            <p className="text-sm text-pink-500">{t('home.upload.tips.speed_desc')}</p>
          </CardContent>
        </Card>
      </div>

      {deviceCapabilities.isIOS && (
        <Card className="border-blue-200 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <span className="text-2xl mr-2">🍎</span>
              <h4 className="text-blue-700 font-bold">{t('home.upload.ios_tips.title')}</h4>
              <span className="text-2xl ml-2">📸</span>
            </div>
            <p className="text-blue-600 text-sm leading-relaxed">
              {t('home.upload.ios_tips.description')}
              {deviceCapabilities.isPWA && (
                <><br />{t('home.upload.ios_tips.pwa_note')}</>
              )}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}