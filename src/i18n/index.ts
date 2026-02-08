import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '@/i18n/locales/en.json';
import ru from '@/i18n/locales/ru.json';

export const SUPPORTED_LANGUAGES: Record<string, { label: string; path: string }> = {
  en: { label: 'English', path: '/' },
  ru: { label: 'Русский', path: '/ru' },
};

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export function getLanguageFromPath(pathname: string): string {
  const stripped = pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname;
  const seg = stripped.split('/').filter(Boolean)[0];
  return seg && seg in SUPPORTED_LANGUAGES ? seg : 'en';
}

export function getLanguagePath(lang: string): string {
  return lang === 'en' ? BASE + '/' : BASE + '/' + lang;
}

const detectedLang = getLanguageFromPath(window.location.pathname);

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ru: { translation: ru },
  },
  lng: detectedLang,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

document.documentElement.lang = detectedLang;

export default i18n;
