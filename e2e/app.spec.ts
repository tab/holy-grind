import { test, expect } from '@playwright/test'

/** Helper to select a grinder from the nth dropdown (0 = source, 1 = target). */
async function selectGrinder(
  page: import('@playwright/test').Page,
  nth: number,
  search: string,
) {
  const group = page.locator('.grinder-select').nth(nth)
  const input = group.locator('input')
  await input.click()
  await input.fill(search)
  await group.locator('li[role="option"]').first().click()
}

test.describe('App loads successfully', () => {
  test('shows title, two search inputs, and disabled setting input', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Holy Grind')).toBeVisible()
    await expect(page.locator('.grinder-select input')).toHaveCount(2)
    await expect(page.locator('input[name="input"]')).toBeDisabled()
  })
})

test.describe('Full conversion flow', () => {
  test('Ditting 807 LAB SWEET = 4 → Comandante C40 = 11', async ({ page }) => {
    await page.goto('/')

    await selectGrinder(page, 0, 'Ditting 807')

    const settingInput = page.locator('input[name="input"]')
    await expect(settingInput).toBeEnabled()
    await expect(page.locator('.range-hint')).toBeVisible()

    await settingInput.fill('4')

    await selectGrinder(page, 1, 'Comandante C40')

    await expect(page.locator('.result-number')).toHaveText('11')
  })
})

test.describe('Decimal input with comma', () => {
  test('accepts comma as decimal separator', async ({ page }) => {
    await page.goto('/')

    await selectGrinder(page, 0, 'Ditting 807')
    await page.locator('input[name="input"]').fill('5,5')
    await selectGrinder(page, 1, 'Comandante C40')

    const result = page.locator('.result-number')
    await expect(result).toBeVisible()
    await expect(result).not.toHaveText('')
  })
})

test.describe('Clamped value warning', () => {
  test('shows warning for out-of-range value', async ({ page }) => {
    await page.goto('/')

    await selectGrinder(page, 0, 'Ditting 807')
    await page.locator('input[name="input"]').fill('1')
    await selectGrinder(page, 1, 'Comandante C40')

    await expect(page.locator('.result-clamped')).toBeVisible()
    await expect(page.locator('.result-clamped')).toHaveText('Value clamped to grinder range')
  })
})

test.describe('Swap grinders', () => {
  test('swaps source, target, and fills input with previous result', async ({ page }) => {
    await page.goto('/')

    await selectGrinder(page, 0, 'Ditting 807')
    await page.locator('input[name="input"]').fill('4')
    await selectGrinder(page, 1, 'Comandante C40')
    await expect(page.locator('.result-number')).toHaveText('11')

    await page.locator('.swap-container').click()

    const grinders = page.locator('.grinder-select input')
    await expect(grinders.nth(0)).toHaveValue('Comandante C40')
    await expect(grinders.nth(1)).toHaveValue('Ditting 807 LAB SWEET')
    await expect(page.locator('input[name="input"]')).toHaveValue('11')
  })
})

test.describe('Grinder search and filter', () => {
  test('filters dropdown and shows "No results" for nonsense', async ({ page }) => {
    await page.goto('/')

    const group = page.locator('.grinder-select').first()
    const input = group.locator('input')

    await input.click()
    await expect(group.locator('.grinder-dropdown')).toBeVisible()

    await input.fill('Ditting')
    const options = group.locator('li[role="option"]')
    for (const option of await options.all()) {
      await expect(option).toContainText('Ditting')
    }

    await input.fill('xyznonexistent')
    await expect(group.locator('.grinder-dropdown-empty')).toHaveText('No results')
  })
})

test.describe('Language switch', () => {
  test('switches to Russian and back to English', async ({ page }) => {
    await page.goto('/')

    await page.locator('.lang-switcher-toggle').click()
    await page.locator('.lang-switcher-dropdown a', { hasText: 'Русский' }).click()

    await expect(page).toHaveURL(/\/ru/)
    await expect(page.getByText('Конвертер настроек кофемолок')).toBeVisible()
    await expect(page.locator('.grinder-select').first().locator('label')).toHaveText('Выберите кофемолку')

    await page.locator('.lang-switcher-toggle').click()
    await page.locator('.lang-switcher-dropdown a', { hasText: 'English' }).click()

    await expect(page).not.toHaveURL(/\/ru/)
    await expect(page.getByText('Coffee Grinder Settings Converter')).toBeVisible()
  })
})
