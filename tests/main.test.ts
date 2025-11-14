import { describe, expect, expectTypeOf, it } from 'vitest';

import {
  Binary,
  Count,
  SI,
  Time,
  humanizeAcceleration,
  humanizeAngle,
  humanizeArea,
  humanizeBytes,
  humanizeBytesBinary,
  humanizeBytesDecimal,
  humanizeCapacitance,
  humanizeCatalyticActivity,
  humanizeCharge,
  humanizeConcentration,
  humanizeCount,
  humanizeCurrent,
  humanizeDensity,
  humanizeDistance,
  humanizeEnergy,
  humanizeForce,
  humanizeFrequency,
  humanizeIlluminance,
  humanizeInductance,
  humanizeLength,
  humanizeLiquidVolume,
  humanizeLuminousFlux,
  humanizeMagneticFlux,
  humanizeMagneticFluxDensity,
  humanizeMass,
  humanizeMassFlowRate,
  humanizeMomentum,
  humanizeMolarConcentration,
  humanizeMolarDensity,
  humanizeMolarMass,
  humanizeMolarVolume,
  humanizePower,
  humanizePressure,
  humanizeRadiationDoseAbsorbed,
  humanizeRadiationDoseEquivalent,
  humanizeRadioactivity,
  humanizeResistance,
  humanizeStorage,
  humanizeStorageBinary,
  humanizeTemperature,
  humanizeTemperatureKelvin,
  humanizeTime,
  humanizeTorque,
  humanizeUnit,
  humanizeVelocity,
  humanizeVoltage,
  humanizeVolume,
  humanizeVolumeFlowRate,
  type HumanizeHelper,
  type HumanizeHelperOptions,
  type HumanizeUnitOptions,
  type UnitArray,
} from '../src/index.js';
import { __private__ } from '../src/humanizeUnit.js';

