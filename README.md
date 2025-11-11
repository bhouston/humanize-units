# humanize-units

Lightweight TypeScript helpers for turning raw numeric values into human-friendly strings with unit suffixes. Publishable as a modern ESM package.

## Installation

```bash
pnpm add humanize-units
```

## Usage

```ts
import { BytesDecimal, Count, Time, humanizeUnit, siUnits } from 'humanize-units';

humanizeUnit(42_500); // "42.5k" (defaults to Count units)
humanizeUnit(8_388_608, { units: BytesDecimal }); // "8.39MB"
humanizeUnit(86_400, { units: Time }); // "1d"

// Provide your own unit table
const distanceUnits = [
  { value: 1_000, notation: 'km' },
  { value: 1, notation: 'm' },
];
humanizeUnit(1_500, { units: distanceUnits, significantDigits: 4 }); // "1.500km"

// Generate SI tables on demand
const voltageUnits = siUnits('V', { minExponent: -3, maxExponent: 6 });
humanizeUnit(0.0032, { units: voltageUnits }); // "3.2mV"
```

Fine-tune rounding, grouping, locale, and presentation via options.

```ts
humanizeUnit(1_048_576, { units: BytesDecimal, significantDigits: 4, useGrouping: true }); // "1.049MB"
humanizeUnit(1_500, {
  units: BytesDecimal,
  significantDigits: 4,
  minimumSignificantDigits: 4,
  useGrouping: true,
}); // "1.500KB"
humanizeUnit(12_345_678, {
  units: Count,
  locale: 'de-DE',
  useGrouping: true,
  significantDigits: 4,
}); // "12,35M"
humanizeUnit(65, { units: Time, unitSeparator: ' ' }); // "1.08 m"
```

## Development

```bash
pnpm install
pnpm lint
pnpm test
pnpm build
```

Built artifacts land in `dist/`.
