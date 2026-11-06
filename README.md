<p align="center">
  <a href="https://npmjs.com/package/humanize-units"><img src="https://img.shields.io/npm/v/humanize-units.svg" alt="npm package"></a>
  <a href="https://www.npmtrends.com/humanize-units"><img src="https://img.shields.io/npm/dw/humanize-units.svg" alt="npm downloads"></a>
  <a href="https://codecov.io/gh/bhouston/humanize-units"><img src="https://codecov.io/gh/bhouston/humanize-units/branch/main/graph/badge.svg" alt="coverage"></a>
  <a href="https://discord.gg/fwupDN493R"><img src="https://img.shields.io/badge/chat-discord-blue?style=flat&logo=discord" alt="discord chat"></a>
</p>
<br/>

# Humanize Units

> Turn raw numbers into readable strings like 42.5k, 8.39MB, and 1d.

- 📏 Over 50 Ready-Made Helpers
- 🛠️ Custom Unit Tables
- 🌍 Locale-Aware Number Formatting
- 🌳 Tree-Shakeable ESM Package
- 📦 Zero Runtime Dependencies
- 🔷 Fully Typed TypeScript API

Lightweight TypeScript helpers for turning raw numeric values into human-friendly strings with unit suffixes. Optimized for treeshaking with a base footprint of 3 KB (about 1 KB minified). Published as a modern ESM package.

`humanizeUnit` picks the largest unit whose threshold fits the value, then rounds with `Intl.NumberFormat` using your significant-digit, grouping, and locale options. Helpers such as `humanizeBytes` and `humanizeTime` preconfigure it for common quantities.

## Installation

```bash
pnpm add humanize-units
```

## Usage

```ts
import { Time, humanizeUnit } from 'humanize-units';

humanizeUnit(42_500); // "42.5k" (defaults to SI units)
humanizeUnit(8_388_608, { postfix: 'B' }); // "8.39MB" (SI is default, so units can be omitted)
humanizeUnit(86_400, { units: Time }); // "1d"
```

### Helper shortcuts

Every built-in unit table has a convenience helper that preconfigures `humanizeUnit` for you:

```ts
import { humanizeBytes, humanizeTime } from 'humanize-units';

humanizeBytes(1_500); // "1.5kB"
humanizeBytes(8_388_608, { useGrouping: true }); // "8.39MB"

humanizeTime(3_600); // "1h"
humanizeTime(42, { unitSeparator: ' ' }); // "42 s"
```

Fine-tune rounding, grouping, locale, and presentation via options.

```ts
humanizeUnit(1_048_576, { postfix: 'B', significantDigits: 4, useGrouping: true }); // "1.049MB"
humanizeUnit(1_500, {
  postfix: 'B',
  significantDigits: 4,
  minimumSignificantDigits: 4,
  useGrouping: true,
}); // "1.500kB"
humanizeUnit(12_345_678, {
  locale: 'de-DE',
  useGrouping: true,
  significantDigits: 4,
}); // "12,35M"
humanizeUnit(65, { units: Time, unitSeparator: ' ' }); // "1.08 m"
```

## Options

`humanizeUnit(value, options)` accepts a numeric value (or `null` / `undefined`) and an optional configuration object:

| Option                     | Type        | Default   | Description                                                                                                                                                                                         |
| -------------------------- | ----------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `units`                    | `UnitArray` | `SI`      | Ordered list of unit breakpoints (magnitude prefixes). Provide your own to customize the prefixes and value thresholds. Since `SI` is the default, you can omit this option when using SI prefixes. |
| `postfix`                  | `string`    | `''`      | Text appended after the unit. Useful when using base prefix arrays like `SI` (the default) or `Binary` to separate the prefix from the unit abbreviation (e.g., `'B'` for bytes, `'V'` for volts).  |
| `significantDigits`        | `number`    | `3`       | Maximum number of significant digits to display. Passed to `Intl.NumberFormat`.                                                                                                                     |
| `minimumSignificantDigits` | `number`    | `1`       | Minimum number of significant digits to display.                                                                                                                                                    |
| `locale`                   | `string`    | `'en-US'` | BCP 47 locale string forwarded to `Intl.NumberFormat`.                                                                                                                                              |
| `useGrouping`              | `boolean`   | `false`   | Enables digit grouping separators (e.g. `1,000`).                                                                                                                                                   |
| `unitSeparator`            | `string`    | `''`      | Inserted between the formatted value and the unit.                                                                                                                                                  |
| `emptyValue`               | `string`    | `''`      | Returned when the input is `null`, `undefined`, or `NaN`.                                                                                                                                           |

Additional behaviour:

- Infinite values (`Infinity`, `-Infinity`) are returned as strings without modification.
- If no unit in `units` matches the absolute value, the smallest unit in the table is used as a fallback.
- Helpers like `humanizeBytes` accept the same options (except `units` and `postfix`, which are preconfigured).

## Customize with your Own Units

You can easily create your own unit tables. The design separates magnitude prefixes from quantity abbreviations:

```ts
// Option 1: Use SI/Binary prefixes with a postfix for the quantity
import { Binary } from 'humanize-units';

// Bytes using SI prefixes + 'B' postfix (SI is default, so units can be omitted)
humanizeUnit(1_500, { postfix: 'B' }); // "1.5kB"
humanizeUnit(1_048_576, { units: Binary, postfix: 'B' }); // "1MiB"

// Voltage using SI prefixes + 'V' postfix
humanizeUnit(0.0032, { postfix: 'V' }); // "3.2mV"

// Option 2: Provide your own complete unit table (prefix + abbreviation combined)
const distanceUnits = [
  { value: 1_000, unit: 'km' },
  { value: 1, unit: 'm' },
];
humanizeUnit(1_500, { units: distanceUnits, significantDigits: 4 }); // "1.5km"
```

