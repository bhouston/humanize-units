import { describe, expect, expectTypeOf, it } from 'vitest';

import {
  BytesDecimal,
  Count,
  Time,
  humanizeUnit,
  humanizeBytes,
  humanizeCount,
  humanizeTime,
  siUnits,
  type HumanizeHelperOptions,
  type HumanizeUnitOptions,
  type UnitArray,
} from '../src/index.js';

describe('humanizeUnit with explicit units', () => {
  const testUnits: UnitArray = [
    { value: 1_000_000, notation: 'M' },
    { value: 1_000, notation: 'K' },
    { value: 1, notation: '' },
  ];

  it('returns empty string for undefined', () => {
    expect(humanizeUnit(undefined, { units: testUnits })).toBe('');
  });

  it('rounds to significant digits', () => {
    expect(humanizeUnit(1_234_567, { units: testUnits })).toBe('1.23M');
    expect(humanizeUnit(12_345, { units: testUnits, significantDigits: 2 })).toBe('12K');
  });

  it('supports negative numbers', () => {
    expect(humanizeUnit(-12_345, { units: testUnits })).toBe('-12.3K');
  });

  it('honours grouping and locale', () => {
    const baseUnits: UnitArray = [{ value: 1, notation: '' }];
    expect(humanizeUnit(12_345_678, { units: testUnits, useGrouping: true })).toBe('12.3M');
    expect(
      humanizeUnit(12_345, {
        units: testUnits,
        useGrouping: true,
        locale: 'en-US',
        significantDigits: 4,
      }),
    ).toBe('12.35K');
    expect(
      humanizeUnit(12_345, {
        units: baseUnits,
        useGrouping: true,
        significantDigits: 5,
        locale: 'en-US',
      }),
    ).toBe('12,345');
    expect(
      humanizeUnit(12_345, {
        units: baseUnits,
        useGrouping: true,
        significantDigits: 5,
        locale: 'de-DE',
      }),
    ).toBe('12.345');
  });
});

describe('humanizeUnit defaults', () => {
  it('defaults to count units', () => {
    expect(humanizeUnit(12_345)).toBe('12.3k');
  });

  it('accepts exported unit tables', () => {
    expect(humanizeUnit(8_388_608, { units: BytesDecimal })).toBe('8.39MB');
    expect(humanizeUnit(86_400, { units: Time })).toBe('1d');
  });

  it('accepts custom unit arrays', () => {
    const distanceUnits: UnitArray = [
      { value: 1_000, notation: 'km' },
      { value: 1, notation: 'm' },
    ];
    expect(humanizeUnit(1_500, { units: distanceUnits })).toBe('1.5km');
  });

  it('allows shared SI units helper', () => {
    const distanceUnits = siUnits('m', { minExponent: -3, maxExponent: 3 });
    expect(humanizeUnit(2_500, { units: distanceUnits })).toBe('2.5km');
  });

  it('respects formatter overrides', () => {
    expect(
      humanizeUnit(1_500, {
        units: BytesDecimal,
        useGrouping: true,
        significantDigits: 4,
        minimumSignificantDigits: 4,
      }),
    ).toBe('1.500kB');
    expect(
      humanizeUnit(12_345_678, {
        units: Count,
        locale: 'de-DE',
        useGrouping: true,
        significantDigits: 4,
      }),
    ).toBe('12,35M');
  });
});

describe('humanizeUnit edge cases', () => {
  it('handles nullish and non-finite inputs', () => {
    expect(humanizeUnit(null)).toBe('');
    expect(humanizeUnit(Number.NaN, { emptyValue: 'n/a' })).toBe('n/a');
    expect(humanizeUnit(Number.POSITIVE_INFINITY)).toBe('Infinity');
    expect(humanizeUnit(Number.NEGATIVE_INFINITY)).toBe('-Infinity');
  });

  it('uses fallback unit for small magnitudes', () => {
    expect(humanizeUnit(0, { units: Count })).toBe('0');
    expect(
      humanizeUnit(0.0009, {
        units: Time,
        significantDigits: 2,
        minimumSignificantDigits: 2,
      }),
    ).toBe('0.90ms');
  });

  it('normalizes custom unit arrays', () => {
    const unsortedUnits: UnitArray = [
      { value: 1, notation: 'm' },
      { value: 1_000, notation: 'km' },
    ];
    expect(humanizeUnit(42_000, { units: unsortedUnits })).toBe('42km');
  });

  it('throws when units contain non-positive values', () => {
    const brokenUnits = [{ value: 0, notation: '' }] as UnitArray;
    expect(() => humanizeUnit(10, { units: brokenUnits })).toThrow(
      'humanizeUnit only supports units with a positive value.',
    );
  });

  it('respects custom separators and minimum digits', () => {
    expect(
      humanizeUnit(1_500, {
        units: Count,
        unitSeparator: ' ',
      }),
    ).toBe('1.5 k');
    expect(
      humanizeUnit(12, {
        units: Count,
        significantDigits: 3,
        minimumSignificantDigits: 3,
      }),
    ).toBe('12.0');
  });
});

describe('humanizeUnit typing', () => {
  it('exposes the expected runtime signature', () => {
    expectTypeOf(humanizeUnit).parameter(0).toMatchTypeOf<number | null | undefined>();
    expectTypeOf(humanizeUnit).returns.toEqualTypeOf<string>();
  });

  it('produces unit arrays with strongly typed contents', () => {
    expectTypeOf(siUnits('m')).toMatchTypeOf<UnitArray>();
    expectTypeOf(BytesDecimal).items.toMatchTypeOf<UnitArray[number]>();
  });

  it('accepts fully typed configuration objects', () => {
    const options: HumanizeUnitOptions = {
      units: BytesDecimal,
      significantDigits: 4,
      minimumSignificantDigits: 2,
      locale: 'en-GB',
      useGrouping: true,
      unitSeparator: ' ',
      emptyValue: 'n/a',
    };

    expectTypeOf(options).toMatchTypeOf<HumanizeUnitOptions>();
    expectTypeOf(humanizeUnit(10_000, options)).toEqualTypeOf<string>();
  });
});

describe('helper wrappers', () => {
  it('formats using fixed unit tables', () => {
    expect(humanizeBytes(1_500)).toBe('1.5kB');
    expect(humanizeTime(3_600)).toBe('1h');
    expect(humanizeCount(12_345)).toBe('12.3k');
  });

  it('supports helper options typing', () => {
    const options: HumanizeHelperOptions = {
      significantDigits: 4,
      minimumSignificantDigits: 4,
      locale: 'en-US',
      useGrouping: true,
      unitSeparator: ' ',
      emptyValue: 'n/a',
    };

    expectTypeOf(options).toMatchTypeOf<HumanizeHelperOptions>();
    expect(humanizeBytes(1_500, options)).toBe('1.500 kB');
  });
});
