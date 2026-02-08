import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const mockChangeLanguage = vi.fn();
let mockLanguage = 'en';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: {
      get language() {
        return mockLanguage;
      },
      changeLanguage: mockChangeLanguage,
    },
  }),
}));

vi.mock('@/i18n', () => ({
  SUPPORTED_LANGUAGES: {
    en: { label: 'English', path: '/' },
    ru: { label: 'Русский', path: '/ru' },
  },
  getLanguagePath: (lang: string) => (lang === 'en' ? '/holy-grind/' : '/holy-grind/' + lang),
}));

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    mockLanguage = 'en';
    mockChangeLanguage.mockClear();
  });

  it('renders with current language label', () => {
    render(<LanguageSwitcher />);
    expect(screen.getByText('English')).toBeInTheDocument();
  });

  it('shows all supported languages in dropdown', async () => {
    const user = userEvent.setup();
    render(<LanguageSwitcher />);

    await user.click(screen.getByText('English'));
    expect(screen.getByText('Русский')).toBeInTheDocument();
  });

  it('highlights active language', async () => {
    const user = userEvent.setup();
    render(<LanguageSwitcher />);

    await user.click(screen.getByText('English'));

    const links = screen.getAllByRole('link');
    const enLink = links.find(l => l.textContent === 'English');
    const ruLink = links.find(l => l.textContent === 'Русский');
    expect(enLink).toHaveClass('active');
    expect(ruLink).not.toHaveClass('active');
  });

  it('switches language on click', async () => {
    const user = userEvent.setup();
    const pushStateSpy = vi.spyOn(history, 'pushState');
    render(<LanguageSwitcher />);

    await user.click(screen.getByText('English'));
    await user.click(screen.getByText('Русский'));

    expect(pushStateSpy).toHaveBeenCalledWith(null, '', '/holy-grind/ru');
    expect(mockChangeLanguage).toHaveBeenCalledWith('ru');
    pushStateSpy.mockRestore();
  });

  it('does not switch when clicking current language', async () => {
    const user = userEvent.setup();
    render(<LanguageSwitcher />);

    await user.click(screen.getByText('English'));

    const links = screen.getAllByRole('link');
    const enLink = links.find(l => l.textContent === 'English')!;
    await user.click(enLink);

    expect(mockChangeLanguage).not.toHaveBeenCalled();
  });

  it('closes dropdown on outside click', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <LanguageSwitcher />
        <button>Outside</button>
      </div>,
    );

    await user.click(screen.getByText('English'));
    expect(screen.getByText('Русский')).toBeInTheDocument();

    await user.click(screen.getByText('Outside'));
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });
});
