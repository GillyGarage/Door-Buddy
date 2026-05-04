/**
 * Engineering formulas for Torsion and Extension Springs
 * Enhanced with Cycle Life and Conversion Logic
 */

export interface CalculationInput {
  doorWidth: number;
  doorHeight: number;
  doorWeight: number;
  liftSystem: 'standard' | 'low-headroom' | 'high-lift' | 'vertical-lift' | 'extension';
  highLiftInches?: number;
  drumType: string;
  trackRadius?: string; // '10', '12', '15', 'LHR'
  pitch?: number; // Pitch in inches per foot (e.g., 2 for 2/12)
}

export interface DrumSpecs {
  name: string;
  hma: number;
  lma?: number;
  maxWeight: number;
  maxHeight: number;
  multiplier: number;
  isHighLift?: boolean;
  isVerticalLift?: boolean;
  constant?: number;
  crossRef?: string;
}

export const DRUMS: Record<string, DrumSpecs> = {
  '400-8 (Std)': { 
    name: '400-8 (Std)', 
    hma: 2.125, 
    maxWeight: 265, 
    maxHeight: 97, 
    multiplier: 0.301,
    constant: 8,
    crossRef: 'Canimex D400-96'
  },
  '400-12': { 
    name: '400-12', 
    hma: 2.125, 
    maxWeight: 265, 
    maxHeight: 145, 
    multiplier: 0.301,
    constant: 8,
    crossRef: 'Canimex D400-144'
  },
  '525-18 (Lrg)': { 
    name: '525-18 (Lrg)', 
    hma: 2.75, 
    maxWeight: 750, 
    maxHeight: 217, 
    multiplier: 0.395,
    constant: 10,
    crossRef: 'Canimex D525-216'
  },
  '800-32': {
    name: '800-32',
    hma: 4.0,
    maxWeight: 1000, 
    maxHeight: 384,
    multiplier: 0.598,
    crossRef: 'Canimex D800-384'
  },
  '400-54 (HL)': { 
    name: '400-54 (HL)', 
    hma: 3.21, 
    maxWeight: 275, 
    maxHeight: 113, 
    multiplier: 0.334,
    isHighLift: true, 
    constant: 63,
    crossRef: 'Canimex D400-54HL'
  },
  '525-54 (HL)': { 
    name: '525-54 (HL)', 
    hma: 3.85, 
    maxWeight: 1000, 
    maxHeight: 125, 
    multiplier: 0.412,
    isHighLift: true,
    crossRef: 'Canimex D525-54'
  },
  'VL-11': { 
    name: 'VL-11', 
    hma: 4.16, 
    maxWeight: 850, 
    maxHeight: 132, 
    multiplier: 1.750,
    isVerticalLift: true, 
    constant: 144,
    crossRef: 'Apco 850-11'
  },
  'VL-18': { 
    name: 'VL-18', 
    hma: 5.44, 
    maxWeight: 1320, 
    maxHeight: 216, 
    multiplier: 1.750,
    isVerticalLift: true,
    crossRef: 'Apco 1100-18'
  },
};

// Simplified Multiplier lookup table for common residentials (D400-96, D400-123)
// Map: [Drum][HeightInInches][Radius] -> { multi, turns }
export const MULTIPLIERS: Record<string, Record<number, Record<string, { multi: number, turns: number }>>> = {
  'D400-96': {
    84: { // 7ft
      '12': { multi: 0.254, turns: 7.75 },
      '15': { multi: 0.244, turns: 8.25 },
      'LHR': { multi: 0.270, turns: 7.25 }
    },
    96: { // 8ft
      '12': { multi: 0.228, turns: 8.75 },
      '15': { multi: 0.220, turns: 9.00 },
      'LHR': { multi: 0.245, turns: 8.25 }
    }
  },
  'D400-123': {
    84: { // 7ft
      '12': { multi: 0.254, turns: 7.75 },
      '15': { multi: 0.244, turns: 8.25 },
      'LHR': { multi: 0.270, turns: 7.25 }
    },
    96: { // 8ft
      '12': { multi: 0.228, turns: 8.75 },
      '15': { multi: 0.220, turns: 9.00 },
      'LHR': { multi: 0.245, turns: 8.25 }
    }
  },
  'D400-144': {
    84: { // 7ft
      '12': { multi: 0.254, turns: 7.75 },
      '15': { multi: 0.244, turns: 8.25 },
      'LHR': { multi: 0.270, turns: 7.25 }
    },
    96: { // 8ft
      '12': { multi: 0.228, turns: 8.75 },
      '15': { multi: 0.220, turns: 9.00 },
      'LHR': { multi: 0.245, turns: 8.25 }
    }
  },
  'D525-216': {
    84: { // 7ft
      '12': { multi: 0.3550, turns: 5.8 },
      '15': { multi: 0.3452, turns: 6.1 },
      'LHR': { multi: 0.3779, turns: 5.5 }
    },
    96: { // 8ft
      '12': { multi: 0.3519, turns: 6.5 },
      '15': { multi: 0.3468, turns: 6.7 },
      'LHR': { multi: 0.3671, turns: 6.2 }
    }
  }
};

