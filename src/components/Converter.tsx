import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import type { Grinder } from '@/utils/convert';
import { convert, getRange, parseDecimal } from '@/utils/convert';
import GrinderSelect from '@/components/GrinderSelect';
import Result from '@/components/Result';

interface ConverterProps {
  grinders: Grinder[];
}

interface FormValues {
  source: Grinder | null;
  target: Grinder | null;
  input: string;
}

export default function Converter({ grinders }: ConverterProps) {
  const { t } = useTranslation();

  const formik = useFormik<FormValues>({
    initialValues: { source: null, target: null, input: '' },
    onSubmit: () => {},
  });

  const { source, target, input } = formik.values;

  const sourceRange = useMemo(() => (source ? getRange(source) : null), [source]);

  const result = useMemo(() => {
    if (!source || !target || !input) return { result: null, noData: false };
    const val = parseDecimal(input);
    if (isNaN(val)) return { result: null, noData: false };
    const r = convert(source, target, val);
    if (r === null) return { result: null, noData: true };
    return { result: r, noData: false };
  }, [source, target, input]);

  function handleSwap() {
    const newInput = result.result ? result.result.value : '';
    formik.setValues({ source: target, target: source, input: newInput });
  }

  return (
    <article className="converter-card">
      <GrinderSelect
        grinders={grinders}
        value={source}
        onChange={g => formik.setValues({ ...formik.values, source: g, input: '' })}
        label={t('converter.from')}
      />

      <div className="setting-input">
        <label>{t('converter.setting')}</label>
        <input
          name="input"
          type="text"
          inputMode="decimal"
          placeholder={t('converter.input.placeholder')}
          value={input}
          onChange={formik.handleChange}
          disabled={!source}
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
        onChange={g => formik.setFieldValue('target', g)}
        label={t('converter.to')}
      />

      <div className="result-section">
        <label>{t('converter.result')}</label>
        <Result result={result.result} noData={result.noData} />
      </div>
    </article>
  );
}
