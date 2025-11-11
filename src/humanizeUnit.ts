import { Count, type UnitArray } from './units.js';

export type HumanizeUnitOptions = {
  units?: UnitArray;
  significantDigits?: number;
  minimumSignificantDigits?: number;
  locale?: string;
  useGrouping?: boolean;
  unitSeparator?: string;
  emptyValue?: string;
};

const DEFAULT_OPTIONS: Required<HumanizeUnitOptions> = {
  units: Count,
  significantDigits: 3,
  minimumSignificantDigits: 1,
  locale: 'en-US',
  useGrouping: false,
  unitSeparator: '',
  emptyValue: '',
};

const normalizeUnits = (units: UnitArray) => {
  if (!units.length) {
    throw new Error('humanizeUnit requires at least one unit definition.');
  }

  const sorted = [...units].sort((a, b) => b.value - a.value);

  if (sorted.some((unit) => unit.value <= 0)) {
    throw new Error('humanizeUnit only supports units with a positive value.');
  }

  return sorted;
};

const selectUnit = (value: number, units: UnitArray) => {
  const absoluteValue = Math.abs(value);
  const fallbackUnit = units[units.length - 1];

  if (!fallbackUnit) {
    throw new Error('humanizeUnit requires at least one unit definition.');
  }

  return units.find((unit) => absoluteValue >= unit.value) ?? fallbackUnit;
};

export const humanizeUnit = (value: number | null | undefined, options?: HumanizeUnitOptions) => {
  const {
    emptyValue = DEFAULT_OPTIONS.emptyValue,
    units = DEFAULT_OPTIONS.units,
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

  const normalizedUnits = normalizeUnits(units);
  const targetUnit = selectUnit(value, normalizedUnits);
  const divider = targetUnit.value || 1;

  const formatter = new Intl.NumberFormat(locale, {
    maximumSignificantDigits: significantDigits,
    minimumSignificantDigits: minimumSignificantDigits,
    useGrouping: useGrouping,
  });

  const formattedNumber = formatter.format(value / divider);
  const separator = targetUnit.notation ? unitSeparator : '';

  return `${formattedNumber}${separator}${targetUnit.notation}`;
};
