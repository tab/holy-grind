import type { NumericGrinder, TextGrinder, GrinderData } from '@/utils/convert';

/** Numeric grinder covering indices 0-4 with values 1-5 */
export const numericGrinder: NumericGrinder = {
  id: 'numeric-1',
  name: 'Numeric Grinder',
  numeric: true,
  settings: [1, 2, 3, 4, 5],
};

/** Second numeric grinder covering indices 0-4 with values 10-50 */
export const numericGrinder2: NumericGrinder = {
  id: 'numeric-2',
  name: 'Numeric Grinder 2',
  numeric: true,
  settings: [10, 20, 30, 40, 50],
};

/** Text-based grinder covering indices 1-3 */
export const textGrinder: TextGrinder = {
  id: 'text-1',
  name: 'Text Grinder',
  numeric: false,
  settings: [
    null,
    { value: 5, display: 'Fine' },
    { value: 10, display: 'Medium' },
    { value: 15, display: 'Coarse' },
    null,
  ],
};

/** Grinder with no overlap with the others (only index 10) */
export const noOverlapGrinder: NumericGrinder = {
  id: 'no-overlap',
  name: 'No Overlap Grinder',
  numeric: true,
  settings: [
    null, null, null, null, null,
    null, null, null, null, null,
    100,
  ],
};

/** Grinder with all null settings */
export const emptyGrinder: NumericGrinder = {
  id: 'empty',
  name: 'Empty Grinder',
  numeric: true,
  settings: [null, null, null],
};

export const mockGrinderData: GrinderData = {
  version: '08022026',
  source: 'test',
  grinders: [numericGrinder, numericGrinder2, textGrinder],
};