describe('humanizeUnit with explicit units', () => {
  const testUnits: UnitArray = [
    { value: 1_000_000, unit: 'M' },
    { value: 1_000, unit: 'K' },
    { value: 1, unit: '' },
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
    const baseUnits: UnitArray = [{ value: 1, unit: '' }];
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
    expect(humanizeUnit(8_388_608, { units: SI, postfix: 'B' })).toBe('8.39MB');
    expect(humanizeUnit(86_400, { units: Time })).toBe('1d');
  });

  it('accepts custom unit arrays', () => {
    const distanceUnits: UnitArray = [
      { value: 1_000, unit: 'km' },
      { value: 1, unit: 'm' },
    ];
    expect(humanizeUnit(1_500, { units: distanceUnits })).toBe('1.5km');
  });

  it('respects formatter overrides', () => {
    expect(
      humanizeUnit(1_500, {
        units: SI,
        postfix: 'B',
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
    expect(humanizeUnit(0, { units: SI })).toBe('0');
    expect(
      humanizeUnit(0.0009, {
        units: Time,
        significantDigits: 2,
        minimumSignificantDigits: 2,
      }),
    ).toBe('900µs');
  });

  it('works with custom unit arrays in correct order', () => {
    const distanceUnits: UnitArray = [
      { value: 1_000, unit: 'km' },
      { value: 1, unit: 'm' },
    ];
    expect(humanizeUnit(42_000, { units: distanceUnits })).toBe('42km');
  });

  it('handles negative values correctly', () => {
    const distanceUnits: UnitArray = [
      { value: 1_000, unit: 'km' },
      { value: 1, unit: 'm' },
    ];
    // Negative values should select unit based on absolute value
    expect(humanizeUnit(-42_000, { units: distanceUnits })).toBe('-42km');
    expect(humanizeUnit(-1_500, { units: distanceUnits })).toBe('-1.5km');
    expect(humanizeUnit(-500, { units: distanceUnits })).toBe('-500m');
    expect(humanizeUnit(-0.5, { units: distanceUnits })).toBe('-0.5m');
    // Test with default units
    expect(humanizeUnit(-12_345)).toBe('-12.3k');
    expect(humanizeUnit(-1_234_567)).toBe('-1.23M');
    expect(humanizeUnit(-0.001)).toBe('-1m');
    // Test with different formatting options
    expect(
      humanizeUnit(-1_500, {
        units: Count,
        unitSeparator: ' ',
      }),
    ).toBe('-1.5 k');
    expect(
      humanizeUnit(-12_345, {
        units: SI,
        postfix: 'B',
        significantDigits: 2,
      }),
    ).toBe('-12kB');
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

  it('throws when provided with an empty units array', () => {
    expect(() => humanizeUnit(10, { units: [] as unknown as UnitArray })).toThrow(
      'humanizeUnit requires at least one unit definition.',
    );
  });
});

describe('humanizeUnit typing', () => {
  it('exposes the expected runtime signature', () => {
    expectTypeOf(humanizeUnit).parameter(0).toMatchTypeOf<number | null | undefined>();
    expectTypeOf(humanizeUnit).returns.toEqualTypeOf<string>();
  });

  it('produces unit arrays with strongly typed contents', () => {
    expectTypeOf(SI).toMatchTypeOf<UnitArray>();
    expectTypeOf(SI).items.toMatchTypeOf<UnitArray[number]>();
  });

  it('accepts fully typed configuration objects', () => {
    const options: HumanizeUnitOptions = {
      units: SI,
      postfix: 'B',
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
  const helperCases: Array<{
    name: string;
    helper: HumanizeHelper;
    options: HumanizeUnitOptions;
    value: number;
  }> = [
    { name: 'humanizeCount', helper: humanizeCount, options: { units: Count }, value: 12_345 },
    { name: 'humanizeBytes', helper: humanizeBytes, options: { units: SI, postfix: 'B' }, value: 1_500 },
    { name: 'humanizeBytesDecimal', helper: humanizeBytesDecimal, options: { units: SI, postfix: 'B' }, value: 8_388_608 },
    { name: 'humanizeBytesBinary', helper: humanizeBytesBinary, options: { units: Binary, postfix: 'B' }, value: 1_048_576 },
    { name: 'humanizeStorage', helper: humanizeStorage, options: { units: SI, postfix: 'B' }, value: 2_500 },
    { name: 'humanizeStorageBinary', helper: humanizeStorageBinary, options: { units: Binary, postfix: 'B' }, value: 1_024 },
    { name: 'humanizeTime', helper: humanizeTime, options: { units: Time }, value: 3_600 },
    { name: 'humanizeDistance', helper: humanizeDistance, options: { units: SI, postfix: 'm' }, value: 1_500 },
    { name: 'humanizeMass', helper: humanizeMass, options: { units: SI, postfix: 'g' }, value: 1_500 },
    { name: 'humanizeAcceleration', helper: humanizeAcceleration, options: { units: SI, postfix: 'm/s^2' }, value: 9.81 },
    { name: 'humanizeCharge', helper: humanizeCharge, options: { units: SI, postfix: 'C' }, value: 0.0025 },
    { name: 'humanizeMomentum', helper: humanizeMomentum, options: { units: SI, postfix: 'N*s' }, value: 12 },
    { name: 'humanizePower', helper: humanizePower, options: { units: SI, postfix: 'W' }, value: 50_000 },
    { name: 'humanizeVelocity', helper: humanizeVelocity, options: { units: SI, postfix: 'm/s' }, value: 12_500 },
    { name: 'humanizeVolume', helper: humanizeVolume, options: { units: SI, postfix: 'm^3' }, value: 0.0034 },
    { name: 'humanizeLiquidVolume', helper: humanizeLiquidVolume, options: { units: SI, postfix: 'L' }, value: 2.5 },
    { name: 'humanizeTemperature', helper: humanizeTemperature, options: { units: SI, postfix: '°C' }, value: 0.0012 },
    { name: 'humanizeTemperatureKelvin', helper: humanizeTemperatureKelvin, options: { units: SI, postfix: '°K' }, value: 12 },
    { name: 'humanizePressure', helper: humanizePressure, options: { units: SI, postfix: 'Pa' }, value: 101_325 },
    { name: 'humanizeForce', helper: humanizeForce, options: { units: SI, postfix: 'N' }, value: 12_000 },
    { name: 'humanizeTorque', helper: humanizeTorque, options: { units: SI, postfix: 'N*m' }, value: 450 },
    { name: 'humanizeEnergy', helper: humanizeEnergy, options: { units: SI, postfix: 'J' }, value: 12_000 },
    { name: 'humanizeVoltage', helper: humanizeVoltage, options: { units: SI, postfix: 'V' }, value: 0.0032 },
    { name: 'humanizeCurrent', helper: humanizeCurrent, options: { units: SI, postfix: 'A' }, value: 0.00045 },
    { name: 'humanizeResistance', helper: humanizeResistance, options: { units: SI, postfix: 'Ω' }, value: 12_000 },
    { name: 'humanizeCapacitance', helper: humanizeCapacitance, options: { units: SI, postfix: 'F' }, value: 0.0000022 },
    { name: 'humanizeInductance', helper: humanizeInductance, options: { units: SI, postfix: 'H' }, value: 0.015 },
    { name: 'humanizeFrequency', helper: humanizeFrequency, options: { units: SI, postfix: 'Hz' }, value: 1_000_000 },
    { name: 'humanizeAngle', helper: humanizeAngle, options: { units: SI, postfix: '°' }, value: 0.003 },
    { name: 'humanizeLength', helper: humanizeLength, options: { units: SI, postfix: 'm' }, value: 1_500 },
    { name: 'humanizeArea', helper: humanizeArea, options: { units: SI, postfix: 'm^2' }, value: 12 },
    { name: 'humanizeVolumeFlowRate', helper: humanizeVolumeFlowRate, options: { units: SI, postfix: 'm^3/s' }, value: 0.0025 },
    { name: 'humanizeMassFlowRate', helper: humanizeMassFlowRate, options: { units: SI, postfix: 'kg/s' }, value: 0.0025 },
    { name: 'humanizeDensity', helper: humanizeDensity, options: { units: SI, postfix: 'kg/m^3' }, value: 7_800 },
    { name: 'humanizeConcentration', helper: humanizeConcentration, options: { units: SI, postfix: 'mol/m^3' }, value: 1.2 },
    { name: 'humanizeMolarMass', helper: humanizeMolarMass, options: { units: SI, postfix: 'g/mol' }, value: 0.012 },
    { name: 'humanizeMolarVolume', helper: humanizeMolarVolume, options: { units: SI, postfix: 'm^3/mol' }, value: 0.00045 },
    { name: 'humanizeMolarDensity', helper: humanizeMolarDensity, options: { units: SI, postfix: 'mol/m^3' }, value: 0.0000032 },
    { name: 'humanizeMolarConcentration', helper: humanizeMolarConcentration, options: { units: SI, postfix: 'mol/m^3' }, value: 0.0009 },
    { name: 'humanizeMagneticFlux', helper: humanizeMagneticFlux, options: { units: SI, postfix: 'Wb' }, value: 0.0042 },
    {
      name: 'humanizeMagneticFluxDensity',
      helper: humanizeMagneticFluxDensity,
      options: { units: SI, postfix: 'T' },
      value: 0.00042,
    },
    { name: 'humanizeIlluminance', helper: humanizeIlluminance, options: { units: SI, postfix: 'lx' }, value: 12_000 },
    { name: 'humanizeLuminousFlux', helper: humanizeLuminousFlux, options: { units: SI, postfix: 'lm' }, value: 1_500 },
    { name: 'humanizeRadioactivity', helper: humanizeRadioactivity, options: { units: SI, postfix: 'Bq' }, value: 3_200_000 },
    {
      name: 'humanizeRadiationDoseEquivalent',
      helper: humanizeRadiationDoseEquivalent,
      options: { units: SI, postfix: 'Sv' },
      value: 0.00075,
    },
    {
      name: 'humanizeRadiationDoseAbsorbed',
      helper: humanizeRadiationDoseAbsorbed,
      options: { units: SI, postfix: 'Gy' },
      value: 0.002,
    },
    {
      name: 'humanizeCatalyticActivity',
      helper: humanizeCatalyticActivity,
      options: { units: SI, postfix: 'kat' },
      value: 0.0035,
    },
  ];

  const sampleOptions: HumanizeHelperOptions = {
    significantDigits: 4,
    minimumSignificantDigits: 2,
    locale: 'en-US',
    useGrouping: true,
    unitSeparator: ' ',
    emptyValue: 'n/a',
  };

  helperCases.forEach(({ name, helper, options, value }) => {
    it(`${name} mirrors humanizeUnit output`, () => {
      expect(helper(value)).toBe(humanizeUnit(value, options));
      expect(helper(value, sampleOptions)).toBe(humanizeUnit(value, { ...sampleOptions, ...options }));
    });
  });

  it('supports helper options typing', () => {
    expectTypeOf(sampleOptions).toMatchTypeOf<HumanizeHelperOptions>();
    expect(humanizeBytes(1_500, sampleOptions)).toBe('1.5 kB');
  });
});
