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
  lma: number;
  maxWeight: number;
  maxHeight: number;
  multiplier?: number;
  isHighLift?: boolean;
  isVerticalLift?: boolean;
  constant?: number;
}

export const DRUMS: Record<string, DrumSpecs> = {
  '400-8 (Std)': { name: '400-8 (Std)', hma: 2.0, lma: 2.0, maxWeight: 530, maxHeight: 97, multiplier: 0.2886 },
  '400-12': { name: '400-12', hma: 2.0, lma: 2.0, maxWeight: 375, maxHeight: 145, multiplier: 0.2500 },
  '525-18 (Lrg)': { name: '525-18 (Lrg)', hma: 2.625, lma: 2.625, maxWeight: 1000, maxHeight: 217, multiplier: 0.1800 },
  '400-54 (HL)': { name: '400-54 (HL)', hma: 3.21, lma: 2.063, maxWeight: 550, maxHeight: 113, isHighLift: true, constant: 63 },
  '525-54 (HL)': { name: '525-54 (HL)', hma: 3.85, lma: 2.625, maxWeight: 1000, maxHeight: 125, isHighLift: true },
  '850-11 (VL)': { name: '850-11 (VL)', hma: 4.16, lma: 1.34, maxWeight: 850, maxHeight: 132, isVerticalLift: true, constant: 144 },
  '1100-216 (VL)': { name: '1100-216 (VL)', hma: 5.44, lma: 1.34, maxWeight: 1320, maxHeight: 216, isVerticalLift: true },
};

