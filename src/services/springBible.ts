export const SPRING_BIBLE_SOP = `# GARAGE DOOR SPRING BIBLE

## 1. Identification (The 10/20 Rule)
- **Measuring Wire Diameter:** Since human error with calipers is high, use the coil count method.
- **20-Coil Measurement:** Measure 20 coils with a tape measure. Divide the total by 20.
    - 5.00" = .250 wire
    - 5.25" = .262 wire
    - 4.25" = .218 wire
- **10-Coil Measurement:** Faster but slightly less precise. 
    - 2.50" = .250 wire
    - 3.12" = .312 wire

## 2. IPPT Calculation (Inch-Pounds Per Turn)
- **The Formula:** IPPT = (Door Weight x Drum Circumference) / (2 x π x Turns)
- **Simplified IPPT:** (Weight x 1.5) / 7.5 (for standard 400-8 drums).
- **Matching:** If you change wire size, you MUST maintain the total IPPT. 
    - Example: Two .225 x 2" x 24" springs = 32 IPPT. You could replace with one .312 x 2" x 45" spring for similar lift.

## 3. High-Cycle Engineering
- **Wire Stress:** The smaller the ID (Inside Diameter) and the shorter the spring, the higher the stress and shorter the life.
- **Upsizing:** To increase cycles, increase the wire diameter and length simultaneously.
- **Gap Rule:** Always leave 1/4" to 1/2" of space between the coils when fully wound to prevent "coil bind" and friction heat.

## 4. Drum Geometry & Cable Tension
- **Standard Lift (400-8):** Flat surface. 1 turn = approx 12" of cable.
- **High Lift (Tapered):** The cable starts on the maximum diameter (taper) to provide extra torque when lifting the door off the floor (max weight), then transitions to the flat (lower torque) as weight moves to the tracks.
- **Tension Loss:** A door that is heavy on the floor but light at the top has "Cable Stretch" or "Hot Springs." Check if the drums are level.

## 5. DASMA Color Coding (Standardized)
- **Torsion (Wire Size):**
    - Yellow: .207
    - White: .218
    - Red: .225
    - Brown: .234
    - Green: .243
    - Gold: .250
    - Blue: .262
    - Orange: .273
- **Extension (Weight Capacity):**
    - White: 10/110 lbs
    - Green: 20/120 lbs
    - Yellow: 30/130 lbs
    - Blue: 40/140 lbs
    - Red: 50/150 lbs
    - Brown: 60/160 lbs
    - Orange: 70/170 lbs
    - Gold: 80/180 lbs
    - Light Blue: 90/190 lbs
    - Tan: 100/200 lbs

## 6. Winding Chart (Standard 7' Door)
- **Turns:** Usually 7.5 to 8 quarter turns (7.5 full turns).
- **Rule of Thumb:** 1 turn for every foot of height + 1/2 turn for stretch. 
## 7. Vertical Lift Dynamics
- **Full Taper Logic:** VL drums must support 100% of the door weight at all times because there is no horizontal track.
- **Tapered Precision:** Because VL doors never turn a corner, the spring engineering is exceptionally precise. 
- **Drum Specs Reference:**
    - 850-11: LMA 1.34", HMA 4.16", Max Height 11'0"
    - 1100-216: LMA 1.34", HMA 5.44", Max Height 18'0"
    - 1350-336: LMA 1.34", HMA 6.75", Max Height 28'0"
- **HMA Focus:** Required IPPT is calculated using the High Moment Arm (HMA).
    - Formula: IPPT = (Door Weight * HMA) / Total Turns.
    - Example (850-11): 400 lbs x 4.16 (HMA) / 8.5 turns = 195.7 IPPT.
- **Turns Formula:** Determined by drum spiral capacity. 850-11 usually takes 7.5 to 8 turns at max height.
- **Cable Length Formula:** 
    - Cable Length = (Floor to Shaft Center) + (Drum Constant) - (Door Height).
    - 850-11 Constant: 144".
- **Precision:** VL doors are the most sensitive to spring variance. Even 5 IPPT off will cause the door to "jump" or "crash."
`;
