export const FIELD_SAFETY_SOP = `# FIELD SAFETY PROTOCOLS

## Personal Protective Equipment (PPE)
- **Safety glasses:** Protect against cable fray, metal shavings, or spring failure.
- **Cut-resistant gloves:** When handling panels, track, or cable.
- **Steel-toe boots:** Prevent foot injury from dropped sections or tools.
- **Hard hat:** When working beneath suspended loads.

## Spring System Safety
- Treat all torsion and extension springs as **loaded energy systems**.
- Use only proper **cold-rolled steel winding bars** when adjusting torsion springs.
- Never use screwdrivers or improvised tools to wind/unwind springs.
- Fully release spring tension before disassembling any component.

## Door Stabilization
- **CRITICAL:** Clamp locking pliers or C-clamps on left and right side to the vertical tracks, above and below rollers.
- Do this BEFORE:
    1. Releasing spring tension.
    2. Removing bottom brackets.
    3. Adjusting cables or drums.
    (Prevents unintended door travel or free-fall).

## Cable & Bottom Bracket Handling
- Never remove bottom brackets while springs are under tension.
- Inspect lift cables for frays before tensioning.
- Replace damaged cables prior to system reset.
`;

export const SITE_INSPECTION_SOP = `# SITE INSPECTION & MEASUREMENT

## Required Measurements (Inches)
- **Door Width:** Measure total width (typically 8', 9', 16', 18').
- **Door Height:** Bottom retainer to top of door.
- **Opening Width:** Jamb to jamb (ignore perimeter seal).
- **Opening Height:** Concrete to bottom of top jamb (check both sides for arches).
- **Clearance:** Floor to ceiling (or first obstruction).
- **Headroom:** Bottom of top jamb to ceiling.
- **Side Area:** Measure left and right vertical track to side walls.

## Drip Tray Measurements
- **Side Area:** Jamb to side edge of drip tray.
- **Setback:** Edge of jamb to back wall of drip tray.
`;

export const INSTALL_SECTIONAL_SOP = `# INSTALLING STANDARD LIFT SECTIONAL DOORS

## 1. Pick Up & Inspection
Verify all door sections, design, radius, track, springs and hardware are present and free of damage before leaving the warehouse.

## 2. Loading & Strapping
Load door sections flat and secure with straps up front and back. 
**Unloading Order:** Bottom panel first, then intermediates, then top panel on top.

## 3. Clearing Work Space
Clear 7-10 feet of space from the door inside the garage for optimal access.

## 4. The Breakdown (Removal)
Disconnect the operator. **Release spring tension safely.** Remove lift cables, panels, track, and spring line in a controlled sequence.

## 5. Prepping Panels & Hardware
Organize panels in order. Stage hinges and brackets. Prep the springline (Left/Red coned spring, Right/Black). Prep the track (Flag & L brackets).

## 6. Lagging, Stacking & Leveling
- Place bottom panel in opening.
- Lag vertical tracks to framing.
- **Leveling:** Use a 4' level on top of the door. Use shims or a pry bar to raise the low side until level.
- **Plumbing:** Confirm vertical tracks are plumb before tightening flag brackets.
- **Setback:** Ensure exterior face sits flush with jambs (knuckle-width spacing from track).

## 7. Horizontal Track & Backhangs
Install horizontal tracks. Install backhangs from ceiling supports. Raise the rear of the track until level (use 2' level). Don't forget your kicker!

## 8. Springline Mounting
Measure top of panel to center of end bearings. Carry prepped tube up, slide through end bearings, and fasten the spring anchor to the header.

## 9. Setting Cables
1. Set the **LEFT side (Red cone)** drum first.
2. Tighten set screws and pull down on drum.
3. Pin the tube with vice grips against the header.
4. Repeat for the **RIGHT side (Black cone)**.

## 10. Spring Tensioning
Rule of Thumb (4" Drum): 1 full turn per foot of door height.
- 7' Door = 7 full turns (28 quarter turns).
- 8' Door = 8 full turns (32 quarter turns).

## 11. Finalization
- Install perimeter seal (top first, then sides).
- Lubricate hinges, springs, and bearings.
- Program operator limits.
- Clean up area and dispose of old door.
`;

export const OPERATOR_INSTALL_SOP = `# INSTALLING TROLLEY / JACKSHAFT OPERATORS

## 1. Pre-Check & Balance
**NON-NEGOTIABLE:** Disconnect the door and manually cycle it. The door should hold at mid-travel. Never install an operator on an unbalanced door.

## 2. Tearing Down
Unplug the existing unit. Disconnect arm. Remove sensors, wall control, backhangs, and motor head.

## 3. Wiring
Run new low-voltage wiring to both safety sensor locations (4-6" off ground). Run wiring to wall control.
- **LiftMaster Terminals:** 
  - Red/White: Wall Button
  - Black/White: Sensors

## 4. Mounting
- **Trolley:** Fasten mounting bracket above spring anchor. Raise motor head 1.5"-2" above top panel when open. Use scab, drop, and kicker for backhang.
- **Jackshaft:** Install drive coupler onto torsion shaft. Tighten set screws once in position over flag bracket.

## 5. Set Limits & Forces
1. **Upper Limit:** Bottom panel should be flush with top jamb.
2. **Lower Limit:** Door should seal; J-arm should press slightly against top panel.
3. **Safety Reverse:** Test with a 2x4 on the floor.
`;

export const FIELD_RESOURCES_SOP = `# FIELD RESOURCES: TOOLS & COMPONENTS

## Essential Tool Kit
- **Ladders:** 4' and 6' (Must be fiberglass for electrical safety).
- **Measurement:** 35' tape, 300lb scale, spring gauge, levels (4', 2', Torpedo).
- **Hardware Tools:** Impact, drill, magnetic driver bits (1/4", 5/16", 3/8", 7/16", 1/2"), winding bars (1/2" cold-rolled steel).
- **Mechanical Tools:** C-clamps, vice grips, metal files, pry bars, heavy gauge cutters, concrete chisel.
- **PPE:** Gloves, glasses, hearing protection, respirator.

## Standard Lift Components
- **Track System:** Vertical, Radius (12", 15", 20"), Horizontal, Flag brackets.
- **Counterbalance:** Torsion springs, shaft, drums, cables, bearings.
- **Door Hardware:** Hinges (End/Center), Rollers, Bottom/Top brackets, Struts.
- **Support:** Rear hangers, angle iron, kicker.
`;

export const ROLLER_REPLACEMENT_SOP = `# ROLLER REPLACEMENT PROCEDURES

## Method 1: Remove One Vertical Track (Preferred)
*For full sets on steel doors.*
1. Raise door so bottom roller is ABOVE the transition point.
2. Remove fasteners securing ONE vertical track.
3. Guide door down slowly, holding it against the jamb.
4. Replace rollers freely and reinstall track.

## Method 2: Hinge Removal (One at a time)
*For restricted access.*
1. Raise door fully open to release ~99% tension.
2. Clamp track below next roller as a safety stop.
3. Remove hinge/carrier ONE AT A TIME.
4. **WARNING:** verify cable slack before touching bottom brackets.

## Method 3: Track Spread
*Quick field fix; not for wood overlay.*
1. Slightly bend vertical track outward below radius.
2. Pop roller out, replace, and pop back in.
3. Reform track to original alignment.
`;
