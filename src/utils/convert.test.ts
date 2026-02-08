import { parseDecimal, getRange, convert } from '@/utils/convert';
import type { NumericGrinder } from '@/utils/convert';
import {
  numericGrinder,
  numericGrinder2,
  textGrinder,
  noOverlapGrinder,
  emptyGrinder,
} from '@/test/fixtures';

describe('parseDecimal', () => {
  it('parses dot decimal', () => {
    expect(parseDecimal('3.5')).toBe(3.5);
  });

  it('parses comma decimal', () => {
    expect(parseDecimal('3,5')).toBe(3.5);
  });

  it('parses integer', () => {
    expect(parseDecimal('7')).toBe(7);
  });

  it('returns NaN for invalid input', () => {
    expect(parseDecimal('abc')).toBeNaN();
  });
});

describe('getRange', () => {
  it('returns range for numeric grinder', () => {
    const range = getRange(numericGrinder);
    expect(range).toEqual({
      min: 1,
      max: 5,
      display: { min: '1', max: '5' },
    });
  });

  it('returns range for text grinder', () => {
    const range = getRange(textGrinder);
    expect(range).toEqual({
      min: 5,
      max: 15,
      display: { min: 'Fine', max: 'Coarse' },
    });
  });

  it('returns null for all-null settings', () => {
    expect(getRange(emptyGrinder)).toBeNull();
  });
});

describe('convert', () => {
  it('converts numeric → numeric with linear interpolation', () => {
    // numericGrinder: [1,2,3,4,5] at indices 0-4
    // numericGrinder2: [10,20,30,40,50] at indices 0-4
    // input=3 (index 2) → target=30
    const result = convert(numericGrinder, numericGrinder2, 3);
    expect(result).not.toBeNull();
    expect(result!.value).toBe('30');
    expect(result!.exact).toBe(true);
  });

  it('interpolates between points', () => {
    // input=2.5 → halfway between index 1 (20) and index 2 (30) → 25
    const result = convert(numericGrinder, numericGrinder2, 2.5);
    expect(result).not.toBeNull();
    expect(result!.value).toBe('25');
    expect(result!.exact).toBe(true);
  });

  it('converts numeric → text and snaps to nearest', () => {
    // numericGrinder indices 0-4, textGrinder indices 1-3
    // overlap: 1,2,3
    // source values at overlap: 2,3,4; target values at overlap: 5,10,15
    // input=2 → target=5 → snaps to Fine
    const result = convert(numericGrinder, textGrinder, 2);
    expect(result).not.toBeNull();
    expect(result!.display).toBe('Fine');
  });

  it('clamps below range (exact=false)', () => {
    // source range is 1-5, input is 0 → clamped to 1
    const result = convert(numericGrinder, numericGrinder2, 0);
    expect(result).not.toBeNull();
    expect(result!.exact).toBe(false);
    expect(result!.value).toBe('10');
  });

  it('clamps above range (exact=false)', () => {
    // source range is 1-5, input is 10 → clamped to 5
    const result = convert(numericGrinder, numericGrinder2, 10);
    expect(result).not.toBeNull();
    expect(result!.exact).toBe(false);
    expect(result!.value).toBe('50');
  });

  it('exact boundary returns exact=true', () => {
    const result = convert(numericGrinder, numericGrinder2, 1);
    expect(result).not.toBeNull();
    expect(result!.exact).toBe(true);
    expect(result!.value).toBe('10');
  });

  it('returns null when <2 overlap', () => {
    const result = convert(numericGrinder, noOverlapGrinder, 3);
    expect(result).toBeNull();
  });

  it('returns null when <2 valid settings', () => {
    const result = convert(emptyGrinder, numericGrinder, 1);
    expect(result).toBeNull();
  });

  it('includes min/max in result for numeric target', () => {
    const result = convert(numericGrinder, numericGrinder2, 3);
    expect(result!.min).toBe('10');
    expect(result!.max).toBe('50');
  });

  it('includes min/max display in result for text target', () => {
    const result = convert(numericGrinder, textGrinder, 3);
    expect(result!.min).toBe('Fine');
    expect(result!.max).toBe('Coarse');
  });

  it('handles input at exact max boundary', () => {
    const result = convert(numericGrinder, numericGrinder2, 5);
    expect(result).not.toBeNull();
    expect(result!.value).toBe('50');
    expect(result!.exact).toBe(true);
  });

  it('handles equal source values at adjacent overlap points', () => {
    // Two overlap points with same source value → triggers sourceValues[lower] === sourceValues[upper]
    const flatSource: NumericGrinder = {
      id: 'flat',
      name: 'Flat',
      numeric: true,
      settings: [5, 5],
    };
    const target: NumericGrinder = {
      id: 'target',
      name: 'Target',
      numeric: true,
      settings: [10, 20],
    };
    const result = convert(flatSource, target, 5);
    expect(result).not.toBeNull();
    expect(result!.value).toBe('10');
  });
});
