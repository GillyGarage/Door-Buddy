export const DIAGNOSTIC_CHART = [
  {
    symptom: "Scraping sounds",
    possibleCause: "Spacing between door and track is too tight, or rollers are stuck/bearings out",
    suggestedAction: "Adjust track spacing and replace rollers if bearings are seized."
  },
  {
    symptom: "Screeching noises",
    possibleCause: "Bearings are out, hinges are out, or unlubricated components",
    suggestedAction: "Replace bearings/hinges. Lubricate all moving parts with dry silicone."
  },
  {
    symptom: "Grinding noises",
    possibleCause: "Most likely cable grinding on drum or rollers worn down",
    suggestedAction: "Push drums out slightly to clear track (ensure they are aligned). Replace rollers if flattened."
  },
  {
    symptom: "Door is heavy throughout cycle",
    possibleCause: "Insufficient spring tension or wrong spring size installed",
    suggestedAction: "Add tension (1/4 turns). If it persists, weigh the door and replace with correct IPPT spring."
  },
  {
    symptom: "Door is heavy at bottom but balances mid-travel",
    possibleCause: "Wrong spring IPPT or lift cables are too short",
    suggestedAction: "Verify cable length. If correct, the spring IPPT is likely too low for the door weight (weigh the door)."
  },
  {
    symptom: "Door is hot throughout cycle (Jumps up)",
    possibleCause: "Too much tension on spring or wrong spring (IPPT too high)",
    suggestedAction: "Reduce tension. If it still jumps at top, weigh door; spring is likely oversized."
  },
  {
    symptom: "Cables jumping off drum",
    possibleCause: "Cable too long, door unleveled, spring line/horizontals out of level, or cables are different sizes",
    suggestedAction: "Replace/shorten cable. Level the door, track, and springline. Ensure cables are a matched pair."
  },
  {
    symptom: "Rollers popping out",
    possibleCause: "Track is bowing, hinges loose, rollers worn down, or track extremely unplumbed",
    suggestedAction: "Straighten the track. Tighten all hinges. Replace rollers and plumb the vertical tracks."
  },
  {
    symptom: "Light peeking through one side",
    possibleCause: "Door or concrete surface is unlevel",
    suggestedAction: "Level door if possible. Replace bottom seal with a longer/oversized seal to fill the gap."
  },
  {
    symptom: "Door off track in open position",
    possibleCause: "Spacing issues throughout track system, rollers worn out, or broken backhangs",
    suggestedAction: "Get door down carefully (one panel at a time). Adjust spacing, replace rollers, and reinstall/replace backhangs."
  },
  {
    symptom: "Door off track in closed position",
    possibleCause: "Most likely hit by a car",
    suggestedAction: "Kill tension and assess. If salvageable, get back on track. Quote new panels or a full door."
  },
  {
    symptom: "Operator: Up but not coming down",
    possibleCause: "Sensor alignment, short in sensors, or unbalanced door",
    suggestedAction: "Adjust sensors. Even with solid lights, a sensor can be shorted—replace if needed. Test manual balance."
  },
  {
    symptom: "Motor working intermittently",
    possibleCause: "Remote battery dying, logic board failing (common after lightning), or board disconnecting",
    suggestedAction: "Replace remote battery. Replace logic board, capacitor, or move third-party systems. Check for lightbulb interference."
  }
];

export const PILLARS_OF_THE_CALL = [
  { title: "Destination", desc: "Location of the job, 30 min heads up, 10 min buffer for traffic." },
  { title: "Customer Interaction", desc: "You are the face of the company. Be respectful and informative." },
  { title: "Evaluation", desc: "Troubleshooting and site inspection. Take before pictures!" },
  { title: "Estimation", desc: "Give estimate on site. Take deposit upon approval." },
  { title: "Solution", desc: "Troubleshoot, repair, or install. Aim for same day solutions." },
  { title: "Finalization", desc: "Inform customer on maintenance, take final payment, take after photos, and ask for a review." }
];

export const CODE_OF_CONDUCT = [
  "Strive for highest quality workmanship.",
  "Seek to increase knowledge and skills.",
  "Provide safe and dependable operation.",
  "Respect the property of others.",
  "Refrain from derogatory comments on others' work.",
  "Perform work with integrity.",
  "Professional vehicle, tools, and equipment maintenance.",
  "Follow safe work practices.",
  "Adhere to all laws and regulations.",
  "Follow manufacturer instructions.",
  "Inform and educate customers.",
  "Aspire to 100% customer satisfaction."
];

