export const SPRING_ENGINEERING_DATA = {
  drumMultipliers: [
    { model: "400-8 (Standard)", multiplier: 0.2886, diameter: "4.0\"", maxLift: "8'1\"", liftPerTurn: "12.6\"" },
    { model: "400-12", multiplier: 0.2500, diameter: "4.0\"", maxLift: "12'1\"", liftPerTurn: "13\"" },
    { model: "525-18 (Large)", multiplier: 0.1800, diameter: "5.25\"", maxLift: "18'1\"", liftPerTurn: "17\"" }
  ],
  highLiftDrums: [
    { model: "400-54", flatRadius: 2.063, maxHighLift: "54\"", capacity: "550 lbs", hma: 3.21 },
    { model: "525-54", flatRadius: 2.625, maxHighLift: "54\"", capacity: "1,000 lbs", hma: 3.85 },
    { model: "575-120", flatRadius: 2.875, maxHighLift: "120\"", capacity: "1,000 lbs", hma: 4.12 },
    { model: "6375-164", flatRadius: 3.187, maxHighLift: "164\"", capacity: "1,600 lbs", hma: 4.54 }
  ],
  standardTurns: [
    { height: "7'", turns: 7.5, quarterTurns: 30 },
    { height: "7'6\"", turns: 7.75, quarterTurns: 31 },
    { height: "8'", turns: 8.5, quarterTurns: 34 }
  ],
  wireSizingHack: [
    { measurement20Coil: "5.00\"", wireSize: ".250" },
    { measurement20Coil: "5.25\"", wireSize: ".262" },
    { measurement20Coil: "4.25\"", wireSize: ".218" }
  ],
  formulas: {
    requiredIppt: "Door Weight * Drum Multiplier",
    highLiftIppt: "(Door Weight * HMA) / Total Turns",
    targetIpptFromScales: "(Door Weight * Drum Radius) / Total Turns",
    springGrowth: "Turns * Wire Diameter",
    ipptScaling: "IPPT_new = IPPT_old * (Length_old / Length_new)",
    verticalLiftIppt: "(Door Weight * HMA) / Total Turns",
    verticalLiftCable: "(Floor to Shaft) + (Drum Constant) - (Door Height)",
    helicalRate: "(E * d^4) / (10.8 * D * Na)",
    ftrResidualTorque: "Weight * sin(theta) * Drum Radius"
  },
  ftrLogic: {
    description: "Follow the Roof / Sloped Track systems require sustained tension.",
    angleVariables: [
      { pitch: "1/12", angle: "4.76°", sin: 0.083 },
      { pitch: "2/12", angle: "9.46°", sin: 0.164 },
      { pitch: "3/12", angle: "14.04°", sin: 0.243 }
    ]
  },
  verticalLiftDrums: [
    { model: "850-11", lma: 1.34, hma: 4.16, maxLift: "11'0\"", capacity: "850 lbs", constant: 144 },
    { model: "850-132", lma: 1.34, hma: 4.31, maxLift: "11'0\"", capacity: "850 lbs" },
    { model: "1100-216", lma: 1.34, hma: 5.44, maxLift: "18'0\"", capacity: "1,320 lbs" },
    { model: "1350-336", lma: 1.34, hma: 6.75, maxLift: "28'0\"", capacity: "2,200 lbs" }
  ],
  materialConstants: {
    youngsModulus: "28.5M - 30.0M psi (ASTM A229 Steel)",
    maxWeightStandardDrums: "265 lbs per drum / 530 lbs total"
  }
};