// MIP Table for cycle estimation
// Wire -> { cycles: torque }
export const MIP_TABLE: Record<number, Record<number, number>> = {
  0.1920: { 10000: 172, 15000: 159, 25000: 143, 50000: 123, 100000: 106 },
  0.2070: { 10000: 212, 15000: 196, 25000: 177, 50000: 152, 100000: 131 },
  0.2187: { 10000: 247, 15000: 229, 25000: 206, 50000: 177, 100000: 153 },
  0.2253: { 10000: 268, 15000: 249, 25000: 224, 50000: 193, 100000: 166 },
  0.2344: { 10000: 298, 15000: 276, 25000: 249, 50000: 214, 100000: 184 },
  0.2437: { 10000: 337, 15000: 309, 25000: 279, 50000: 240, 100000: 206 },
  0.2500: { 10000: 358, 15000: 332, 25000: 300, 50000: 257, 100000: 222 },
  0.2625: { 10000: 411, 15000: 381, 25000: 343, 50000: 295, 100000: 254 },
  0.2730: { 10000: 458, 15000: 425, 25000: 383, 50000: 329, 100000: 283 },
  0.3125: { 10000: 668, 15000: 619, 25000: 559, 50000: 480, 100000: 413 },
};

export const WIRE_COLORS: Record<number, string> = {
  0.1920: '#F59E0B', // Orange
  0.2070: '#FDE047', // Yellow
  0.2187: '#FFFFFF', // White
  0.2253: '#EF4444', // Red
  0.2344: '#78350F', // Brown
  0.2437: '#22C55E', // Green
  0.2500: '#EAB308', // Gold
  0.2625: '#3B82F6', // Blue
  0.2730: '#1D4ED8', // Dark Blue
  0.2890: '#60A5FA', // Light Blue
  0.3125: '#F1F5F9', // Gray/White
};

// Expanded SPRING_DATA
export const SPRING_DATA: Record<number, Record<number, { divider: number, weightPerInch: number }>> = {
  0.1920: {
    1.75: { divider: 395.9, weightPerInch: 0.260 },
    2.0: { divider: 350.8, weightPerInch: 0.294 }
  },
  0.2070: {
    1.75: { divider: 572.3, weightPerInch: 0.283 },
    2.0: { divider: 507.5, weightPerInch: 0.319 }
  },
  0.2187: {
    2.0: { divider: 664.5, weightPerInch: 0.339 },
    2.625: { divider: 542.3, weightPerInch: 0.434 }
  },
  0.2253: {
    2.0: { divider: 768.8, weightPerInch: 0.350 },
    2.625: { divider: 600.2, weightPerInch: 0.448 }
  },
  0.2344: {
    2.0: { divider: 933.3, weightPerInch: 0.366 },
    2.625: { divider: 729.3, weightPerInch: 0.468 }
  },
  0.2437: {
    2.0: { divider: 1129.0, weightPerInch: 0.382 },
    2.625: { divider: 883.0, weightPerInch: 0.488 }
  },
  0.2500: {
    2.0: { divider: 1279.1, weightPerInch: 0.393 },
    2.625: { divider: 1001.0, weightPerInch: 0.502 },
    3.375: { divider: 793.9, weightPerInch: 0.633 },
    3.75: { divider: 719.5, weightPerInch: 0.698 }
  },
  0.2625: {
    2.0: { divider: 1623.4, weightPerInch: 0.415 },
    2.625: { divider: 1272.0, weightPerInch: 0.529 },
    3.75: { divider: 915.4, weightPerInch: 0.735 }
  },
  0.2730: {
    2.0: { divider: 1966.0, weightPerInch: 0.433 },
    2.625: { divider: 1542.0, weightPerInch: 0.552 },
    3.75: { divider: 1110.8, weightPerInch: 0.767 }
  },
  0.3125: {
    2.625: { divider: 2381.7, weightPerInch: 0.641 },
    3.75: { divider: 1825.0, weightPerInch: 0.886 }
  }
};

