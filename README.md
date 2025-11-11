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

## Built-in Units & Helpers

| Unit table | Description | Helper |
| --- | --- | --- |
| `Count` | SI prefixes for general counts | `humanizeCount` |
| `Bytes` | Decimal byte sizes (kB, MB, …) | `humanizeBytes` |
| `BytesDecimal` | Alias of `Bytes` | `humanizeBytesDecimal` |
| `BytesBinary` | Binary byte sizes (KiB, MiB, …) | `humanizeBytesBinary` |
| `Storage` | Decimal storage sizes | `humanizeStorage` |
| `StorageBinary` | Binary storage sizes | `humanizeStorageBinary` |
| `Time` | Seconds to years | `humanizeTime` |
| `Distance` | SI distances (μm to Mm) | `humanizeDistance` |
| `Mass` | SI masses (mg to Mg) | `humanizeMass` |
| `Acceleration` | SI accelerations | `humanizeAcceleration` |
| `Charge` | SI electric charge | `humanizeCharge` |
| `Momentum` | SI momentum | `humanizeMomentum` |
| `Power` | SI power (W) | `humanizePower` |
| `Velocity` | SI velocity (m/s) | `humanizeVelocity` |
| `Volume` | SI volume (m³) | `humanizeVolume` |
| `LiquidVolume` | SI liquid volume (L) | `humanizeLiquidVolume` |
| `Temperature` | Celsius with SI prefixes | `humanizeTemperature` |
| `TemperatureKelvin` | Kelvin with SI prefixes | `humanizeTemperatureKelvin` |
| `Pressure` | SI pressure (Pa) | `humanizePressure` |
| `Force` | SI force (N) | `humanizeForce` |
| `Torque` | SI torque (N·m) | `humanizeTorque` |
| `Energy` | SI energy (J) | `humanizeEnergy` |
| `Voltage` | SI voltage (V) | `humanizeVoltage` |
| `Current` | SI current (A) | `humanizeCurrent` |
| `Resistance` | SI resistance (Ω) | `humanizeResistance` |
| `Capacitance` | SI capacitance (F) | `humanizeCapacitance` |
| `Inductance` | SI inductance (H) | `humanizeInductance` |
| `Frequency` | SI frequency (Hz) | `humanizeFrequency` |
| `Angle` | SI angle (degrees) | `humanizeAngle` |
| `Length` | SI length (m) | `humanizeLength` |
| `Area` | SI area (m²) | `humanizeArea` |
| `VolumeFlowRate` | SI volumetric flow (m³/s) | `humanizeVolumeFlowRate` |
| `MassFlowRate` | SI mass flow (kg/s) | `humanizeMassFlowRate` |
| `Density` | SI density (kg/m³) | `humanizeDensity` |
| `Concentration` | SI concentration (mol/m³) | `humanizeConcentration` |
| `MolarMass` | SI molar mass (g/mol) | `humanizeMolarMass` |
| `MolarVolume` | SI molar volume (m³/mol) | `humanizeMolarVolume` |
| `MolarDensity` | SI molar density (mol/m³) | `humanizeMolarDensity` |
| `MolarConcentration` | Alias of `Concentration` | `humanizeMolarConcentration` |
| `MagneticFlux` | Magnetic flux (weber) | `humanizeMagneticFlux` |
| `MagneticFluxDensity` | Magnetic flux density (tesla) | `humanizeMagneticFluxDensity` |
| `Illuminance` | Illuminance (lux) | `humanizeIlluminance` |
| `LuminousFlux` | Luminous flux (lumen) | `humanizeLuminousFlux` |
| `Radioactivity` | Radioactivity (becquerel) | `humanizeRadioactivity` |
| `RadiationDoseEquivalent` | Equivalent dose (sievert) | `humanizeRadiationDoseEquivalent` |
| `RadiationDoseAbsorbed` | Absorbed dose (gray) | `humanizeRadiationDoseAbsorbed` |
| `CatalyticActivity` | Catalytic activity (katal) | `humanizeCatalyticActivity` |

## Development

```bash
pnpm install
pnpm lint
pnpm test
pnpm build
```

Built artifacts land in `dist/`.
