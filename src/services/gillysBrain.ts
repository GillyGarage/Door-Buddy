import { GARAGE_DOOR_BIBLE } from "./garageDoorBible";
import { LEAD_GEN_TACTICS } from "./leadGenTactics";
import { PRICING_SOP } from "./pricingSop";
import { COMMERCIAL_OPERATOR_SOP } from "./commercialSop";
import { INSTALL_REMOVAL_SOP } from "./installationSop";
import {
  FIELD_SAFETY_SOP,
  SITE_INSPECTION_SOP,
  INSTALL_SECTIONAL_SOP,
  OPERATOR_INSTALL_SOP,
  ROLLER_REPLACEMENT_SOP,
  FIELD_RESOURCES_SOP
} from "./fieldSops";
import { PROGRAMMING_SOP } from "./programmingSop";
import { ROLL_UP_DOOR_SOP } from "./rollUpSop";
import { CLOPAY_RESIDENTIAL_SOP } from "./clopaySop";
import { LOW_HEADROOM_SOP } from "./lowHeadroomSop";
import { CLOPAY_HARDWARE_SOP } from "./clopayHardwareSop";
import { AMARR_ALUMINUM_SOP } from "./amarrSop";
import { FIRE_DOOR_SOP } from "./fireDoorSop";
import { SPRING_BIBLE_SOP } from "./springBible";
import { SPRING_ENGINEERING_DATA } from "./springEngineeringData";
import {
  HIGH_LIFT_SOP,
  TRACK_ROLLER_GEOMETRY_SOP,
  EXTREME_TENSION_SAFETY_SOP,
  ROLLING_STEEL_SOP
} from "./academyContent";
import { 
  DIAGNOSTIC_CHART, 
  CODE_OF_CONDUCT, 
  PILLARS_OF_THE_CALL, 
  TOOL_LIST 
} from "./gillyKnowledge";

export const GILLYS_BRAIN = {
  core: {
    bible: GARAGE_DOOR_BIBLE,
    pricing: PRICING_SOP,
    growth: LEAD_GEN_TACTICS,
    diagnostic: DIAGNOSTIC_CHART,
    conduct: CODE_OF_CONDUCT,
    pillars: PILLARS_OF_THE_CALL,
  },
  commercial: {
    operatorSpecs: COMMERCIAL_OPERATOR_SOP,
    rollingSteel: ROLLING_STEEL_SOP,
    fireKing: FIRE_DOOR_SOP,
    rollUp: ROLL_UP_DOOR_SOP,
    clopayResidential: CLOPAY_RESIDENTIAL_SOP,
  },
  technical: {
    installation: INSTALL_REMOVAL_SOP,
    sectional: INSTALL_SECTIONAL_SOP,
    operators: OPERATOR_INSTALL_SOP,
    programming: PROGRAMMING_SOP,
    lowHeadroom: LOW_HEADROOM_SOP,
    amarrAluminum: AMARR_ALUMINUM_SOP,
    clopayHardware: CLOPAY_HARDWARE_SOP,
    highLift: HIGH_LIFT_SOP,
    geometry: TRACK_ROLLER_GEOMETRY_SOP,
    rollers: ROLLER_REPLACEMENT_SOP,
    springBible: SPRING_BIBLE_SOP,
    engineeringConstants: SPRING_ENGINEERING_DATA,
  },
  safety: {
    protocols: FIELD_SAFETY_SOP,
    inspection: SITE_INSPECTION_SOP,
    extremeTension: EXTREME_TENSION_SAFETY_SOP,
  },
  resources: {
    tools: FIELD_RESOURCES_SOP,
    kit: TOOL_LIST,
  }
};

export const GILLYS_BRAIN_STRING = `
GILLY'S BRAIN - COMPLETE TECHNICAL REPOSITORY (GARAGE UP EDITION)

[VITAL STATS: MISSION CONTROL]
- Brand: Garage Up
- Core Liaison: Gilly (The Ultimate Tech Buddy)
- Tone: Technical, Professional, Safety-First, Field-Tested.

[MISSION CONTROL: CODE OF CONDUCT]
${CODE_OF_CONDUCT.join('\n')}

[DIAGNOSTIC ENGINE: TROUBLESHOOTING MATRIX]
${JSON.stringify(DIAGNOSTIC_CHART, null, 2)}

[THE 6 PILLARS OF THE CALL]
${JSON.stringify(PILLARS_OF_THE_CALL, null, 2)}

[CORE BIBLE: TERMINOLOGY & SPECS]
${GARAGE_DOOR_BIBLE}

[PRICING & LABOR SOP]
${PRICING_SOP}

[ACCESSORY PROGRAMMING & HOMELINK]
${PROGRAMMING_SOP}

[COMMERCIAL OPERATOR FIELD MANUALS]
CDX, Fire Sentinel, and L-Plus Specs:
${COMMERCIAL_OPERATOR_SOP}

[ROLLING STEEL & FIRE DOOR INSTALLATION (SOP)]
${ROLLING_STEEL_SOP}
${FIRE_DOOR_SOP}
${ROLL_UP_DOOR_SOP}

[SPRING BIBLE & ENGINEERING DATA]
${SPRING_BIBLE_SOP}
Technical Constants: ${JSON.stringify(SPRING_ENGINEERING_DATA, null, 2)}

[SECTIONAL INSTALLATION & MECHANICAL GEOMETRY]
SOPs for standard, sectional, and high-lift systems:
${INSTALL_SECTIONAL_SOP}
${CLOPAY_RESIDENTIAL_SOP}
${AMARR_ALUMINUM_SOP}
${SPRING_BIBLE_SOP}
${CLOPAY_HARDWARE_SOP}
${LOW_HEADROOM_SOP}
${OPERATOR_INSTALL_SOP}
${HIGH_LIFT_SOP}
${TRACK_ROLLER_GEOMETRY_SOP}
${ROLLER_REPLACEMENT_SOP}

[SAFETY PROTOCOLS & EXTREME TENSION]
${FIELD_SAFETY_SOP}
${SITE_INSPECTION_SOP}
${EXTREME_TENSION_SAFETY_SOP}

[GROWTH & FIELD SUCCESS]
${LEAD_GEN_TACTICS}

[TECH TOOLKIT: ESSENTIAL GEAR]
${TOOL_LIST.join('\n')}

[FIELD PRO-TIPS & GOVERNORS]
- CDX Duty Cycle: 4 cycles/hour max.
- Thermal Protector (Code 50): Requires 15-30 min cooldown.
- Spring Anchor Plate: Minimum 3 lags into structural header.
- Track Slope: 1/8" per foot for smooth sectional operation.
- Rolling Steel: Do NOT cut the wrap until initial tension is set (2 full laps).
`;
