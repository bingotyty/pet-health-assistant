import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// shadcn/ui cn 工具函数
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const compressImage = (file, quality = 0.7) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      const maxWidth = 800;
      const maxHeight = 600;
      
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(resolve, 'image/jpeg', quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

export const generateImageHash = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const analyzeTrend = (records) => {
  if (!records || records.length === 0) {
    return { summary: '暂无数据进行趋势分析' };
  }

  const riskCounts = records.reduce((acc, record) => {
    acc[record.risk_level] = (acc[record.risk_level] || 0) + 1;
    return acc;
  }, {});

  const total = records.length;
  const highRisk = riskCounts.high || 0;
  const mediumRisk = riskCounts.medium || 0;
  const lowRisk = riskCounts.low || 0;

  let summary = `近期${total}次记录中，`;
  
  if (highRisk > 0) {
    summary += `${highRisk}次高风险，`;
  }
  if (mediumRisk > 0) {
    summary += `${mediumRisk}次中风险，`;
  }
  summary += `${lowRisk}次正常。`;

  if (highRisk / total > 0.3) {
    summary += ' 建议尽快咨询兽医。';
  } else if (mediumRisk / total > 0.5) {
    summary += ' 建议密切观察，必要时咨询兽医。';
  } else {
    summary += ' 整体状况良好。';
  }

  return { summary };
};