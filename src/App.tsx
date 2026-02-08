import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getLanguageFromPath } from '@/i18n';
import type { GrinderData } from '@/utils/convert';
import Converter from '@/components/Converter';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function App() {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState<GrinderData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'data.json')
      .then(r => {
        if (!r.ok) throw new Error(r.statusText);
        return r.json();
      })
      .then(setData)
      .catch(() => setError(true));
  }, []);

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  useEffect(() => {
    function onPopState() {
      const lang = getLanguageFromPath(window.location.pathname);
      i18n.changeLanguage(lang);
    }
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [i18n]);

  if (error) {
    return (
      <main className="container">
        <p>{t('errors.load.data')}</p>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="container">
        <p className="loading">{t('common.loading')}</p>
      </main>
    );
  }

  return (
    <main className="container">
      <LanguageSwitcher />
      <header>
        <h1><a href={import.meta.env.BASE_URL} className="title-link">☕ {t('app.title')}</a></h1>
        <p className="subtitle">{t('app.subtitle')}</p>
      </header>

      <Converter grinders={data.grinders} />

      <footer>
        <small>
          {t('app.source')}{' '}
          <a href="https://theweldercatherine.ru/blog/articles/oborudovanie/svyashchennyy-pomol-chast-5/" rel="nofollow noreferrer" target="_blank">
            The Welder Catherine
          </a>
        </small>
        <br />
        <small>
          {t('app.version')} {__APP_VERSION__}
        </small>
      </footer>
    </main>
  );
}
