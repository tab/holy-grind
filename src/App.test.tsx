import { render, screen, waitFor, act } from '@testing-library/react';
import App from '@/App';
import { mockGrinderData } from '@/test/fixtures';

const mockChangeLanguage = vi.fn();

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'en',
      changeLanguage: mockChangeLanguage,
    },
  }),
}));

vi.mock('@/i18n', () => ({
  getLanguageFromPath: (path: string) => {
    const seg = path.split('/').filter(Boolean)[0];
    return seg === 'ru' ? 'ru' : 'en';
  },
  SUPPORTED_LANGUAGES: {
    en: { label: 'English', path: '/' },
    ru: { label: 'Русский', path: '/ru' },
  },
  getLanguagePath: (lang: string) => (lang === 'en' ? '/holy-grind/' : '/holy-grind/' + lang),
  default: {
    use: () => ({ init: () => {} }),
  },
}));

describe('App', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockChangeLanguage.mockClear();
  });

  it('shows loading state initially', () => {
    vi.spyOn(globalThis, 'fetch').mockReturnValue(new Promise(() => {}));
    render(<App />);
    expect(screen.getByText('common.loading')).toBeInTheDocument();
  });

  it('renders converter after fetch succeeds', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockGrinderData),
    } as Response);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/app\.title/)).toBeInTheDocument();
    });

    expect(screen.getByText(/app\.version/)).toBeInTheDocument();
  });

  it('shows error state on fetch failure', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('errors.load.data')).toBeInTheDocument();
    });
  });

  it('shows error state on non-ok response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      statusText: 'Not Found',
    } as Response);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('errors.load.data')).toBeInTheDocument();
    });
  });

  it('contains LanguageSwitcher and Converter after load', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockGrinderData),
    } as Response);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/app\.title/)).toBeInTheDocument();
    });

    // LanguageSwitcher renders current language button
    expect(screen.getByText('English')).toBeInTheDocument();
    // Converter renders grinder search inputs
    expect(screen.getAllByPlaceholderText('converter.grinder.search')).toHaveLength(2);
  });

  it('handles popstate event for language change', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockGrinderData),
    } as Response);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/app\.title/)).toBeInTheDocument();
    });

    // Simulate popstate (browser back/forward)
    act(() => {
      Object.defineProperty(window, 'location', {
        value: { ...window.location, pathname: '/ru' },
        writable: true,
      });
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    expect(mockChangeLanguage).toHaveBeenCalledWith('ru');
  });
});
