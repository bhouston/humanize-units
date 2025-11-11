/**
 * Mapping that describes a single unit breakpoint.
 */
export type Unit = {
  /**
   * Threshold value (inclusive). Values greater than or equal to this will use
   * the associated {@link notation}.
   */
  value: number;
  /**
   * Suffix appended to the formatted value (e.g. `MB`).
   */
  notation: string;
};

/**
 * Array of units ordered from largest to smallest magnitude.
 */
export type UnitArray = Unit[];

/**
 * Controls how {@link siUnits} generates unit tables.
 */
type SiUnitsOptions = {
  /**
   * Smallest exponent (power of 10) to include. Defaults to `-9`.
   */
  minExponent?: number;
  /**
   * Largest exponent (power of 10) to include. Defaults to `15`.
   */
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

/**
 * Creates an SI-based unit table with the specified postfix and exponent range.
 *
 * @param postfix Text appended to each SI prefix (e.g. `'B'` -> `kB`).
 * @param options Restricts the set of exponents that are generated.
 * @returns Unit table sorted largest to smallest.
 */
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

/** Binary byte units (KiB, MiB, …). */
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
/** Alias of {@link BytesBinary}. */
export const StorageBinary: UnitArray = BytesBinary;

/** Time units ranging from milliseconds to years. */
export const Time: UnitArray = [
  { value: 31_536_000, notation: 'y' }, // 365 days
  { value: 604_800, notation: 'w' },
  { value: 86_400, notation: 'd' },
  { value: 3_600, notation: 'h' },
  { value: 60, notation: 'm' },
  { value: 1, notation: 's' },
  { value: 0.001, notation: 'ms' },
];

/** SI prefixes for general counts. */
export const Count: UnitArray = siUnits('', { minExponent: 0, maxExponent: 15 });
/** Decimal byte units (kB, MB, …). */
export const Bytes: UnitArray = siUnits('B', { minExponent: 0, maxExponent: 15 });
/** Alias of {@link Bytes}. */
export const BytesDecimal: UnitArray = Bytes;
/** Alias of {@link Bytes}. */
export const Storage: UnitArray = Bytes;
/** SI distances (micrometer to megameter). */
export const Distance: UnitArray = siUnits('m', { minExponent: -6, maxExponent: 6 });
/** SI masses (milligram to megagram). */
export const Mass: UnitArray = siUnits('g', { minExponent: -3, maxExponent: 6 });
/** SI accelerations (meter per second squared). */
export const Acceleration: UnitArray = siUnits('m/s^2', { minExponent: -3, maxExponent: 3 });
/** Electric charge (coulomb). */
export const Charge: UnitArray = siUnits('C', { minExponent: -9, maxExponent: 3 });
/** Momentum (newton second). */
export const Momentum: UnitArray = siUnits('N*s', { minExponent: -6, maxExponent: 6 });
/** Power (watt). */
export const Power: UnitArray = siUnits('W', { minExponent: -3, maxExponent: 12 });
/** Velocity (meter per second). */
export const Velocity: UnitArray = siUnits('m/s', { minExponent: -6, maxExponent: 6 });
/** Volume (cubic meter). */
export const Volume: UnitArray = siUnits('m^3', { minExponent: -6, maxExponent: 6 });
/** Liquid volume (liter). */
export const LiquidVolume: UnitArray = siUnits('L', { minExponent: -3, maxExponent: 6 });
/** Temperature in Celsius. */
export const Temperature: UnitArray = siUnits('°C', { minExponent: -3, maxExponent: 3 });
/** Temperature in Kelvin. */
export const TemperatureKelvin: UnitArray = siUnits('°K', { minExponent: -3, maxExponent: 3 });
/** Pressure (pascal). */
export const Pressure: UnitArray = siUnits('Pa', { minExponent: -3, maxExponent: 12 });
/** Force (newton). */
export const Force: UnitArray = siUnits('N', { minExponent: -3, maxExponent: 12 });
/** Torque (newton meter). */
export const Torque: UnitArray = siUnits('N*m', { minExponent: -3, maxExponent: 12 });
/** Energy (joule). */
export const Energy: UnitArray = siUnits('J', { minExponent: -3, maxExponent: 12 });
/** Voltage (volt). */
export const Voltage: UnitArray = siUnits('V', { minExponent: -3, maxExponent: 12 });
/** Current (ampere). */
export const Current: UnitArray = siUnits('A', { minExponent: -3, maxExponent: 12 });
/** Resistance (ohm). */
export const Resistance: UnitArray = siUnits('Ω', { minExponent: -3, maxExponent: 12 });
/** Capacitance (farad). */
export const Capacitance: UnitArray = siUnits('F', { minExponent: -3, maxExponent: 12 });
/** Inductance (henry). */
export const Inductance: UnitArray = siUnits('H', { minExponent: -3, maxExponent: 12 });
/** Frequency (hertz). */
export const Frequency: UnitArray = siUnits('Hz', { minExponent: -3, maxExponent: 12 });
/** Angle (degree). */
export const Angle: UnitArray = siUnits('°', { minExponent: -3, maxExponent: 12 });
/** Length (meter). */
export const Length: UnitArray = siUnits('m', { minExponent: -3, maxExponent: 12 });
/** Area (square meter). */
export const Area: UnitArray = siUnits('m^2', { minExponent: -3, maxExponent: 12 });
/** Volumetric flow rate (cubic meter per second). */
export const VolumeFlowRate: UnitArray = siUnits('m^3/s', { minExponent: -3, maxExponent: 12 });
/** Mass flow rate (kilogram per second). */
export const MassFlowRate: UnitArray = siUnits('kg/s', { minExponent: -3, maxExponent: 12 });
/** Density (kilogram per cubic meter). */
export const Density: UnitArray = siUnits('kg/m^3', { minExponent: -3, maxExponent: 12 });
/** Concentration (mole per cubic meter). */
export const Concentration: UnitArray = siUnits('mol/m^3', { minExponent: -3, maxExponent: 12 });
/** Molar mass (gram per mole). */
export const MolarMass: UnitArray = siUnits('g/mol', { minExponent: -3, maxExponent: 12 });
/** Molar volume (cubic meter per mole). */
export const MolarVolume: UnitArray = siUnits('m^3/mol', { minExponent: -3, maxExponent: 12 });
/** Molar density (mole per cubic meter). */
export const MolarDensity: UnitArray = siUnits('mol/m^3', { minExponent: -3, maxExponent: 12 });
/** Alias of {@link Concentration}. */
export const MolarConcentration: UnitArray = siUnits('mol/m^3', { minExponent: -3, maxExponent: 12 });
/** Magnetic flux (weber). */
export const MagneticFlux: UnitArray = siUnits('Wb', { minExponent: -3, maxExponent: 9 });
/** Magnetic flux density (tesla). */
export const MagneticFluxDensity: UnitArray = siUnits('T', { minExponent: -9, maxExponent: 3 });
/** Illuminance (lux). */
export const Illuminance: UnitArray = siUnits('lx', { minExponent: -6, maxExponent: 6 });
/** Luminous flux (lumen). */
export const LuminousFlux: UnitArray = siUnits('lm', { minExponent: -6, maxExponent: 6 });
/** Radioactivity (becquerel). */
export const Radioactivity: UnitArray = siUnits('Bq', { minExponent: -3, maxExponent: 12 });
/** Radiation equivalent dose (sievert). */
export const RadiationDoseEquivalent: UnitArray = siUnits('Sv', { minExponent: -6, maxExponent: 6 });
/** Radiation absorbed dose (gray). */
export const RadiationDoseAbsorbed: UnitArray = siUnits('Gy', { minExponent: -6, maxExponent: 6 });
/** Catalytic activity (katal). */
export const CatalyticActivity: UnitArray = siUnits('kat', { minExponent: -3, maxExponent: 6 });
