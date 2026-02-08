import { getLanguageFromPath, getLanguagePath, SUPPORTED_LANGUAGES } from '@/i18n';

// In test environment, import.meta.env.BASE_URL is '/' so BASE is ''
// The functions work relative to whatever BASE_URL is configured

describe('SUPPORTED_LANGUAGES', () => {
  it('has en and ru', () => {
    expect(SUPPORTED_LANGUAGES).toHaveProperty('en');
    expect(SUPPORTED_LANGUAGES).toHaveProperty('ru');
  });

  it('has correct labels', () => {
    expect(SUPPORTED_LANGUAGES.en.label).toBe('English');
    expect(SUPPORTED_LANGUAGES.ru.label).toBe('Русский');
  });
});

describe('getLanguageFromPath', () => {
  it('returns en for root path', () => {
    expect(getLanguageFromPath('/')).toBe('en');
  });

  it('returns ru for /ru path', () => {
    expect(getLanguageFromPath('/ru')).toBe('ru');
  });

  it('returns en for unknown language', () => {
    expect(getLanguageFromPath('/fr')).toBe('en');
  });

  it('returns en for empty path', () => {
    expect(getLanguageFromPath('')).toBe('en');
  });
});

describe('getLanguagePath', () => {
  it('returns base path for en', () => {
    expect(getLanguagePath('en')).toBe('/');
  });

  it('returns base path + lang for ru', () => {
    expect(getLanguagePath('ru')).toBe('/ru');
  });
});
