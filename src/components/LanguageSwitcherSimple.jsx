import { useState } from 'react';
import { useLocale } from '../lib/i18n';
import { Button } from './ui/button-simple';

const languages = [
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
];

export default function LanguageSwitcherSimple() {
  const [isOpen, setIsOpen] = useState(false);
  const { locale, changeLocale } = useLocale();
  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  const handleLanguageChange = (languageCode) => {
    changeLocale(languageCode);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button 
        onClick={() => setIsOpen(!isOpen)}
        variant="outline" 
        size="icon"
        className="relative group overflow-hidden"
      >
        <div className="flex flex-col items-center justify-center">
          <span className="text-lg leading-none group-hover:scale-110 transition-transform duration-300">
            {currentLanguage.flag}
          </span>
          <span className="text-xs text-pink-400 mt-0.5 opacity-60 group-hover:opacity-100 transition-opacity duration-300">🌐</span>
        </div>
      </Button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-14 z-20 w-44 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-pink-200/50 py-2">
            <div className="p-2">
              <div className="text-xs font-medium text-pink-600/70 mb-2 px-2">选择语言</div>
              {languages.map((language, index) => (
                <div key={language.code}>
                  <button
                    onClick={() => handleLanguageChange(language.code)}
                    className={`w-full px-4 py-3 text-left flex items-center space-x-3 hover:bg-pink-50/80 transition-all duration-200 rounded-xl ${
                      locale === language.code
                        ? 'bg-gradient-to-r from-pink-50 to-rose-50 text-pink-700'
                        : ''
                    }`}
                  >
                    <span className="text-xl group-hover:scale-110 transition-transform duration-200">
                      {language.flag}
                    </span>
                    <span className="font-medium flex-1">
                      {language.name}
                    </span>
                    {locale === language.code && (
                      <div className="w-2 h-2 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full animate-pulse" />
                    )}
                  </button>
                  {index < languages.length - 1 && (
                    <div className="mx-4 my-1 h-px bg-pink-100/50" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}