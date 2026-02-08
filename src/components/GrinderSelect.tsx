import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { Grinder } from '@/utils/convert';

interface GrinderSelectProps {
  grinders: Grinder[];
  value: Grinder | null;
  onChange: (grinder: Grinder) => void;
  label: string;
}

export default function GrinderSelect({ grinders, value, onChange, label }: GrinderSelectProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = query
    ? grinders.filter(g => g.name.toLowerCase().includes(query.toLowerCase()))
    : grinders;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function select(g: Grinder) {
    onChange(g);
    setQuery('');
    setOpen(false);
  }

  const listRef = useCallback((ul: HTMLUListElement | null) => {
    if (!ul || !value || query) return;
    const selected = ul.querySelector('.selected');
    if (selected) {
      selected.scrollIntoView({ block: 'center' });
    }
  }, [value, query]);

  return (
    <div className="grinder-select" ref={ref}>
      <label>{label}</label>
      <input
        type="text"
        placeholder={t('converter.grinder.search')}
        value={open ? query : (value?.name ?? '')}
        onChange={e => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => {
          setOpen(true);
          setQuery('');
        }}
        autoComplete="off"
      />
      {open && (
        <ul className="grinder-dropdown" role="listbox" ref={listRef}>
          {filtered.length === 0 ? (
            <li className="grinder-dropdown-empty">{t('common.noResults')}</li>
          ) : (
            filtered.map(g => (
              <li
                key={g.id}
                role="option"
                aria-selected={value?.id === g.id}
                className={value?.id === g.id ? 'selected' : ''}
                onClick={() => select(g)}
              >
                {g.brand && g.model ? (
                  <>
                    <span className="grinder-brand">{g.brand}</span>
                    <span className="grinder-model">{g.model}</span>
                  </>
                ) : (
                  <span className="grinder-model">{g.name}</span>
                )}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
