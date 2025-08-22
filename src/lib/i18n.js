import { useState, useEffect, createContext, useContext } from 'react';

// 导入语言包
import zhMessages from '../i18n/messages/zh.json';
import jaMessages from '../i18n/messages/ja.json';
import enMessages from '../i18n/messages/en.json';

const messages = {
  zh: zhMessages,
  ja: jaMessages,
  en: enMessages
};

// 支持的语言列表
export const locales = ['zh', 'ja', 'en'];
export const defaultLocale = 'zh';

// 创建上下文
const I18nContext = createContext();

// 获取嵌套对象的值
function get(obj, path, defaultValue = '') {
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key];
    } else {
      return defaultValue;
    }
  }
  
  return result || defaultValue;
}

// I18n Provider 组件
export function I18nProvider({ children, initialLocale = defaultLocale }) {
  const [locale, setLocale] = useState(initialLocale);

  // 从 localStorage 读取保存的语言偏好
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('preferred-language');
      if (savedLocale && locales.includes(savedLocale)) {
        setLocale(savedLocale);
      } else {
        // 检测浏览器语言
        const browserLang = navigator.language.split('-')[0];
        if (locales.includes(browserLang)) {
          setLocale(browserLang);
        }
      }
    }
  }, []);

  // 切换语言
  const changeLocale = (newLocale) => {
    if (locales.includes(newLocale)) {
      setLocale(newLocale);
      if (typeof window !== 'undefined') {
        localStorage.setItem('preferred-language', newLocale);
      }
    }
  };

  // 翻译函数
  const t = (key, params = {}) => {
    let message = get(messages[locale], key, key);
    
    // 处理参数替换
    if (typeof message === 'string' && Object.keys(params).length > 0) {
      Object.keys(params).forEach(param => {
        message = message.replace(`{${param}}`, params[param]);
      });
    }
    
    return message;
  };

  const value = {
    locale,
    changeLocale,
    t
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

// Hook 来使用翻译
export function useTranslations() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslations must be used within an I18nProvider');
  }
  return context.t;
}

// Hook 来使用语言信息
export function useLocale() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useLocale must be used within an I18nProvider');
  }
  return {
    locale: context.locale,
    changeLocale: context.changeLocale
  };
}