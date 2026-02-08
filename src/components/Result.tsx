import { useTranslation } from 'react-i18next';
import type { ConversionResult } from '@/utils/convert';

interface ResultProps {
  result: ConversionResult | null;
  noData: boolean;
}

export default function Result({ result, noData }: ResultProps) {
  const { t } = useTranslation();

  if (noData) {
    return <div className="result result-empty">{t('errors.overlap')}</div>;
  }

  if (!result) {
    return <div className="result result-empty">—</div>;
  }

  return (
    <div className="result">
      <div className="result-value" key={result.display}>
        <span className="result-number">{result.display}</span>
      </div>
      {!result.exact && (
        <small className="result-clamped">{t('errors.range')}</small>
      )}
    </div>
  );
}
