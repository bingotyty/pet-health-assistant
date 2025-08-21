import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { analyzePoopWithQwen, generateHealthReport, determineRiskLevel } from '../lib/ai-service';
import { compressImage } from '../lib/utils';

export default function UploadComponent({ onAnalysisComplete, onLoading }) {
  const [dragOver, setDragOver] = useState(false);

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
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `poop-images/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('pet-images')
        .upload(filePath, compressedFile);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error('图片上传失败');
      }

      const qwenResult = await analyzePoopWithQwen(compressedFile);
      const riskLevel = determineRiskLevel(qwenResult);
      const gptReport = await generateHealthReport(qwenResult, '', {});

      const { data, error } = await supabase
        .from('feces_records')
        .insert({
          image_url: uploadData.path,
          qwen_analysis: qwenResult,
          gpt_report: gptReport,
          risk_level: riskLevel
        })
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw new Error('保存记录失败');
      }

      onAnalysisComplete(data);
      
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

  return (
    <div className="upload-container">
      <div
        className={`upload-area border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 bg-white hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="upload-icon mb-4">
          📸
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          上传宠物粪便照片
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          拖拽图片到此处或点击选择文件
        </p>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleInputChange}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
        >
          选择照片
        </label>
      </div>
      <div className="mt-4 text-xs text-gray-500 text-center">
        支持 JPG、PNG、WebP 格式，最大 10MB
      </div>
    </div>
  );
}