export interface SpringSpecs {
  wireSize: number;
  innerDiameter: number;
  length: number;
  ippt: number;
}

export interface SpringResult {
  ippt: number;
  turns: number;
  torque: number;
  cycleLife: number;
  springRate: number;
  colorCode?: string;
  weightCapacity?: number;
  cableLength?: number;
  springGrowth?: number;
  ftrAdjustment?: number;
  bendingStress?: number;
  maxStress?: number;
  maxTurns?: number;
}

/**
 * Calculates physical IPPT based on helical torsion spring formula:
 * IPPT = (E * d^4) / (10.8 * D * Na)
 */
export function calculatePhysicalIppt(wire: number, id: number, length: number): number {
  const E = 28500000; // Industry standard for Oil Tempered Spring Wire
  const D = id + wire; // Mean Diameter
  const Na = length / wire; // Active Coils
  if (Na <= 0) return 0;
  // SSC/DASMA Helical Formula
  return (E * Math.pow(wire, 4)) / (10.8 * D * Na);
}

/**
 * Calculates bending stress to ensure it's within elastic limits.
 * Sigma = K * (32 * Torque / (pi * d^3))
 */
export function calculateBendingStress(torque: number, wire: number): number {
  const K = 1.0; // Stress correction factor
  return (K * 32 * torque) / (Math.PI * Math.pow(wire, 3));
}

/**
 * Calculates maximum safe turns before exceeding elastic limit.
 */
export function calculateMaxTurns(ippt: number, wire: number, maxStress: number): number {
  // torque = (maxStress * pi * d^3) / 32
  const maxTorque = (maxStress * Math.PI * Math.pow(wire, 3)) / 32;
  return maxTorque / ippt;
}

const EXTENSION_SPRING_CHART = [
  { capacity: 70, color: 'Raw/Tan' },
  { capacity: 80, color: 'Gold' },
  { capacity: 90, color: 'Light Blue' },
  { capacity: 100, color: 'Brown' },
  { capacity: 110, color: 'Orange' },
  { capacity: 120, color: 'Light Green' },
  { capacity: 130, color: 'White' },
  { capacity: 140, color: 'Dark Blue' },
  { capacity: 150, color: 'Red' },
  { capacity: 160, color: 'Black' },
  { capacity: 170, color: 'Dark Green' },
  { capacity: 180, color: 'Yellow' },
  { capacity: 190, color: 'Light Blue' },
];

