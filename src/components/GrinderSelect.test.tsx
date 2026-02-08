import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GrinderSelect from '@/components/GrinderSelect';
import { numericGrinder, numericGrinder2, textGrinder } from '@/test/fixtures';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const grinders = [numericGrinder, numericGrinder2, textGrinder];

describe('GrinderSelect', () => {
  it('renders label and input', () => {
    render(
      <GrinderSelect grinders={grinders} value={null} onChange={() => {}} label="Source" />,
    );
    expect(screen.getByText('Source')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('converter.grinder.search')).toBeInTheDocument();
  });

  it('opens dropdown on focus', async () => {
    const user = userEvent.setup();
    render(
      <GrinderSelect grinders={grinders} value={null} onChange={() => {}} label="Source" />,
    );

    await user.click(screen.getByPlaceholderText('converter.grinder.search'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(3);
  });

  it('filters by search query', async () => {
    const user = userEvent.setup();
    render(
      <GrinderSelect grinders={grinders} value={null} onChange={() => {}} label="Source" />,
    );

    const input = screen.getByPlaceholderText('converter.grinder.search');
    await user.click(input);
    await user.type(input, 'Text');

    expect(screen.getAllByRole('option')).toHaveLength(1);
    expect(screen.getByText('Text Grinder')).toBeInTheDocument();
  });

  it('selects grinder on click and closes dropdown', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <GrinderSelect grinders={grinders} value={null} onChange={onChange} label="Source" />,
    );

    await user.click(screen.getByPlaceholderText('converter.grinder.search'));
    await user.click(screen.getByText('Numeric Grinder'));

    expect(onChange).toHaveBeenCalledWith(numericGrinder);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('closes dropdown on outside click', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <GrinderSelect grinders={grinders} value={null} onChange={() => {}} label="Source" />
        <button>Outside</button>
      </div>,
    );

    await user.click(screen.getByPlaceholderText('converter.grinder.search'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await user.click(screen.getByText('Outside'));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('shows no results for empty filter', async () => {
    const user = userEvent.setup();
    render(
      <GrinderSelect grinders={grinders} value={null} onChange={() => {}} label="Source" />,
    );

    const input = screen.getByPlaceholderText('converter.grinder.search');
    await user.click(input);
    await user.type(input, 'zzzzz');

    expect(screen.getByText('common.noResults')).toBeInTheDocument();
  });
});
