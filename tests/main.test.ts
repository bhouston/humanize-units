import { describe, expect, expectTypeOf, it } from 'vitest';

import {
  Acceleration,
  Angle,
  Area,
  Bytes,
  BytesBinary,
  BytesDecimal,
  Capacitance,
  CatalyticActivity,
  Charge,
  Concentration,
  Count,
  Current,
  Density,
  Distance,
  Energy,
  Force,
  Frequency,
  Illuminance,
  Inductance,
  Length,
  LiquidVolume,
  LuminousFlux,
  MagneticFlux,
  MagneticFluxDensity,
  Mass,
  MassFlowRate,
  MolarConcentration,
  MolarDensity,
  MolarMass,
  MolarVolume,
  Momentum,
  Power,
  Pressure,
  RadiationDoseAbsorbed,
  RadiationDoseEquivalent,
  Radioactivity,
  Resistance,
  Storage,
  StorageBinary,
  Temperature,
  TemperatureKelvin,
  Time,
  Torque,
  Velocity,
  Voltage,
  Volume,
  VolumeFlowRate,
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
  siUnits,
  type HumanizeHelper,
  type HumanizeHelperOptions,
  type HumanizeUnitOptions,
  type UnitArray,
} from '../src/index.js';
import { __private__ } from '../src/humanizeUnit.js';

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
  const helperCases: Array<{
    name: string;
    helper: HumanizeHelper;
    units: UnitArray;
    value: number;
  }> = [
    { name: 'humanizeCount', helper: humanizeCount, units: Count, value: 12_345 },
    { name: 'humanizeBytes', helper: humanizeBytes, units: Bytes, value: 1_500 },
    { name: 'humanizeBytesDecimal', helper: humanizeBytesDecimal, units: BytesDecimal, value: 8_388_608 },
    { name: 'humanizeBytesBinary', helper: humanizeBytesBinary, units: BytesBinary, value: 1_048_576 },
    { name: 'humanizeStorage', helper: humanizeStorage, units: Storage, value: 2_500 },
    { name: 'humanizeStorageBinary', helper: humanizeStorageBinary, units: StorageBinary, value: 1_024 },
    { name: 'humanizeTime', helper: humanizeTime, units: Time, value: 3_600 },
    { name: 'humanizeDistance', helper: humanizeDistance, units: Distance, value: 1_500 },
    { name: 'humanizeMass', helper: humanizeMass, units: Mass, value: 1_500 },
    { name: 'humanizeAcceleration', helper: humanizeAcceleration, units: Acceleration, value: 9.81 },
    { name: 'humanizeCharge', helper: humanizeCharge, units: Charge, value: 0.0025 },
    { name: 'humanizeMomentum', helper: humanizeMomentum, units: Momentum, value: 12 },
    { name: 'humanizePower', helper: humanizePower, units: Power, value: 50_000 },
    { name: 'humanizeVelocity', helper: humanizeVelocity, units: Velocity, value: 12_500 },
    { name: 'humanizeVolume', helper: humanizeVolume, units: Volume, value: 0.0034 },
    { name: 'humanizeLiquidVolume', helper: humanizeLiquidVolume, units: LiquidVolume, value: 2.5 },
    { name: 'humanizeTemperature', helper: humanizeTemperature, units: Temperature, value: 0.0012 },
    { name: 'humanizeTemperatureKelvin', helper: humanizeTemperatureKelvin, units: TemperatureKelvin, value: 12 },
    { name: 'humanizePressure', helper: humanizePressure, units: Pressure, value: 101_325 },
    { name: 'humanizeForce', helper: humanizeForce, units: Force, value: 12_000 },
    { name: 'humanizeTorque', helper: humanizeTorque, units: Torque, value: 450 },
    { name: 'humanizeEnergy', helper: humanizeEnergy, units: Energy, value: 12_000 },
    { name: 'humanizeVoltage', helper: humanizeVoltage, units: Voltage, value: 0.0032 },
    { name: 'humanizeCurrent', helper: humanizeCurrent, units: Current, value: 0.00045 },
    { name: 'humanizeResistance', helper: humanizeResistance, units: Resistance, value: 12_000 },
    { name: 'humanizeCapacitance', helper: humanizeCapacitance, units: Capacitance, value: 0.0000022 },
    { name: 'humanizeInductance', helper: humanizeInductance, units: Inductance, value: 0.015 },
    { name: 'humanizeFrequency', helper: humanizeFrequency, units: Frequency, value: 1_000_000 },
    { name: 'humanizeAngle', helper: humanizeAngle, units: Angle, value: 0.003 },
    { name: 'humanizeLength', helper: humanizeLength, units: Length, value: 1_500 },
    { name: 'humanizeArea', helper: humanizeArea, units: Area, value: 12 },
    { name: 'humanizeVolumeFlowRate', helper: humanizeVolumeFlowRate, units: VolumeFlowRate, value: 0.0025 },
    { name: 'humanizeMassFlowRate', helper: humanizeMassFlowRate, units: MassFlowRate, value: 0.0025 },
    { name: 'humanizeDensity', helper: humanizeDensity, units: Density, value: 7_800 },
    { name: 'humanizeConcentration', helper: humanizeConcentration, units: Concentration, value: 1.2 },
    { name: 'humanizeMolarMass', helper: humanizeMolarMass, units: MolarMass, value: 0.012 },
    { name: 'humanizeMolarVolume', helper: humanizeMolarVolume, units: MolarVolume, value: 0.00045 },
    { name: 'humanizeMolarDensity', helper: humanizeMolarDensity, units: MolarDensity, value: 0.0000032 },
    { name: 'humanizeMolarConcentration', helper: humanizeMolarConcentration, units: MolarConcentration, value: 0.0009 },
    { name: 'humanizeMagneticFlux', helper: humanizeMagneticFlux, units: MagneticFlux, value: 0.0042 },
    {
      name: 'humanizeMagneticFluxDensity',
      helper: humanizeMagneticFluxDensity,
      units: MagneticFluxDensity,
      value: 0.00042,
    },
    { name: 'humanizeIlluminance', helper: humanizeIlluminance, units: Illuminance, value: 12_000 },
    { name: 'humanizeLuminousFlux', helper: humanizeLuminousFlux, units: LuminousFlux, value: 1_500 },
    { name: 'humanizeRadioactivity', helper: humanizeRadioactivity, units: Radioactivity, value: 3_200_000 },
    {
      name: 'humanizeRadiationDoseEquivalent',
      helper: humanizeRadiationDoseEquivalent,
      units: RadiationDoseEquivalent,
      value: 0.00075,
    },
    {
      name: 'humanizeRadiationDoseAbsorbed',
      helper: humanizeRadiationDoseAbsorbed,
      units: RadiationDoseAbsorbed,
      value: 0.002,
    },
    {
      name: 'humanizeCatalyticActivity',
      helper: humanizeCatalyticActivity,
      units: CatalyticActivity,
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

  helperCases.forEach(({ name, helper, units, value }) => {
    it(`${name} mirrors humanizeUnit output`, () => {
      expect(helper(value)).toBe(humanizeUnit(value, { units }));
      expect(helper(value, sampleOptions)).toBe(humanizeUnit(value, { ...sampleOptions, units }));
    });
  });

  it('supports helper options typing', () => {
    expectTypeOf(sampleOptions).toMatchTypeOf<HumanizeHelperOptions>();
    expect(humanizeBytes(1_500, sampleOptions)).toBe('1.5 kB');
  });
});

describe('humanizeUnit internals', () => {
  const { normalizeUnits, selectUnit } = __private__;

  it('normalizeUnits throws on empty input', () => {
    expect(() => normalizeUnits([] as unknown as UnitArray)).toThrow(
      'humanizeUnit requires at least one unit definition.',
    );
  });

  it('selectUnit throws when no fallback unit is available', () => {
    expect(() => selectUnit(1, [] as unknown as UnitArray)).toThrow(
      'humanizeUnit requires at least one unit definition.',
    );
  });
});