// Simplified Multiplier lookup table for common residentials (D400-96, D400-123)
// Map: [Drum][HeightInInches][Radius] -> { multi, turns }
export const MULTIPLIERS: Record<string, Record<number, Record<string, { multi: number, turns: number }>>> = {
  'D400-96': {
    84: { // 7ft
      '12': { multi: 0.2980, turns: 7.6 },
      '15': { multi: 0.2866, turns: 7.9 },
      'LHR': { multi: 0.3170, turns: 7.2 }
    },
    96: { // 8ft
      '12': { multi: 0.2666, turns: 8.5 },
      '15': { multi: 0.2579, turns: 8.8 },
      'LHR': { multi: 0.2811, turns: 8.1 }
    }
  },
  'D400-123': {
    84: { // 7ft
      '12': { multi: 0.3026, turns: 7.6 },
      '15': { multi: 0.2910, turns: 7.9 },
      'LHR': { multi: 0.3218, turns: 7.1 }
    },
    96: { // 8ft
      '12': { multi: 0.2706, turns: 8.5 },
      '15': { multi: 0.2618, turns: 8.8 },
      'LHR': { multi: 0.2854, turns: 8.0 }
    }
  },
  'D400-144': {
    84: { // 7ft
      '12': { multi: 0.3026, turns: 7.6 },
      '15': { multi: 0.2910, turns: 7.9 },
      'LHR': { multi: 0.3218, turns: 7.1 }
    },
    96: { // 8ft
      '12': { multi: 0.2706, turns: 8.5 },
      '15': { multi: 0.2618, turns: 8.8 },
      'LHR': { multi: 0.2854, turns: 8.0 }
    }
  },
  'D525-216': {
    84: { // 7ft
      '12': { multi: 0.5050, turns: 5.8 },
      '15': { multi: 0.4852, turns: 6.1 },
      'LHR': { multi: 0.5379, turns: 5.5 }
    },
    96: { // 8ft
      '12': { multi: 0.4519, turns: 6.5 },
      '15': { multi: 0.4368, turns: 6.7 },
      'LHR': { multi: 0.4771, turns: 6.2 }
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
  let turns = doorHeight + 0.5; // Default safety turns
  let ftrAdjustment = 0;

  if (liftSystem === 'vertical-lift' || drum.isVerticalLift) {
    // VL Logic: Required IPPT = (Weight * HMA) / Total Turns
    ippt = (doorWeight * drum.hma) / turns;
  } else if (liftSystem === 'high-lift' || drum.isHighLift) {
    // HL Logic: IPPT = (Weight * HMA) / Total Turns
    ippt = (doorWeight * drum.hma) / turns;
  } else {
    // Standard/Low-Headroom
    const multi = drum.multiplier || (drum.hma * 0.1443);
    ippt = doorWeight * multi;

    // FTR Logic Adjustment
    if (input.pitch && input.pitch > 0) {
      const angleRad = Math.atan(input.pitch / 12);
      const residualTorqueFactor = Math.sin(angleRad);
      ftrAdjustment = doorWeight * residualTorqueFactor * (drum.hma / 2.0);
      // In FTR, the door doesn't unload fully, so we often increase IPPT to keep balance or adjust wraps
      // Implementing a 15% IPPT bias for FTR as a starting point if pitch > 0
      ippt = ippt * (1 + (residualTorqueFactor * 0.5));
    }
  }

  const torque = ippt * turns;

  let cycleLife = 10000;
  let springGrowth = 0;

  if (specs?.wireSize) {
    springGrowth = turns * specs.wireSize;
    const mips = MIP_TABLE[specs.wireSize as keyof typeof MIP_TABLE];
    if (mips) {
      const cycleCounts = Object.keys(mips).map(Number).sort((a, b) => b - a);
      for (const count of cycleCounts) {
        if (mips[count] >= (torque / (specs.innerDiameter || 2.0))) {
          cycleLife = count;
          break;
        }
      }
    }
  }

  // Cable Length Calculation
  let cableLength = 0;
  if (drum.constant) {
    cableLength = (doorHeight * 12 + 6) + drum.constant; 
  }

  return {
    ippt,
    turns,
    torque,
    cycleLife,
    springRate: ippt,
    cableLength,
    springGrowth,
    ftrAdjustment
  };
}

/**
 * Suggest optimal springs based on target IPPT per spring and target cycles.
 */
export function findBestSpringForCycles(targetIppt: number, targetCycles: number, targetTorque: number, turns: number): any | null {
  let bestMatch: any = null;
  
  // Iterate all known springs to find one that supports the torque and hits the cycle target
  for (const wire of Object.keys(MIP_TABLE).map(Number)) {
    const mips = MIP_TABLE[wire];
    const torqueCapacity = mips[targetCycles] || mips[targetCycles === 20000 ? 25000 : targetCycles];
    if (!torqueCapacity || torqueCapacity < targetTorque) continue;

    for (const id of [1.75, 2.0, 2.625, 3.375, 3.75, 5.25, 6.0]) {
      const dividerData = SPRING_DATA[wire]?.[id];
      if (!dividerData) continue;

      const length = dividerData.divider / targetIppt;
      
      // Heuristic for "best": usually 2" ID is preferred, otherwise shortest/lightest
      const score = (id === 2.0 ? 0 : 100) + length;
      
      if (!bestMatch || score < bestMatch.score) {
        bestMatch = {
          wire,
          id,
          length: length.toFixed(2),
          weight: (length * dividerData.weightPerInch).toFixed(2),
          ippt: targetIppt,
          cycles: targetCycles,
          score,
          growth: (turns * wire).toFixed(2)
        };
      }
    }
  }
  return bestMatch;
}

/**
 * Spring Conversion Logic
 * Keeps IPPT constant while changing ID or Wire
 */
export function convertSpring(targetIppt: number, newId: number, oldWire: number): number {
  // Simplified conversion factor
  // Ratio of IDs affects the required wire size
  return oldWire * Math.pow(newId / 2.0, 0.25);
}

export const WIRE_DIAMETERS = [
  0.187, 0.192, 0.207, 0.218, 0.225, 0.234, 0.243, 0.250, 0.262, 0.273, 0.289, 0.295, 0.306, 0.312, 0.375
];

export const INNER_DIAMETERS = [
  1.75, 2.0, 2.625, 3.75, 6.0
];
