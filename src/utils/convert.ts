export interface NumericGrinder {
  id: string;
  name: string;
  numeric: true;
  settings: (number | null)[];
}

export interface TextSetting {
  value: number;
  display: string;
}

export interface TextGrinder {
  id: string;
  name: string;
  numeric: false;
  settings: (TextSetting | null)[];
}

export type Grinder = NumericGrinder | TextGrinder;

export interface GrinderData {
  version: string;
  source: string;
  grinders: Grinder[];
}

export interface ConversionResult {
  value: string;
  display: string;
  min: string;
  max: string;
  exact: boolean;
}

function getDisplayValue(grinder: Grinder, index: number): string {
  const s = grinder.settings[index];
  if (s === null) return '';
  if (grinder.numeric) return String(s);
  return (s as TextSetting).display;
}

/** Get non-null indices for a grinder */
function getValidIndices(grinder: Grinder): number[] {
  return grinder.settings
    .map((s, i) => (s !== null ? i : -1))
    .filter(i => i >= 0);
}

/** Get the numeric value for a setting, whether the grinder is numeric or text-based */
function settingValue(grinder: Grinder, idx: number): number {
  const s = grinder.settings[idx];
  if (s === null) throw new Error('null setting');
  if (grinder.numeric) return s as number;
  return (s as TextSetting).value;
}

/**
 * Convert a grind setting from source grinder to target grinder
 * using linear interpolation between coarseness levels.
 */
export function convert(
  source: Grinder,
  target: Grinder,
  inputValue: number,
): ConversionResult | null {
  const sourceIndices = getValidIndices(source);
  const targetIndices = getValidIndices(target);

  if (sourceIndices.length < 2 || targetIndices.length < 2) return null;

  // Find overlapping indices where both grinders have data
  const overlap = sourceIndices.filter(i => targetIndices.includes(i));
  if (overlap.length < 2) return null;

  const sourceValues = overlap.map(i => settingValue(source, i));
  const targetValues = overlap.map(i => settingValue(target, i));

  // Find min/max for target
  const targetMin = targetValues[0];
  const targetMax = targetValues[targetValues.length - 1];
  const sourceMin = sourceValues[0];
  const sourceMax = sourceValues[sourceValues.length - 1];

  // Clamp input to source range
  const clamped = Math.max(sourceMin, Math.min(sourceMax, inputValue));

  // Find bracketing indices in source values
  let lower = 0;
  for (let i = 0; i < sourceValues.length - 1; i++) {
    if (sourceValues[i + 1] >= clamped) {
      lower = i;
      break;
    }
    lower = i;
  }
  const upper = Math.min(lower + 1, sourceValues.length - 1);

  let result: number;
  if (lower === upper || sourceValues[lower] === sourceValues[upper]) {
    result = targetValues[lower];
  } else {
    const fraction = (clamped - sourceValues[lower]) / (sourceValues[upper] - sourceValues[lower]);
    result = targetValues[lower] + fraction * (targetValues[upper] - targetValues[lower]);
  }

  // Clamp to target range
  result = Math.max(targetMin, Math.min(targetMax, result));

  const exact = clamped === inputValue;

  if (target.numeric) {
    // Round to 1 decimal
    const rounded = Math.round(result * 10) / 10;
    return {
      value: String(rounded),
      display: String(rounded),
      min: String(targetMin),
      max: String(targetMax),
      exact,
    };
  } else {
    // Snap to nearest known text setting
    const validTargetSettings = overlap.map(i => target.settings[i] as TextSetting);
    let closest = validTargetSettings[0];
    let closestDist = Math.abs(result - closest.value);

    for (const ts of validTargetSettings) {
      const dist = Math.abs(result - ts.value);
      if (dist < closestDist) {
        closest = ts;
        closestDist = dist;
      }
    }

    return {
      value: String(closest.value),
      display: closest.display,
      min: getDisplayValue(target, overlap[0]),
      max: getDisplayValue(target, overlap[overlap.length - 1]),
      exact,
    };
  }
}

/** Get the valid input range for a grinder */
export function getRange(grinder: Grinder): { min: number; max: number; display: { min: string; max: string } } | null {
  const indices = getValidIndices(grinder);
  if (indices.length === 0) return null;

  const first = indices[0];
  const last = indices[indices.length - 1];

  return {
    min: settingValue(grinder, first),
    max: settingValue(grinder, last),
    display: {
      min: getDisplayValue(grinder, first),
      max: getDisplayValue(grinder, last),
    },
  };
}
