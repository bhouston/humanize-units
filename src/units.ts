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

/** SI prefixes. */
export const SI: UnitArray = [
  { notation: 'Y', value: 10 ** 24 },
  { notation: 'Z', value: 10 ** 21 },
  { notation: 'E', value: 10 ** 18 },
  { notation: 'P', value: 10 ** 15 },
  { notation: 'T', value: 10 ** 12 },
  { notation: 'G', value: 10 ** 9 },
  { notation: 'M', value: 10 ** 6 },
  { notation: 'k', value: 10 ** 3 },
  { notation: '', value: 10 ** 0 },
  { notation: 'm', value: 10 ** -3 },
  { notation: 'u', value: 10 ** -6 },
  { notation: 'n', value: 10 ** -9 },
  { notation: 'p', value: 10 ** -12 },
] as const;

/**
 * Base binary unit array with prefixes only (no postfix).
 * Use with {@link HumanizeUnitOptions.postfix} to add unit abbreviations.
 */
export const Binary: UnitArray = [
  { value: 1_024 ** 8, notation: 'Yi' },
  { value: 1_024 ** 7, notation: 'Zi' },
  { value: 1_024 ** 6, notation: 'Ei' },
  { value: 1_024 ** 5, notation: 'Pi' },
  { value: 1_024 ** 4, notation: 'Ti' },
  { value: 1_024 ** 3, notation: 'Gi' },
  { value: 1024 ** 2, notation: 'Mi' },
  { value: 1024 ** 1, notation: 'Ki' },
  { value: 1024 ** 0, notation: '' },
] as const;

/** Alias of {@link BytesBinary}. */

/** Time units ranging from femtoseconds to years. */
export const Time: UnitArray = [
  { value: 31_536_000, notation: 'y' }, // 365 days
  { value: 604_800, notation: 'w' },
  { value: 86_400, notation: 'd' },
  { value: 3_600, notation: 'h' },
  { value: 60, notation: 'm' },
  { value: 1, notation: 's' },
  { value: 0.001, notation: 'ms' },
  { value: 0.000_001, notation: 'µs' },
  { value: 0.000_000_001, notation: 'ns' },
  { value: 0.000_000_000_001, notation: 'ps' },
  { value: 0.000_000_000_000_001, notation: 'fs' },
];
