import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, getLanguagePath } from '@/i18n';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function switchLanguage(e: React.MouseEvent<HTMLAnchorElement>, lang: string) {
    e.preventDefault();
    setOpen(false);
    if (lang === i18n.language) return;
    history.pushState(null, '', getLanguagePath(lang));
    i18n.changeLanguage(lang);
  }

  const current = SUPPORTED_LANGUAGES[i18n.language];

  return (
    <div className="lang-switcher" ref={ref}>
      <button
        className="lang-switcher-toggle"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        {current.label}
      </button>
      {open && (
        <ul className="lang-switcher-dropdown">
          {Object.entries(SUPPORTED_LANGUAGES).map(([lang, { label, path }]) => (
            <li key={lang}>
              <a
                href={path}
                className={lang === i18n.language ? 'active' : ''}
                onClick={e => switchLanguage(e, lang)}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
