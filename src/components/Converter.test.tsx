import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Converter from '@/components/Converter';
import { numericGrinder, numericGrinder2, textGrinder, noOverlapGrinder } from '@/test/fixtures';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const grinders = [numericGrinder, numericGrinder2, textGrinder, noOverlapGrinder];

describe('Converter', () => {
  it('disables input when no source grinder is selected', () => {
    render(<Converter grinders={grinders} />);
    const inputs = screen.getAllByRole('textbox');
    // The setting input (third textbox after two grinder search inputs)
    const settingInput = inputs.find(
      i => (i as HTMLInputElement).placeholder === 'converter.input.placeholder',
    );
    expect(settingInput).toBeDisabled();
  });

  it('shows range hint after source selected', async () => {
    const user = userEvent.setup();
    render(<Converter grinders={grinders} />);

    // Select source grinder
    const searchInputs = screen.getAllByPlaceholderText('converter.grinder.search');
    await user.click(searchInputs[0]);
    await user.click(screen.getByText('Numeric Grinder'));

    expect(screen.getByText(/1/)).toBeInTheDocument();
    expect(screen.getByText(/5/)).toBeInTheDocument();
  });

  it('displays result when all fields filled', async () => {
    const user = userEvent.setup();
    render(<Converter grinders={grinders} />);

    // Select source
    const searchInputs = screen.getAllByPlaceholderText('converter.grinder.search');
    await user.click(searchInputs[0]);
    await user.click(screen.getByText('Numeric Grinder'));

    // Enter value
    const settingInput = screen.getByPlaceholderText('converter.input.placeholder');
    await user.type(settingInput, '3');

    // Select target
    await user.click(searchInputs[1]);
    await user.click(screen.getByText('Numeric Grinder 2'));

    // Result should show 30
    expect(screen.getByText('30')).toBeInTheDocument();
  });

  it('swaps source and target grinders', async () => {
    const user = userEvent.setup();
    render(<Converter grinders={grinders} />);

    // Select source
    const searchInputs = screen.getAllByPlaceholderText('converter.grinder.search');
    await user.click(searchInputs[0]);
    await user.click(screen.getByText('Numeric Grinder'));

    // Enter value
    const settingInput = screen.getByPlaceholderText('converter.input.placeholder');
    await user.type(settingInput, '3');

    // Select target
    await user.click(searchInputs[1]);
    await user.click(screen.getByText('Numeric Grinder 2'));

    // Click swap
    const swapButton = screen.getByTitle('converter.swap');
    await user.click(swapButton);

    // After swap, source should be Numeric Grinder 2 and input should be '30' (the result value)
    const updatedSearchInputs = screen.getAllByPlaceholderText('converter.grinder.search');
    expect(updatedSearchInputs[0]).toHaveValue('Numeric Grinder 2');
    expect(updatedSearchInputs[1]).toHaveValue('Numeric Grinder');
  });

  it('shows overlap error for incompatible grinders', async () => {
    const user = userEvent.setup();
    render(<Converter grinders={grinders} />);

    // Select source
    const searchInputs = screen.getAllByPlaceholderText('converter.grinder.search');
    await user.click(searchInputs[0]);
    await user.click(screen.getByText('Numeric Grinder'));

    // Enter value
    const settingInput = screen.getByPlaceholderText('converter.input.placeholder');
    await user.type(settingInput, '3');

    // Select target with no overlap
    await user.click(searchInputs[1]);
    await user.click(screen.getByText('No Overlap Grinder'));

    expect(screen.getByText('errors.overlap')).toBeInTheDocument();
  });

  it('swap can be triggered via keyboard', async () => {
    const user = userEvent.setup();
    render(<Converter grinders={grinders} />);

    // Select source
    const searchInputs = screen.getAllByPlaceholderText('converter.grinder.search');
    await user.click(searchInputs[0]);
    await user.click(screen.getByText('Numeric Grinder'));

    // Select target
    await user.click(searchInputs[1]);
    await user.click(screen.getByText('Numeric Grinder 2'));

    // Focus swap and press Enter
    const swapButton = screen.getByTitle('converter.swap');
    swapButton.focus();
    await user.keyboard('{Enter}');

    // After swap, source should be Numeric Grinder 2
    const updatedInputs = screen.getAllByPlaceholderText('converter.grinder.search');
    expect(updatedInputs[0]).toHaveValue('Numeric Grinder 2');
  });
});