export function calculateTorsionSprings(input: CalculationInput, specs?: Partial<SpringSpecs>): SpringResult {
  const { doorHeight, doorWeight, liftSystem, drumType } = input;
  const drum = DRUMS[drumType] || DRUMS['400-8 (Std)'];
  
  if (liftSystem === 'extension') {
    const bestFit = EXTENSION_SPRING_CHART.reduce((prev, curr) => 
      Math.abs(curr.capacity - doorWeight) < Math.abs(prev.capacity - doorWeight) ? curr : prev
    );

    return {
      ippt: 0,
      turns: 0,
      torque: 0,
      cycleLife: 10000,
      springRate: doorWeight / (doorHeight * 12),
      colorCode: bestFit.color,
      weightCapacity: bestFit.capacity
    };
  }

  // Engineering Formula Base
  let ippt = 0;
  let turns = doorHeight + 0.75; // Baseline
  let ftrAdjustment = 0;
  let momentArm = drum.multiplier * 7.5;

  // Multiplier Table Integration (Audited logic for Standard Lift)
  if (liftSystem === 'standard' || liftSystem === 'low-headroom') {
    const heightKey = doorHeight === 7 ? 84 : (doorHeight === 8 ? 96 : 84);
    const drumKey = drum.crossRef || 'D400-96';
    const radiusKey = input.trackRadius || '12';
    
    const tableData = MULTIPLIERS[drumKey]?.[heightKey]?.[radiusKey];
    if (tableData) {
      momentArm = tableData.multi * tableData.turns;
      turns = tableData.turns;
    }
  }

  // IPPT = (Weight * momentArm) / Turns
  ippt = (doorWeight * momentArm) / turns;

  if (liftSystem === 'standard' || liftSystem === 'low-headroom') {
    // FTR Logic Adjustment
    if (input.pitch && input.pitch > 0) {
      const angleRad = Math.atan(input.pitch / 12);
      const sinTheta = Math.sin(angleRad);
      
      // Residual Torque = Weight * sin(theta) * Drum Radius
      ftrAdjustment = doorWeight * sinTheta * (drum.hma / 2.0);
      
      // Implementing FTR bias: Doors on slopes require continuous tension
      ippt = ippt * (1 + (sinTheta * 0.5));
    }
  }

  const torque = ippt * turns;
  const bendingStress = specs?.wireSize ? calculateBendingStress(torque, specs.wireSize) : undefined;
  // Standard elastic limit for OC wire is around 200,000 - 240,000 psi
  const maxStress = 210000; 
  const maxTurns = (specs?.wireSize && ippt > 0) ? calculateMaxTurns(ippt, specs.wireSize, maxStress) : undefined;

  let cycleLife = 10000;
  let springGrowth = 0;

  if (specs?.wireSize) {
    springGrowth = turns * specs.wireSize;
    // Continuous power-law calculation for better accuracy
    cycleLife = estimateCyclesByStress(specs.wireSize, torque);
  }

  // Cable Length Calculation
  let cableLength = 0;
  if (drum.constant) {
    cableLength = (doorHeight * 12) + drum.constant; 
  } else {
    // User requested formula: Height + 7" for standard
    cableLength = (doorHeight * 12) + 7;
  }

  return {
    ippt,
    turns,
    torque,
    cycleLife,
    springRate: ippt,
    cableLength,
    springGrowth,
    ftrAdjustment,
    bendingStress,
    maxStress,
    maxTurns
  };
}

export const STOCK_SPRINGS = [
  { wire: 0.2070, id: 2.0, length: 21 },
  { wire: 0.2070, id: 2.0, length: 22.5 },
  { wire: 0.2070, id: 2.0, length: 28 },
  { wire: 0.2187, id: 2.0, length: 24.75 },
  { wire: 0.2187, id: 2.0, length: 26 },
  { wire: 0.2253, id: 2.0, length: 24.5 },
  { wire: 0.2344, id: 2.0, length: 27.25 },
  { wire: 0.2437, id: 2.0, length: 28.25 },
  { wire: 0.2500, id: 2.0, length: 30 },
];

/**
 * Helper to get torque capacity for a given cycle count from MIP table.
 * If targetCycles is between defined points, it returns the capacity for the NEXT HIGHER count
 * (which is safer/conservative).
 */
function getTorqueCapacity(mips: Record<number, number> | undefined, targetCycles: number): number {
  if (!mips) return 0;
  if (mips[targetCycles]) return mips[targetCycles];

  const sortedCycles = Object.keys(mips).map(Number).sort((a, b) => a - b);
  // Find the first cycle limit that is >= targetCycles
  const nextTarget = sortedCycles.find(c => c >= targetCycles);
  if (nextTarget) return mips[nextTarget];

  // If we exceed the highest defined cycle (e.g. 100k+), return the lowest capacity
  return mips[sortedCycles[sortedCycles.length - 1]];
}

/**
 * Suggest multiple upcycle options matching the target IPPT but increasing longevity.
 */
export function getUpcycleOptions(targetIppt: number, targetTorque: number, turns: number): any[] {
  const options: any[] = [];
  const standard_wires = [0.187, 0.192, 0.207, 0.218, 0.225, 0.234, 0.243, 0.250, 0.262, 0.273, 0.283, 0.289, 0.295, 0.306, 0.312, 0.375];
  const E = 30000000;
  const targetIds = [2.0, 2.625, 3.375, 3.75, 6.0];

  for (const wire of standard_wires) {
    const mips = MIP_TABLE[wire as keyof typeof MIP_TABLE];
    if (!mips) continue;

    for (const id of targetIds) {
      const D = id + wire;
      const Na = (E * Math.pow(wire, 4)) / (10.8 * D * targetIppt);
      const length = Na * wire;
      
      const currentTorqueAtSurface = targetTorque / id;
      
      // Calculate cycle life based on bending stress
      const maxCyclesFound = estimateCyclesByStress(wire, targetTorque);

      if (length > 8 && length < 100 && maxCyclesFound >= 10000) {
        options.push({
          wire,
          id,
          length: length.toFixed(2),
          weight: (length * (SPRING_DATA[wire as keyof typeof SPRING_DATA]?.[id]?.weightPerInch || 0.4)).toFixed(2),
          ippt: targetIppt,
          cycles: maxCyclesFound,
          growth: (turns * wire).toFixed(2)
        });
      }
    }
  }

  // Sort by cycles to give a progression
  return options.sort((a, b) => a.cycles - b.cycles);
}

