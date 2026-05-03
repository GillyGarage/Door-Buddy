export const TUNE_UP_SOP = `# PREVENTATIVE MAINTENANCE SOP

## The 54-Point Inspection
A professional tune-up isn't just about lubrication; it's a diagnostic deep-dive into the door's mechanical soul.

### 1. Safety Hardware
- Check all **Red-Coded fasteners**. These are under high tension and should never be loosened by the customer.
- Verify **Safety Cables** on all extension spring systems.
- Inspect **Photo-Eye** alignment and descent reversal.

### 2. Manual Balance Test
- Disconnect the operator.
- Lift the door halfway. Per **I.D.E.A standards**, it should stay in place or drift slowly.
- A properly balanced door should require only **10 to 15 lbs** of force to operate.

### 3. Track & Roller Health
- Inspect rollers for flattened tires or wobbly bearings.
- Check track spacing (Maintain 1/8" to 1/4" gap).
- **CRITICAL:** Never grease the tracks. Wipe them clean. Rollers need friction to roll, not slide.

### 4. Lubrication Strategy
- Use **dry silicone** or white lithium.
- Target: Roller bearings, hinge pivots, and the top of the spring coils (to prevent spring bind).
`;

export const TROUBLESHOOTING_SPRINGS_SOP = `# TROUBLESHOOTING SPRINGS

## Determining Spring Health
Springs are the 'muscles' of the garage door. When they fail, the 'brain' (operator) suffers.

### Symptom: Heavy Door
If the door is heavy throughout its travel, it usually means:
1. **Insufficient Tension:** Add quarter turns.
2. **Incorrect IPPT:** The spring is too weak for the door weight.
3. **Fatigued Steel:** Springs lose about 5-10% of their strength over 5+ years.

### The 10-15 lb Rule
A perfect door should be liftable with one hand. If a scale shows more than 20 lbs of pull required to lift a closed door manually, your springs are likely undersized or under-tensioned.

### Testing 'Hot' Doors
A door that 'takes off' or won't stay closed is 'Hot'. This is dangerous for operators and children.
- **Cause:** Torsion springs are overwound or have too high an IPPT.
- **Solution:** Reduce tension incrementally. If balance cannot be achieved, the spring must be downsized.
`;

export const DOOR_WEIGHT_SOP = `# DETERMINING DOOR WEIGHT

## Accurate Weight = Accurate Springing
Calculating IPPT (Inch-Pounds Per Turn) requires an exact door weight.

### Method 1: The Analog Scale
- Close the door fully.
- Place a heavy-duty scale under the center of the bottom rail.
- **IMPORTANT:** Ensure the springs are completely unwound (zero tension) to get the true dead weight.

### Method 2: Manufacturer Charts
- Reference the **Garage Up Weight Chart**.
- Model 8000 (7x7) usually weights ~84 lbs.
- Model 9100 (7x7) with Foamcore II weights ~67 lbs.
- Windows add roughly **10-15 lbs** to the total section weight.

### Method 3: Hardware Math
- Steel gauge matters. 24ga vs 26ga changes weight by ~15%.
- Struts add weight. A single 2-inch strut adds roughly **2-4 lbs**.
`;

export const HIGH_LIFT_SOP = `# HIGH LIFT CONVERSION SOP

## The Technical Workflow
Converting a standard radius door to High-Lift requires advanced geometry calculations.

### 1. Measurement (FTC)
- Measure **Floor to Ceiling (FTC)**.
- Example: 14' (168 inches).

### 2. The Golden Deduct
- Always subtract **23 inches** from your FTC to find your description height.
- 168" - 23" = 145" (Description).

### 3. Door Deduct
- Subtract the actual door height (multiplied by 12).
- 12' x 7' door = 84".
- Subtract another 8" (Standard constant) -> 76" (New #).

### 4. The Adder Piece
- Description (145") - New # (76") = **69" Adder Piece**.
- Final High Lift = Adder (69") + 7" = **76" HL**.

### 5. Drum Selection
- High-lift conversions require **tapered drums** (e.g., D400-54 or D525-54).
- Standard flat drums will cause cable overlap and jumping during the vertical-to-horizontal transition.

## 6. Installation Sequence
- **Step A:** Assemble vertical tracks and attach flag brackets.
- **Step B:** Install the "Adder" vertical extension between the flag bracket and the radius curve.
- **Step C:** Mount horizontal tracks. Ensure rear backhangs are extra robust to handle the weight of the segments hanging vertically.
- **Step D:** Mount the spring line at the top of the adder.

## 7. Cable & Drum Calibration
- **Cable Length:** High-lift cables are significantly longer. Calculate: (Door Height + High Lift + 2') x 2.
- **Setting the Drum:** The cable must be seated in the **first groove** of the maximum diameter (tapered section) when the door is closed.
- **Safety Check:** As the door raises, the cable should smoothly transition down the taper to the flat portion of the drum as the door weight moves from vertical to horizontal.

## 8. Balancing & Troubleshooting
- **Transition Jolt:** If the door "jumps" during transition, check if the tracks are perfectly parallel. Even 1/16" off-parallel will cause binding.
- **Header Torque:** High-lift systems place 3x more pulling force on the header. Use 3" lags and ensure the anchor plate is into a solid structural member.
- **Top Roller Adjustment:** The top fixture must be set as low as possible to ensure the door stays tight against the jamb through the extended vertical rise.
`;