## Built-in Units & Helpers

Three unit tables are exported: `SI` (k, M, G, ...), `Binary` (Ki, Mi, Gi, ...), and `Time` (s, m, h, d, ...). Every helper below is `humanizeUnit` preconfigured with one of them plus a postfix, and accepts the same options except `units` and `postfix`.

| Helper                            | Prefix table | Postfix   |
| --------------------------------- | ------------ | --------- |
| `humanizeCount`                   | `SI`         | -         |
| `humanizeBytes`                   | `SI`         | `B`       |
| `humanizeBytesDecimal`            | `SI`         | `B`       |
| `humanizeBytesBinary`             | `Binary`     | `B`       |
| `humanizeByteRate`                | `SI`         | `Bps`     |
| `humanizeBits`                    | `SI`         | `b`       |
| `humanizeBitsDecimal`             | `SI`         | `b`       |
| `humanizeBitsBinary`              | `Binary`     | `b`       |
| `humanizeBitRate`                 | `SI`         | `bps`     |
| `humanizeStorage`                 | `SI`         | `B`       |
| `humanizeStorageBinary`           | `Binary`     | `B`       |
| `humanizeTime`                    | `Time`       | -         |
| `humanizeDistance`                | `SI`         | `m`       |
| `humanizeMass`                    | `SI`         | `g`       |
| `humanizeAcceleration`            | `SI`         | `m/s^2`   |
| `humanizeCharge`                  | `SI`         | `C`       |
| `humanizeMomentum`                | `SI`         | `N*s`     |
| `humanizePower`                   | `SI`         | `W`       |
| `humanizeVelocity`                | `SI`         | `m/s`     |
| `humanizeVolume`                  | `SI`         | `m^3`     |
| `humanizeLiquidVolume`            | `SI`         | `L`       |
| `humanizeTemperature`             | `SI`         | `°C`      |
| `humanizeTemperatureKelvin`       | `SI`         | `°K`      |
| `humanizePressure`                | `SI`         | `Pa`      |
| `humanizeForce`                   | `SI`         | `N`       |
| `humanizeTorque`                  | `SI`         | `N*m`     |
| `humanizeEnergy`                  | `SI`         | `J`       |
| `humanizeVoltage`                 | `SI`         | `V`       |
| `humanizeCurrent`                 | `SI`         | `A`       |
| `humanizeResistance`              | `SI`         | `Ω`       |
| `humanizeCapacitance`             | `SI`         | `F`       |
| `humanizeInductance`              | `SI`         | `H`       |
| `humanizeFrequency`               | `SI`         | `Hz`      |
| `humanizeAngle`                   | `SI`         | `°`       |
| `humanizeLength`                  | `SI`         | `m`       |
| `humanizeArea`                    | `SI`         | `m^2`     |
| `humanizeVolumeFlowRate`          | `SI`         | `m^3/s`   |
| `humanizeMassFlowRate`            | `SI`         | `kg/s`    |
| `humanizeDensity`                 | `SI`         | `kg/m^3`  |
| `humanizeConcentration`           | `SI`         | `mol/m^3` |
| `humanizeMolarMass`               | `SI`         | `g/mol`   |
| `humanizeMolarVolume`             | `SI`         | `m^3/mol` |
| `humanizeMolarDensity`            | `SI`         | `mol/m^3` |
| `humanizeMolarConcentration`      | `SI`         | `mol/m^3` |
| `humanizeMagneticFlux`            | `SI`         | `Wb`      |
| `humanizeMagneticFluxDensity`     | `SI`         | `T`       |
| `humanizeIlluminance`             | `SI`         | `lx`      |
| `humanizeLuminousFlux`            | `SI`         | `lm`      |
| `humanizeLuminousIntensity`       | `SI`         | `cd`      |
| `humanizeLuminousEfficacy`        | `SI`         | `lm/W`    |
| `humanizeRadioactivity`           | `SI`         | `Bq`      |
| `humanizeRadiationDoseEquivalent` | `SI`         | `Sv`      |
| `humanizeRadiationDoseAbsorbed`   | `SI`         | `Gy`      |
| `humanizeCatalyticActivity`       | `SI`         | `kat`     |

## Development

```bash
pnpm install
pnpm tsc
pnpm build
pnpm lint # oxlint
pnpm lint:fix
pnpm format # oxfmt
pnpm test # vitest
```

Built artifacts land in `dist/`.

CI also enforces 100% statement/branch/function/line coverage, a 2 kB compressed bundle limit (size-limit), and an advisory dependency audit. See [RELEASING.md](RELEASING.md#thresholds) for the thresholds and how to change them.

## Releases

See [RELEASING.md](RELEASING.md) for how releases are published and [GitHub Releases](https://github.com/bhouston/humanize-units/releases) for changes. See [SECURITY.md](SECURITY.md) to report vulnerabilities.

## Contribution

See [Contributing Guide](CONTRIBUTING.md).

## License

MIT

## Author

[Ben Houston](https://ben3d.ca), Sponsored by [Land of Assets](https://landofassets.com).