/**
 * Calculates cycles based on bending stress for Oil-Tempered Wire
 * Standard fatigue life curve mapping
 */
export function estimateCyclesByStress(wire: number, torque: number): number {
  if (wire <= 0 || torque <= 0) return 0;
  
  // Bending Stress: (32 * Torque) / (pi * d^3)
  const stress = (32 * torque) / (Math.PI * Math.pow(wire, 3));
  
  // Continuous power-law fatigue calculation
  // Baseline: 10,000 cycles at ~212,000 psi stress
  // Exponent 4.8 provides audited ~21,800 cycles at typical residential stress levels (~180k psi)
  const baselineStress = 212000; 
  const cycles = 10000 * Math.pow(baselineStress / stress, 4.8);
  
  // Cap for safety/realism
  return Math.max(5000, Math.min(100000, Math.round(cycles)));
}

/**
 * Suggest optimal springs based on target IPPT per spring and target cycles.
 */
export function findBestSpringForCycles(targetIppt: number, targetCycles: number, targetTorque: number, turns: number): any | null {
  const all = getUpcycleOptions(targetIppt, targetTorque, turns);
  
  // Find highest cycles that doesn't exceed targetCycles too much, or best fit
  let best = null;
  for (const opt of all) {
    if (opt.cycles >= targetCycles) {
      if (!best || opt.cycles < best.cycles || (opt.cycles === best.cycles && opt.id === 2.0)) {
        best = opt;
      }
    }
  }
  return best;
}

/**
 * Spring Conversion Logic
 * Locked Target IPPT Method:
 * New Length = (E * d_new^4) / (10.8 * D_new * IPPT_target) * d_new
 */
export function convertSpring(targetIppt: number, newWire: number, newId: number): number {
  const E = 28500000;
  const D_new = newId + newWire;
  
  // Algebraically derived from IPPT = (E*d^4)/(10.8*D*(L/d))
  // IPPT = (E*d^5)/(10.8*D*L) -> L = (E*d^5)/(10.8*D*IPPT)
  const length = (E * Math.pow(newWire, 5)) / (10.8 * D_new * targetIppt);
  return length;
}

export const WIRE_DIAMETERS = [
  0.187, 0.192, 0.207, 0.218, 0.225, 0.234, 0.243, 0.250, 0.262, 0.273, 0.289, 0.295, 0.306, 0.312, 0.375
];

export const INNER_DIAMETERS = [
  1.75, 2.0, 2.625, 3.375, 3.75, 6.0
];

export interface UnifiedSpringMetrics {
  wire: number;
  id: number;
  length: number;
  count: number;
  ippt: number;
  totalIppt: number;
  maxTurns: number;
  activeCoils: number;
  totalCoils: number;
  weight: number;
  cycles: number;
}

export function calculateSpringMetrics(wire: number, id: number, length: number, count: number): UnifiedSpringMetrics {
  const E = 28500000;
  const D = id + wire;
  const Na = length / wire;
  const Nt = Na + 2;
  const ippt = (E * Math.pow(wire, 4)) / (10.8 * D * Na);
  
  const maxStress = 210000;
  const maxTorque = (maxStress * Math.PI * Math.pow(wire, 3)) / 32;
  const maxTurns = maxTorque / ippt;
  
  // Estimate weight
  const data = SPRING_DATA[wire]?.[id];
  const weight = data ? length * data.weightPerInch : 0;
  
  // Estimate cycles using standard power-law
  const targetTorque = ippt * 7.8; // Normalized turns for cycle estimation
  const cycles = estimateCyclesByStress(wire, targetTorque);

  return {
    wire, id, length, count,
    ippt,
    totalIppt: ippt * count,
    maxTurns,
    activeCoils: Na,
    totalCoils: Nt,
    weight,
    cycles
  };
}
