/**
 * Mapping that describes a single unit breakpoint.
 */
export type Unit = {
  /**
   * Threshold value (inclusive). Values greater than or equal to this will use
   * the associated {@link unit}.
   */
  value: number;
  /**
   * Suffix appended to the formatted value (e.g. `MB`).
   */
  unit: string;
};

/**
 * Array of units ordered from largest to smallest magnitude.
 */
export type UnitArray = Unit[];

/** SI prefixes. */
export const SI: UnitArray = [
  { unit: 'Y', value: 10 ** 24 },
  { unit: 'Z', value: 10 ** 21 },
  { unit: 'E', value: 10 ** 18 },
  { unit: 'P', value: 10 ** 15 },
  { unit: 'T', value: 10 ** 12 },
  { unit: 'G', value: 10 ** 9 },
  { unit: 'M', value: 10 ** 6 },
  { unit: 'k', value: 10 ** 3 },
  { unit: '', value: 10 ** 0 },
  { unit: 'm', value: 10 ** -3 },
  { unit: 'u', value: 10 ** -6 },
  { unit: 'n', value: 10 ** -9 },
  { unit: 'p', value: 10 ** -12 },
] as const;

/**
 * Base binary unit array with prefixes only (no postfix).
 * Use with {@link HumanizeUnitOptions.postfix} to add unit abbreviations.
 */
export const Binary: UnitArray = [
  { value: 1_024 ** 8, unit: 'Yi' },
  { value: 1_024 ** 7, unit: 'Zi' },
  { value: 1_024 ** 6, unit: 'Ei' },
  { value: 1_024 ** 5, unit: 'Pi' },
  { value: 1_024 ** 4, unit: 'Ti' },
  { value: 1_024 ** 3, unit: 'Gi' },
  { value: 1024 ** 2, unit: 'Mi' },
  { value: 1024 ** 1, unit: 'Ki' },
  { value: 1024 ** 0, unit: '' },
] as const;

/** Alias of {@link BytesBinary}. */

/** Time units ranging from femtoseconds to years. */
export const Time: UnitArray = [
  { value: 31_536_000, unit: 'y' }, // 365 days
  { value: 604_800, unit: 'w' },
  { value: 86_400, unit: 'd' },
  { value: 3_600, unit: 'h' },
  { value: 60, unit: 'm' },
  { value: 1, unit: 's' },
  { value: 0.001, unit: 'ms' },
  { value: 0.000_001, unit: 'µs' },
  { value: 0.000_000_001, unit: 'ns' },
  { value: 0.000_000_000_001, unit: 'ps' },
  { value: 0.000_000_000_000_001, unit: 'fs' },
];
