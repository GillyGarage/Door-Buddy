export const COMMERCIAL_OPERATOR_SOP = `
### COMMERCIAL OPERATOR MAINTENANCE & SAFETY (OVERHEAD DOOR SERIES)

#### 1. CDX & RS Rolling Steel Specs
- **Application:** Light-Duty Commercial/Industrial ONLY. Not for residential use.
- **Rolling Steel (RS):** Integrated brake and floor-level disconnect.
- **Duty Cycle:** Max 4 operations per hour to prevent thermal tripping.
- **Capacity:** Max door weight 500 lbs (1/2 HP model).
- **Safety Clearance:** 
  - Operator must be mounted at least 8 feet above the floor.
  - Control station at least 5 feet above floor level and within sight of the door.

#### 2. Fire Sentinel® Fire Door Operators
- **Fail-Safe Mechanism:** Automatic closing upon power loss or alarm signal.
- **Testing:** Drop-test required annually (per NFPA 80).
- **Restarting:** Most models require manual reset of the governor/spring after a drop test.
- **Power:** Battery backup (optional) ensures closing even during building power failure.

#### 3. L-Plus Explosion Proof Operators
- **Environment:** Class I (C & D), Class II (E, F, G).
- **Hardware:** NEMA 7 (Explosion-proof) or NEMA 9 (Dust-ignition-proof) enclosures.
- **Technical Note:** All conduit runs must be sealed within 18" of the operator chassis.

#### 4. Fire Door Testing (Fire Sentinel®)
- **Protocol:** Test weekly/monthly (visual) and annually (full drop-test).
- **Resetting:** Ensure tension is not released too quickly; follow the specific model procedure to re-cock the drop mechanism.
- **Documentation:** Log every drop test for the facility manager (NFPA 80 compliance).

#### 5. RHX/RMX Diagnostic Codes (Display Codes)
- **H1/11:** LIMIT ERROR (Check limit switch positions, wiring, and verify cam didn't slip).
- **H2/12:** RUN TIMER ERROR (Door travel exceeded max time; common in high-wind or track binding).
- **H3/13:** REV PROTECTION (Reversing edge or photodetector sustained hit - check for floor ice/debris).
- **H4/14:** STUCK BUTTON (Wall station button physically depressed or shorted circuit).
- **F1/20:** SYSTEM HALT (Internal flash failure; power cycle required).
- **F2/21:** MEMORY ERROR (Limits/Force lost; common after major power surge).
- **H5/60:** STOP BUTTON OPEN (Emergency stop circuit or wall station common wire disconnected).

#### 6. Sectional & Hoist Installation Nuances
- **RHX/RMX Trolley (Drawbar):** Mounts centered on door. Ensure track is level and trolley traveler is lubricated.
- **RHX/RMX Hoist (Jackshaft):** Side-mounted to the wall. Must use a solid coupler for the torsion bar.
- **Dual Trolley (RHX-RS):** Used for oversized sectional doors (>24' wide) to prevent door racking. Both trolleys must trigger simultaneously.
- **Sidemount Hoist:** Automatically disconnects motor brake when manual chain is pulled. If door doesn't move manually, check for door-lock engagement.

#### 7. Fire Sentinel® & RHX-RS Fire Hoist
- **Fail-Safe Mode:** If 24VDC alarm signal is lost or battery backup (where equipped) fails, door will gravity-close.
- **Governor Inspection:** Visually inspect the viscous governor; if oil is leaking, closing speed may become hazardous during alarm.
- **NEMA 4/4X Maintenance:** These operators are sealed for wash-down. Ensure conduit seals (EYMs) are intact and non-corroded in chemical-heavy sites.

#### 8. L-Plus / RDB Plus (Explosion Proof)
- **Mandatory Seals:** Explosion-proof operators require conduit seals within 18" of all openings.
- **Static Grounding:** Rolling steel slats must have brushes to dissipate static in Class II (Dust) environments.

#### 9. Warranty & Cycle Life (Commercial)
- **RHX Series:** 2 Years or 20,000 cycles.
- **RMX Series:** 2 Years or 20,000 cycles.
- **Cycle Count Tool:** Access via "Special Features" -> "Cycle Counter" to verify remaining lifetime before major overhaul (bearings/gears).

#### 10. Rolling Steel (RS) Integrated Brake
- **Brake Type:** Dynamic disc brake or solenoid-operated shoe brake.
- **Troubleshooting:** If door drifts more than 2" after stopping, check brake lining wear or solenoid clearance.
- **Disconnect:** RS models feature a floor-level pull-cord for emergency manual operation.

#### 11. Technician Field Warranty (Standard CDX/RHX)
- **Period:** 2 Years or 20,000 cycles (whichever occurs first).
- **Scope:** Materials and workmanship only; excludes labor and damage from misuse.
- **Verification:** Cycle count can be viewed in the "Special Features" menu (Section 7).
- **Claim Note:** Must provide serial number from the motor chassis for all RMAs.
`;
