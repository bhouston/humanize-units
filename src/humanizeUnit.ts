import { SI, type UnitArray } from './units.js';

/**
 * Configuration for `humanizeUnit`.
 *
 * Each option maps directly to the behaviour of the formatted output. All
 * fields are optional—defaults match {@link DEFAULT_OPTIONS}.
 */
export type HumanizeUnitOptions = {
  /**
   * Ordered list of unit breakpoints (largest to smallest). Defaults to
   * {@link Count}.
   */
  units?: UnitArray;
  /**
   * Text appended after the unit. Useful when using base prefix arrays
   * like {@link SI} or {@link Binary} to separate the prefix from the unit
   * abbreviation. Defaults to an empty string.
   */
  postfix?: string;
  /**
   * Upper bound for significant digits reported by `Intl.NumberFormat`.
   * Defaults to `3`.
   */
  significantDigits?: number;
  /**
   * Lower bound for significant digits reported by `Intl.NumberFormat`.
   * Defaults to `1`.
   */
  minimumSignificantDigits?: number;
  /**
   * BCP 47 locale string passed to `Intl.NumberFormat`. Defaults to `en-US`.
   */
  locale?: string;
  /**
   * Whether digit grouping separators (e.g. `1,000`) should be used.
   * Defaults to `false`.
   */
  useGrouping?: boolean;
  /**
   * Text inserted between the formatted value and the unit when the
   * selected unit is non-empty. Defaults to an empty string.
   */
  unitSeparator?: string;
  /**
   * Output value used when the input is `null`, `undefined`, or `NaN`.
   * Defaults to an empty string.
   */
  emptyValue?: string;
};

/**
 * Library-wide defaults for {@link HumanizeUnitOptions}.
 */
const DEFAULT_OPTIONS: Required<HumanizeUnitOptions> = {
  units: SI,
  postfix: '',
  significantDigits: 3,
  minimumSignificantDigits: 1,
  locale: 'en-US',
  useGrouping: false,
  unitSeparator: '',
  emptyValue: '',
};

/**
 * Chooses the best-fitting unit for a value from an ordered unit table.
 *
 * @throws {Error} When the unit table is empty.
 */
const selectUnit = (value: number, units: UnitArray) => {
  const absoluteValue = Math.abs(value);
  const fallbackUnit = units[units.length - 1];

  if (!fallbackUnit) {
    throw new Error('humanizeUnit requires at least one unit definition.');
  }

  return units.find((unit) => absoluteValue >= unit.value) ?? fallbackUnit;
};

/**
 * Formats a numeric value (or nullable input) into a human-readable string
 * using the provided unit table and formatting options.
 *
 * When `value` is `null`, `undefined`, or `NaN`, the `emptyValue` option is
 * returned. Infinite values are stringified as-is.
 *
 * @param value Raw numeric input to format.
 * @param options Optional configuration overriding {@link HumanizeUnitOptions}.
 * @returns Human-readable number and unit.
 */
export const humanizeUnit = (value: number | null | undefined, options?: HumanizeUnitOptions) => {
  const {
    emptyValue = DEFAULT_OPTIONS.emptyValue,
    units = DEFAULT_OPTIONS.units,
    postfix = DEFAULT_OPTIONS.postfix,
    locale = DEFAULT_OPTIONS.locale,
    significantDigits = DEFAULT_OPTIONS.significantDigits,
    minimumSignificantDigits = DEFAULT_OPTIONS.minimumSignificantDigits,
    useGrouping = DEFAULT_OPTIONS.useGrouping,
    unitSeparator = DEFAULT_OPTIONS.unitSeparator,
  } = options ?? DEFAULT_OPTIONS;

  if (value === null || value === undefined) {
    return emptyValue;
  }

  if (!Number.isFinite(value)) {
    if (Number.isNaN(value)) {
      return emptyValue;
    }
    return String(value);
  }

  const targetUnit = selectUnit(value === 0 ? 1 : value, units);
  /* c8 ignore next -- fallback to 1 if value is 0 or falsy */
  const divider = targetUnit.value || 1;

  const formatter = new Intl.NumberFormat(locale, {
    maximumSignificantDigits: significantDigits,
    minimumSignificantDigits: minimumSignificantDigits,
    useGrouping: useGrouping,
  });

  const formattedNumber = formatter.format(value / divider);
  const separator = targetUnit.unit || postfix ? unitSeparator : '';

  return `${formattedNumber}${separator}${targetUnit.unit}${postfix}`;
};

/** @internal */
export const __private__ = {
  selectUnit,
};
