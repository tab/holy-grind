import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Grinder } from '@/utils/convert';
import { convert, getRange } from '@/utils/convert';
import GrinderSelect from '@/components/GrinderSelect';
import Result from '@/components/Result';

interface ConverterProps {
  grinders: Grinder[];
}

export default function Converter({ grinders }: ConverterProps) {
  const { t } = useTranslation();
  const [source, setSource] = useState<Grinder | null>(null);
  const [target, setTarget] = useState<Grinder | null>(null);
  const [input, setInput] = useState('');

  const sourceRange = useMemo(() => (source ? getRange(source) : null), [source]);

  const result = useMemo(() => {
    if (!source || !target || !input) return { result: null, noData: false };
    const val = parseFloat(input);
    if (isNaN(val)) return { result: null, noData: false };
    const r = convert(source, target, val);
    if (r === null) return { result: null, noData: true };
    return { result: r, noData: false };
  }, [source, target, input]);

  function handleSwap() {
    const prevSource = source;
    const prevTarget = target;
    setSource(prevTarget);
    setTarget(prevSource);
    // If we had a result, use it as the new input
    if (result.result) {
      setInput(result.result.value);
    } else {
      setInput('');
    }
  }

  return (
    <article className="converter-card">
      <GrinderSelect
        grinders={grinders}
        value={source}
        onChange={g => {
          setSource(g);
          setInput('');
        }}
        label={t('converter.from')}
      />

      <div className="setting-input">
        <label>{t('converter.setting')}</label>
        <input
          type="number"
          inputMode="decimal"
          step="any"
          placeholder={t('converter.input.placeholder')}
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={!source}
          min={sourceRange?.min}
          max={sourceRange?.max}
        />
        {sourceRange && (
          <small className="range-hint">
            {sourceRange.display.min} — {sourceRange.display.max}
          </small>
        )}
      </div>

      <div
        className="swap-container"
        onClick={handleSwap}
        tabIndex={0}
        title={t('converter.swap')}
        aria-label={t('converter.swap')}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleSwap(); }}
      >
        <svg className="swap-icon" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
          <path d="M4.806 2.194a.788.788 0 0 0-1.112 0l-2.75 2.75a.788.788 0 0 0 0 1.112.788.788 0 0 0 1.112 0l1.453-1.454v8.648a.74.74 0 1 0 1.482 0V4.602l1.453 1.454a.788.788 0 0 0 1.112 0 .788.788 0 0 0 0-1.112l-2.75-2.75zM8.444 11.056l2.75 2.75a.788.788 0 0 0 1.112 0l2.75-2.75a.786.786 0 0 0-1.111-1.112L12.5 11.39V2.75a.75.75 0 0 0-1.5 0v8.639L9.556 9.944a.788.788 0 0 0-1.112 0 .788.788 0 0 0 0 1.112z" />
        </svg>
      </div>

      <GrinderSelect
        grinders={grinders}
        value={target}
        onChange={setTarget}
        label={t('converter.to')}
      />

      <div className="result-section">
        <label>{t('converter.result')}</label>
        <Result result={result.result} noData={result.noData} />
      </div>
    </article>
  );
}
