import { useLocale } from '../lib/i18n';
import { Button } from './ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
];

export default function LanguageSwitcher() {
  const { locale, changeLocale } = useLocale();
  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  const handleLanguageChange = (languageCode) => {
    changeLocale(languageCode);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="relative group overflow-hidden"
        >
          <div className="flex flex-col items-center justify-center">
            <span className="text-lg leading-none group-hover:scale-110 transition-transform duration-300">
              {currentLanguage.flag}
            </span>
            <Globe className="w-3 h-3 text-pink-400 mt-0.5 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <div className="p-2">
          <div className="text-xs font-medium text-pink-600/70 mb-2 px-2">选择语言</div>
          {languages.map((language, index) => (
            <div key={language.code}>
              <DropdownMenuItem
                onClick={() => handleLanguageChange(language.code)}
                className={`cursor-pointer group flex items-center space-x-3 ${
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
                  <div className="w-2 h-2 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full animate-pulse"></div>
                )}
              </DropdownMenuItem>
              {index < languages.length - 1 && <DropdownMenuSeparator />}
            </div>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}