import { humanizeUnit, type HumanizeUnitOptions } from './humanizeUnit.js';
import {
  Acceleration,
  Angle,
  Area,
  Bytes,
  BytesBinary,
  BytesDecimal,
  Capacitance,
  Charge,
  Concentration,
  Count,
  Current,
  Density,
  Distance,
  Energy,
  Force,
  Frequency,
  Inductance,
  Length,
  LiquidVolume,
  Mass,
  MassFlowRate,
  MolarConcentration,
  MolarDensity,
  MolarMass,
  MolarVolume,
  Momentum,
  Power,
  Pressure,
  Resistance,
  Storage,
  StorageBinary,
  Temperature,
  TemperatureKelvin,
  Time,
  Torque,
  type UnitArray,
  Velocity,
  Voltage,
  Volume,
  VolumeFlowRate,
} from './units.js';

export type HumanizeHelperOptions = Omit<HumanizeUnitOptions, 'units'>;
export type HumanizeHelper = (
  value: number | null | undefined,
  options?: HumanizeHelperOptions,
) => string;

const createHumanizeHelper = (units: UnitArray): HumanizeHelper => (value, options) => humanizeUnit(value, { ...options, units });

export const humanizeCount = createHumanizeHelper(Count);
export const humanizeBytes = createHumanizeHelper(Bytes);
export const humanizeBytesDecimal = createHumanizeHelper(BytesDecimal);
export const humanizeBytesBinary = createHumanizeHelper(BytesBinary);
export const humanizeStorage = createHumanizeHelper(Storage);
export const humanizeStorageBinary = createHumanizeHelper(StorageBinary);
export const humanizeTime = createHumanizeHelper(Time);
export const humanizeDistance = createHumanizeHelper(Distance);
export const humanizeMass = createHumanizeHelper(Mass);
export const humanizeAcceleration = createHumanizeHelper(Acceleration);
export const humanizeCharge = createHumanizeHelper(Charge);
export const humanizeMomentum = createHumanizeHelper(Momentum);
export const humanizePower = createHumanizeHelper(Power);
export const humanizeVelocity = createHumanizeHelper(Velocity);
export const humanizeVolume = createHumanizeHelper(Volume);
export const humanizeLiquidVolume = createHumanizeHelper(LiquidVolume);
export const humanizeTemperature = createHumanizeHelper(Temperature);
export const humanizeTemperatureKelvin = createHumanizeHelper(TemperatureKelvin);
export const humanizePressure = createHumanizeHelper(Pressure);
export const humanizeForce = createHumanizeHelper(Force);
export const humanizeTorque = createHumanizeHelper(Torque);
export const humanizeEnergy = createHumanizeHelper(Energy);
export const humanizeVoltage = createHumanizeHelper(Voltage);
export const humanizeCurrent = createHumanizeHelper(Current);
export const humanizeResistance = createHumanizeHelper(Resistance);
export const humanizeCapacitance = createHumanizeHelper(Capacitance);
export const humanizeInductance = createHumanizeHelper(Inductance);
export const humanizeFrequency = createHumanizeHelper(Frequency);
export const humanizeAngle = createHumanizeHelper(Angle);
export const humanizeLength = createHumanizeHelper(Length);
export const humanizeArea = createHumanizeHelper(Area);
export const humanizeVolumeFlowRate = createHumanizeHelper(VolumeFlowRate);
export const humanizeMassFlowRate = createHumanizeHelper(MassFlowRate);
export const humanizeDensity = createHumanizeHelper(Density);
export const humanizeConcentration = createHumanizeHelper(Concentration);
export const humanizeMolarMass = createHumanizeHelper(MolarMass);
export const humanizeMolarVolume = createHumanizeHelper(MolarVolume);
export const humanizeMolarDensity = createHumanizeHelper(MolarDensity);
export const humanizeMolarConcentration = createHumanizeHelper(MolarConcentration);

