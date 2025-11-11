export type Unit = {
  value: number;
  notation: string;
};

export type UnitArray = Unit[];

type SiUnitsOptions = {
  minExponent?: number;
  maxExponent?: number;
};

const SI_PREFIXES = [
  { prefix: 'Y', exponent: 24 },
  { prefix: 'Z', exponent: 21 },
  { prefix: 'E', exponent: 18 },
  { prefix: 'P', exponent: 15 },
  { prefix: 'T', exponent: 12 },
  { prefix: 'G', exponent: 9 },
  { prefix: 'M', exponent: 6 },
  { prefix: 'k', exponent: 3 },
  { prefix: '', exponent: 0 },
  { prefix: 'm', exponent: -3 },
  { prefix: 'u', exponent: -6 },
  { prefix: 'n', exponent: -9 },
  { prefix: 'p', exponent: -12 },
  { prefix: 'f', exponent: -15 },
  { prefix: 'a', exponent: -18 },
  { prefix: 'z', exponent: -21 },
  { prefix: 'y', exponent: -24 },
];

export const siUnits = (postfix: string, options: SiUnitsOptions = {}): UnitArray => {
  const minExponent = options.minExponent ?? -9;
  const maxExponent = options.maxExponent ?? 15;

  return SI_PREFIXES.filter((entry) => entry.exponent >= minExponent && entry.exponent <= maxExponent)
    .map<UnitArray[number]>((entry) => ({
      value: 10 ** entry.exponent,
      notation: `${entry.prefix}${postfix}`,
    }))
    .sort((a, b) => b.value - a.value);
};

export const BytesBinary: UnitArray = [
  { value: 1_024 ** 8, notation: 'YiB' },
  { value: 1_024 ** 7, notation: 'ZiB' },
  { value: 1_024 ** 6, notation: 'EiB' },
  { value: 1_024 ** 5, notation: 'PiB' },
  { value: 1_024 ** 4, notation: 'TiB' },
  { value: 1_024 ** 3, notation: 'GiB' },
  { value: 1024 ** 2, notation: 'MiB' },
  { value: 1024 ** 1, notation: 'KiB' },
  { value: 1024 ** 0, notation: 'B' },
];
export const StorageBinary: UnitArray = BytesBinary;

export const Time: UnitArray = [
  { value: 31_536_000, notation: 'y' }, // 365 days
  { value: 604_800, notation: 'w' },
  { value: 86_400, notation: 'd' },
  { value: 3_600, notation: 'h' },
  { value: 60, notation: 'm' },
  { value: 1, notation: 's' },
  { value: 0.001, notation: 'ms' },
];

export const Count: UnitArray = siUnits('', { minExponent: 0, maxExponent: 15 });
export const Bytes: UnitArray = siUnits('B', { minExponent: 0, maxExponent: 15 });
export const BytesDecimal: UnitArray = Bytes;
export const Storage: UnitArray = Bytes;
export const Distance: UnitArray = siUnits('m', { minExponent: -6, maxExponent: 6 });
export const Mass: UnitArray = siUnits('g', { minExponent: -3, maxExponent: 6 });
export const Acceleration: UnitArray = siUnits('m/s^2', { minExponent: -3, maxExponent: 3 });
export const Charge: UnitArray = siUnits('C', { minExponent: -9, maxExponent: 3 });
export const Momentum: UnitArray = siUnits('N*s', { minExponent: -6, maxExponent: 6 });
export const Power: UnitArray = siUnits('W', { minExponent: -3, maxExponent: 12 });
export const Velocity: UnitArray = siUnits('m/s', { minExponent: -6, maxExponent: 6 });
export const Volume: UnitArray = siUnits('m^3', { minExponent: -6, maxExponent: 6 });
export const LiquidVolume: UnitArray = siUnits('L', { minExponent: -3, maxExponent: 6 });
export const Temperature: UnitArray = siUnits('°C', { minExponent: -3, maxExponent: 3 });
export const TemperatureKelvin: UnitArray = siUnits('°K', { minExponent: -3, maxExponent: 3 });
export const Pressure: UnitArray = siUnits('Pa', { minExponent: -3, maxExponent: 12 });
export const Force: UnitArray = siUnits('N', { minExponent: -3, maxExponent: 12 });
export const Torque: UnitArray = siUnits('N*m', { minExponent: -3, maxExponent: 12 });
export const Energy: UnitArray = siUnits('J', { minExponent: -3, maxExponent: 12 });
export const Voltage: UnitArray = siUnits('V', { minExponent: -3, maxExponent: 12 });
export const Current: UnitArray = siUnits('A', { minExponent: -3, maxExponent: 12 });
export const Resistance: UnitArray = siUnits('Ω', { minExponent: -3, maxExponent: 12 });
export const Capacitance: UnitArray = siUnits('F', { minExponent: -3, maxExponent: 12 });
export const Inductance: UnitArray = siUnits('H', { minExponent: -3, maxExponent: 12 });
export const Frequency: UnitArray = siUnits('Hz', { minExponent: -3, maxExponent: 12 });
export const Angle: UnitArray = siUnits('°', { minExponent: -3, maxExponent: 12 });
export const Length: UnitArray = siUnits('m', { minExponent: -3, maxExponent: 12 });
export const Area: UnitArray = siUnits('m^2', { minExponent: -3, maxExponent: 12 });
export const VolumeFlowRate: UnitArray = siUnits('m^3/s', { minExponent: -3, maxExponent: 12 });
export const MassFlowRate: UnitArray = siUnits('kg/s', { minExponent: -3, maxExponent: 12 });
export const Density: UnitArray = siUnits('kg/m^3', { minExponent: -3, maxExponent: 12 });
export const Concentration: UnitArray = siUnits('mol/m^3', { minExponent: -3, maxExponent: 12 });
export const MolarMass: UnitArray = siUnits('g/mol', { minExponent: -3, maxExponent: 12 });
export const MolarVolume: UnitArray = siUnits('m^3/mol', { minExponent: -3, maxExponent: 12 });
export const MolarDensity: UnitArray = siUnits('mol/m^3', { minExponent: -3, maxExponent: 12 });
export const MolarConcentration: UnitArray = siUnits('mol/m^3', { minExponent: -3, maxExponent: 12 });
export const MagneticFlux: UnitArray = siUnits('Wb', { minExponent: -3, maxExponent: 9 });
export const MagneticFluxDensity: UnitArray = siUnits('T', { minExponent: -9, maxExponent: 3 });
export const Illuminance: UnitArray = siUnits('lx', { minExponent: -6, maxExponent: 6 });
export const LuminousFlux: UnitArray = siUnits('lm', { minExponent: -6, maxExponent: 6 });
export const Radioactivity: UnitArray = siUnits('Bq', { minExponent: -3, maxExponent: 12 });
export const RadiationDoseEquivalent: UnitArray = siUnits('Sv', { minExponent: -6, maxExponent: 6 });
export const RadiationDoseAbsorbed: UnitArray = siUnits('Gy', { minExponent: -6, maxExponent: 6 });
export const CatalyticActivity: UnitArray = siUnits('kat', { minExponent: -3, maxExponent: 6 });