export const TUNE_UP_CHECKLIST = [
  { category: "Safety", items: ["Gloves & Safety Glasses", "Check springs before lowering if door is open", "Disconnect operator trolley", "Winding bars ready"] },
  { category: "Left Side", items: ["Jamb integrity (no rot)", "Jamb brackets tight", "Vertical track straight/plumb", "Spacing ≤ 3/4\"", "Bottom fixture & cable check", "Roller & Hinge inspection (No cracks, lubricated)"] },
  { category: "Middle", items: ["Panel integrity (cracks/splits)", "Struts secure", "Operator support bracket alignment", "Door level check"] },
  { category: "Right Side", items: ["Repeat Left Side inspections", "Lubrication of hinges and rollers"] },
  { category: "Spring Line", items: ["Spring line straightness", "Spring anchor plate (3 lags)", "Spring condition & tension", "Bearings & Couplers lubed"] },
  { category: "Operator", items: ["Mounting bracket secure", "Trolley rail slope", "J-arm angle", "Chain/Belt tension", "Safety sensors functional"] }
];

export const LADDER_SAFETY_CHECKLIST = [
  { category: "Condition", items: ["Side rails free of cracks, bends, dents", "Steps/treads secure and not damaged", "Ladder clean (no oil, grease, mud)", "No loose rivets or bolts", "Not painted to hide defects"] },
  { category: "Feet", items: ["All feet/shoes present", "Feet not worn or damaged", "Sits level with no wobble"] },
  { category: "Hardware", items: ["Spreader bars fully open and locked", "Hinges operate smoothly", "No temporary repairs (tape/wire)"] },
  { category: "Labels", items: ["Manufacturer labels readable", "Load rating visible and appropriate"] },
  { category: "Safe Use", items: ["Maintain 3 points of contact", "Belt buckle remains between rails", "No standing on top step/cap", "Only one person on ladder", "Electrical hazards assessed"] }
];

export const SITE_INSPECTION_CHECKLIST = [
  { category: "Customer", items: ["Name, Phone & Email verified", "Verification of service address", "Tech Notes & Scope confirmed"] },
  { category: "Opening", items: ["Current Lift Type/Radius identified", "Garage Opening (W x H) measured", "Garage Door (W x H) measured"] },
  { category: "Dimensions", items: ["Headroom (Inches)", "Clearance (Inches)", "Side Room (L/R) measured"] },
  { category: "Infrastructure", items: ["Drip Tray condition checked", "Power Supply location found", "Door Weight (for conversions)"] }
];

export const TECH_GUIDE_CHUNKS = [
  "PHILOSOPHY: A service call is an investigation. Don't assume anything. Listen to the customer but verify with your eyes.",
  "REPAIR CALLS: Show up with all necessary parts. Carry springs, belts, photo eyes, and rollers on your truck.",
  "INSTALL CALLS: Always do a site inspection prior to installs. Double check inventory when picking up product.",
  "SAFETY: High-tension springs can be lethal. Never use anything other than proper 1/2\" winding bars. Never stand in the line of the winding cone.",
  "THE 3-STEP TEST: 1. Disconnect opener. 2. Lift door halfway (should stay). 3. Release (it shouldn't slam or fly up).",
  "LUBRICATION: Never use WD-40 on rollers or hinges; it's a solvent. Use silicone or white lithium spray.",
  "TRACKS: Vertical tracks should be plumb. Horizontal tracks should have a slight upward pitch towards the rear."
];

export const TOOL_LIST = [
  "Winding Bars (1/2\" OD cold rolled steel)",
  "Locking Pliers (Vise-Grips)",
  "Tape Measure (25' or 35')",
  "Open Box Wrenches (3/8\", 7/16\", 1/2\", 9/16\")",
  "Ratchet with Deep Sockets (7/16\", 1/2\", 9/16\")",
  "Impact Driver (Cordless with magnetic drivers)",
  "Level (2', 4' and Torpedo)",
  "Drill Bits (3/16\" thru 1/2\")",
  "Garage Door Lubricant (Silicone or Lithium base)",
  "C-Clamps (at least 2)",
  "Step Ladder (4', 6' or 8')",
  "300lbs Scale",
  "Spring Gauge"
];
