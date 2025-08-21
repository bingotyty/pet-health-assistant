import { useState, useEffect } from 'react';
import { compressImage } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export default function UploadComponent({ onAnalysisComplete, onLoading }) {
  const [dragOver, setDragOver] = useState(false);
  const [deviceCapabilities, setDeviceCapabilities] = useState({
    hasCamera: false,
    isIOS: false,
    isPWA: false,
    isMobile: false
  });
  const { user } = useAuth();

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

      console.log('🔍 设备检测结果:', {
        hasCamera,
        isIOS,
        isPWA,
        isMobile,
        userAgent: navigator.userAgent.substring(0, 50) + '...'
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
      alert('图片大小不能超过10MB');
      return;
    }

    onLoading(true);

    try {
      const compressedFile = await compressImage(file);
      
      // 获取用户会话token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('用户未登录');
      }
      
      // 使用API端点进行分析
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
        throw new Error(errorData.message || '分析失败');
      }

      const result = await response.json();
      onAnalysisComplete(result.data);
      
    } catch (error) {
      console.error('Analysis failed:', error);
      alert(error.message || '分析失败，请重试');
    } finally {
      onLoading(false);
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
    console.log('📸 启动拍照功能...');
    const cameraInput = document.getElementById('camera-input');
    if (cameraInput) {
      cameraInput.click();
    }
  };

  // 从相册选择
  const handleGallerySelect = () => {
    console.log('🖼️ 打开相册选择...');
    const galleryInput = document.getElementById('gallery-input');
    if (galleryInput) {
      galleryInput.click();
    }
  };

  return (
    <div className="upload-container space-y-6">
      <div
        className={`relative group transition-all duration-500 transform ${
          dragOver 
            ? 'scale-105 shadow-2xl border-pink-400' 
            : 'hover:scale-[1.02] hover:shadow-xl border-pink-200'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* 装饰性背景动画 */}
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-300 to-rose-300 rounded-2xl opacity-20 blur-lg animate-pulse"></div>
        
        <div className={`relative bg-gradient-to-br from-white/90 via-pink-50/80 to-rose-50/70 backdrop-blur-sm rounded-2xl border-2 border-dashed p-10 text-center overflow-hidden ${
          dragOver ? 'border-pink-400 bg-pink-100/50' : 'border-pink-200'
        }`}>
          
          {/* 动态装饰元素 */}
          <div className="absolute top-4 left-4 text-2xl animate-bounce-gentle opacity-60">🌸</div>
          <div className="absolute top-4 right-4 text-xl animate-float opacity-50">✨</div>
          <div className="absolute bottom-4 left-6 text-lg animate-pulse opacity-40">💕</div>
          <div className="absolute bottom-4 right-6 text-xl animate-spin-slow opacity-30">🌺</div>
          
          {/* 主要拍照图标 */}
          <div className="mb-6 relative">
            <div className="inline-block relative">
              <div className="text-7xl filter drop-shadow-lg animate-bounce-gentle">📷</div>
              <div className="absolute -top-2 -right-2 text-2xl animate-bounce">✨</div>
              <div className="absolute -bottom-1 -left-2 text-xl animate-pulse">💝</div>
            </div>
          </div>
          
          {/* 标题文字 */}
          <h3 className="text-2xl font-black text-rose-600 mb-3 relative">
            <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 bg-clip-text text-transparent">
              📸 智能识别毛孩便便
            </span>
          </h3>
          
          <p className="text-pink-500 mb-8 font-semibold text-lg">
            <span className="inline-block animate-pulse">💕</span>
            轻松拖拽或点击上传照片
            <span className="inline-block animate-pulse">💕</span>
          </p>

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
          
          {/* 拍照和相册选择按钮 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* 拍照按钮 */}
            <button
              onClick={handleCameraCapture}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 to-rose-400 rounded-2xl opacity-60 blur group-hover:opacity-80 transition duration-300"></div>
              <div className="relative bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl border border-pink-300 min-w-[160px]">
                <div className="flex flex-col items-center space-y-2">
                  <span className="text-3xl animate-bounce">📸</span>
                  <span className="text-sm font-black">立即拍照</span>
                  {deviceCapabilities.isPWA && (
                    <span className="text-xs bg-white/20 px-2 py-1 rounded-full">PWA模式</span>
                  )}
                </div>
              </div>
            </button>

            {/* 分隔符 */}
            <div className="flex items-center">
              <div className="text-pink-400 font-bold text-sm">或</div>
            </div>

            {/* 相册选择按钮 */}
            <button
              onClick={handleGallerySelect}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-rose-400 to-pink-400 rounded-2xl opacity-60 blur group-hover:opacity-80 transition duration-300"></div>
              <div className="relative bg-gradient-to-r from-rose-400 via-pink-400 to-rose-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl border border-rose-300 min-w-[160px]">
                <div className="flex flex-col items-center space-y-2">
                  <span className="text-3xl animate-pulse">🖼️</span>
                  <span className="text-sm font-black">选择相册</span>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">本地图片</span>
                </div>
              </div>
            </button>
          </div>
          
          {/* 宠物类型标签 */}
          <div className="mt-8 flex justify-center space-x-4">
            <div className="group">
              <div className="bg-gradient-to-r from-pink-100 to-pink-200 hover:from-pink-200 hover:to-pink-300 px-4 py-2 rounded-full transition-all duration-300 transform group-hover:scale-110 shadow-md group-hover:shadow-lg border border-pink-200">
                <span className="text-pink-600 text-sm font-bold flex items-center">
                  <span className="text-lg mr-1 group-hover:animate-bounce">🐱</span>
                  猫咪宝贝
                </span>
              </div>
            </div>
            <div className="group">
              <div className="bg-gradient-to-r from-rose-100 to-rose-200 hover:from-rose-200 hover:to-rose-300 px-4 py-2 rounded-full transition-all duration-300 transform group-hover:scale-110 shadow-md group-hover:shadow-lg border border-rose-200">
                <span className="text-rose-600 text-sm font-bold flex items-center">
                  <span className="text-lg mr-1 group-hover:animate-bounce">🐶</span>
                  狗狗宝宝
                </span>
              </div>
            </div>
          </div>
          
          {/* 拖拽提示 */}
          {dragOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-pink-100/80 backdrop-blur-sm rounded-2xl animate-fade-in">
              <div className="text-center">
                <div className="text-6xl animate-bounce mb-4">📸</div>
                <p className="text-pink-600 font-bold text-xl">松开鼠标即可上传！</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* 温馨提示卡片 */}
      <div className="bg-gradient-to-r from-pink-50/80 via-white/90 to-rose-50/80 backdrop-blur-sm rounded-2xl p-6 border border-pink-200/50 shadow-lg">
        <div className="text-center">
          <div className="flex justify-center items-center mb-3">
            <span className="text-2xl animate-pulse mr-2">💝</span>
            <p className="text-pink-600 text-lg font-bold">
              AI小贴士
            </p>
            <span className="text-2xl animate-pulse ml-2">💝</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mb-4">
            <div className="group">
              <div className="bg-white/60 rounded-xl p-3 hover:bg-white/80 transition-all duration-300 group-hover:scale-105 shadow-sm group-hover:shadow-md">
                <div className="text-2xl mb-2 group-hover:animate-bounce">📱</div>
                <p className="text-pink-500 text-sm font-medium">支持格式</p>
                <p className="text-pink-400 text-xs">JPG・PNG・WebP</p>
              </div>
            </div>
            
            <div className="group">
              <div className="bg-white/60 rounded-xl p-3 hover:bg-white/80 transition-all duration-300 group-hover:scale-105 shadow-sm group-hover:shadow-md">
                <div className="text-2xl mb-2 group-hover:animate-bounce">🔍</div>
                <p className="text-pink-500 text-sm font-medium">拍照建议</p>
                <p className="text-pink-400 text-xs">清晰・光线充足・正面拍摄</p>
              </div>
            </div>
            
            <div className="group">
              <div className="bg-white/60 rounded-xl p-3 hover:bg-white/80 transition-all duration-300 group-hover:scale-105 shadow-sm group-hover:shadow-md">
                <div className="text-2xl mb-2 group-hover:animate-bounce">⚡</div>
                <p className="text-pink-500 text-sm font-medium">分析速度</p>
                <p className="text-pink-400 text-xs">通常3-5秒</p>
              </div>
            </div>
          </div>

          {/* iOS 专门提示 */}
          {deviceCapabilities.isIOS && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200 mb-4">
              <div className="flex items-center justify-center mb-2">
                <span className="text-2xl mr-2">🍎</span>
                <p className="text-blue-600 font-bold text-sm">iOS 拍照提示</p>
                <span className="text-2xl ml-2">📸</span>
              </div>
              <div className="text-center">
                <p className="text-blue-500 text-xs leading-relaxed">
                  点击"立即拍照"会直接调起相机
                  {deviceCapabilities.isPWA && (
                    <><br />PWA模式下拍照功能完美支持！</>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* 设备能力显示（开发模式） */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <p className="text-gray-600 text-xs font-mono">
                🔧 设备检测: {deviceCapabilities.isMobile ? '移动端' : '桌面端'} 
                {deviceCapabilities.isIOS && ' | iOS'} 
                {deviceCapabilities.isPWA && ' | PWA'} 
                {deviceCapabilities.hasCamera && ' | 摄像头支持'}
              </p>
            </div>
          )}
          
          <p className="text-pink-400 text-xs mt-4 leading-relaxed">
            ✨ 文件大小限制：最大10MB ✨
          </p>
        </div>
      </div>
    </div>
  );
}