import { render, screen } from '@testing-library/react';
import Result from '@/components/Result';
import type { ConversionResult } from '@/utils/convert';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('Result', () => {
  it('shows placeholder when no result', () => {
    render(<Result result={null} noData={false} />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('shows overlap error when noData', () => {
    render(<Result result={null} noData={true} />);
    expect(screen.getByText('errors.overlap')).toBeInTheDocument();
  });

  it('displays result value', () => {
    const result: ConversionResult = {
      value: '25',
      display: '25',
      min: '10',
      max: '50',
      exact: true,
    };
    render(<Result result={result} noData={false} />);
    expect(screen.getByText('25')).toBeInTheDocument();
  });

  it('shows clamped warning when not exact', () => {
    const result: ConversionResult = {
      value: '10',
      display: '10',
      min: '10',
      max: '50',
      exact: false,
    };
    render(<Result result={result} noData={false} />);
    expect(screen.getByText('errors.range')).toBeInTheDocument();
  });

  it('hides clamped warning when exact', () => {
    const result: ConversionResult = {
      value: '25',
      display: '25',
      min: '10',
      max: '50',
      exact: true,
    };
    render(<Result result={result} noData={false} />);
    expect(screen.queryByText('errors.range')).not.toBeInTheDocument();
  });
});