export const COUNTERBALANCE_SYSTEMS_SOP = `# COUNTERBALANCE SYSTEMS

## Torsion vs. Extension
Understanding the physics of the two primary lifting systems.

### Torsion Systems
- **Mechanics:** Springs are mounted on a shaft above the header. They twist (torsion) to provide torque.
- **Safety:** More contained. If a spring breaks, it stays on the shaft.
- **Lifespan:** Standard is 10,000 cycles. High-cycle can reach 100,000.
- **Winding Cones:** Different diameter specs exist for winding cones (where the winding rod inserts). Residential systems are predominantly 1/2" diameter.

### Extension Systems
- **Mechanics:** Springs stretch along the horizontal tracks.
- **Safety:** High risk. A breaking extension spring becomes a projectile. **Safety cables are MANDATORY.**
- **Color Coding:** DASMA standardized codes (e.g., Gold = 80 lbs, Green = 120 lbs).

### Determining 'Hand'
- **Right Hand Wound (Red Cone):** Usually installs on the LEFT side (looking out).
- **Left Hand Wound (Black Cone):** Usually installs on the RIGHT side (looking out).
`;

export const TRACK_ROLLER_GEOMETRY_SOP = `# TRACK & ROLLER GEOMETRY

## Perfecting the Path
The door's travel path is determined by track alignment and radius selection.

### 1. The 1/8" Slope
Vertical tracks must be sloped away from the jamb. Standard graduation is **1/8" per foot**. This pulls the door away from the weatherstrip during the lift, reducing friction and noise.

### 2. Radius Realities
- **12" Radius:** Standard for tight spaces. Faster transition.
- **15" Radius:** Smoother operation, requires more headroom.
- **Low Headroom:** Uses double tracks to minimize the high-arc of the top section.

### 3. Horizontal Pitch
Horizontal tracks should be pitched slightly higher at the rear (approx. **1/2" to 1"**). This uses gravity to keep the door in the open position and prevents it from 'drifting' closed.
`;

export const EXTREME_TENSION_SAFETY_SOP = `# EXTREME TENSION SAFETY

## Zero-Risk Procedures
High-tension springs store enough kinetic energy to be fatal. Respect the steel.

### 1. The Cone of Fire
Never stand directly in front of a winding cone. Always position your body to the side of the spring line. If a winding bar slips, its path of travel is a vertical arc—don't be in it.

### 2. Winding Bar Integrity
- Use only **1/2" OD cold-rolled steel** bars. 
- Never use screwdrivers, rebar, or pipe. 
- Ensure the bar is fully seated at the bottom of the winding hole before applying force. Note that while 1/2" is the residential standard, different diameter specs exist for winding cones; always verify the fit before applying torque.

### 3. Red Hardware Rule
ANSI/DASMA 103 requires all hardware under tension to be marked with **Red Color** or be tamper-resistant. If it's red, don't touch it without proper training and winding bars.

### 4. The 2-Bar System
Always have the second winding bar in place before removing the first. Never leave a spring with only one bar inserted unless it is locked to the shaft.
`;

export const ROLLING_STEEL_SOP = `# ROLLING STEEL SYSTEMS (DBCI 650DB)

## Installation Guide
Rolling doors operate on a curtain coil system rather than individual sections.

### 1. Pre-Installation
- **IMPORTANT:** Do not cut the tape or plastic wrap holding the curtain coil until you have set the initial spring tension.
- Door must be fully opened when making any mechanical adjustments.

### 2. Clearance Specs
- **Sideroom:** 3.5 inches required on both the tensioner and drive ends for standard push-up operation.
- **Headroom:** Requires between 15.5" and 17" of vertical headroom depending on door height.

### 3. Initial Spring Tension
- Before cutting the wrap, rotate the door precisely **two (2) revolutions** in the direction that would send the bottom bar down the guides.
- This serves as the baseline tension required for safe operation.

### 4. Safety & Labels
- Visual inspection of labels is mandatory:
    - **RDD-201:** Tension bracket.
    - **RDD-204:** Bottom bar.
    - **RDD-202:** Drive side guide or jamb.

### 5. Manual Limits
- Hand chain operation should never exceed **35 lbs** of force.
- Manual push-up operation should not exceed **30 lbs**.
`;

