import type { Settings, ExamPresetCategory } from './types';
import schoolCrest from './assets/school_crest.png'; // 1. ADDED THIS IMPORT

export const DEFAULT_SETTINGS: Settings = {
    sessionTitle: 'Trial HSC Examinations',
    schoolName: 'Inverell High School',
    centreNumber: 'Examination Centre 222',
    showSchool: true,
    showCentre: true,
    showCrest: false,
    crestUrl: schoolCrest,
    showStatus: false,
    showTimes: true,
    showCountdown: false,
    timeBreakdown: false,
    singleLineTime: false,
    disableTimers: false,
    colorAlerts: false,
    specialProvisions: false,
    showSPLive: true,
    showSpCountdown: true,
    gridLayout: 3,
    showSeconds: true,
    is24hr: false,
    fontSizes: {
        'header-session-title': 40,
        'header-school-info': 28,
        'header-centre-number': 32, 
        'header-time': 140,
        'header-date': 40,
    }
};



export const SESSION_PRESETS: Record<string, Partial<Settings>> = {
    'HSC Examinations': { showCentre: true, showCrest: false, gridLayout: 3, showTimes: true, showSchool: true },
    'Trial HSC Examinations': { showSchool: false, showCentre: true, showCrest: false, gridLayout: 3, showTimes: true, showStatus: false },
    'Exit Examinations': { showSchool: true, showCrest: true, showStatus: true, gridLayout: 3, showTimes: true },
    'Half Yearly Examinations': { showSchool: true, showCrest: true, showStatus: true, gridLayout: 3, showTimes: true },
    'Preliminary Examinations': { showSchool: true, showCrest: true, showStatus: true, gridLayout: 3, showTimes: true },
    'Yearly Examinations': { showSchool: true, showCrest: true, showStatus: true, gridLayout: 3, showTimes: true },
    // Standardised Test Presets
    'NAPLAN': { gridLayout: 4, disableTimers: true, showTimes: false, showStatus: false, showCrest: true, showSchool: true, specialProvisions: false },
    'VALID': { gridLayout: 4, disableTimers: true, showTimes: false, showStatus: false, showCrest: true, showSchool: true, specialProvisions: false },
    'Check-In Assessment': { gridLayout: 4, disableTimers: true, showTimes: false, showStatus: false, showCrest: true, showSchool: true, specialProvisions: false },
    'Minimum Standards': { gridLayout: 4, disableTimers: true, showTimes: false, showStatus: false, showCrest: true, showSchool: true, specialProvisions: false },
};

export const EXAMINATION_PRESET_TITLES = [
    'Trial HSC Examinations',
    'HSC Examinations',
    'Half Yearly Examinations',
    'Exit Examinations',
    'Preliminary Examinations',
    'Yearly Examinations',
];

export const STANDARDISED_TEST_TITLES = [
    'NAPLAN',
    'Check-In Assessment',
    'Minimum Standards',
    'VALID'
];

export const PRESET_ALIASES: Record<string, string> = {
    'HSC Examinations': 'Trial HSC Examinations',
    'Yearly Examinations': 'Exit Examinations',
    'Preliminary Examinations': 'Exit Examinations',
};


export const EXAM_PRESETS: Record<string, ExamPresetCategory> = {
    "Trial HSC Examinations": {
        "English": [
            { "name": "12 English Standard Paper 1", "readMins": 10, "writeHrs": 1, "writeMins": 30 }, { "name": "12 English Advanced Paper 1", "readMins": 10, "writeHrs": 1, "writeMins": 30 },
            { "name": "12 English Standard Paper 2", "readMins": 5, "writeHrs": 2, "writeMins": 0 }, { "name": "12 English Advanced Paper 2", "readMins": 5, "writeHrs": 2, "writeMins": 0 },
            { "name": "12 English Extension 1", "readMins": 10, "writeHrs": 2, "writeMins": 0 }
        ],
        "Mathematics": [
            { "name": "12 Mathematics Standard 1", "readMins": 10, "writeHrs": 2, "writeMins": 0 }, { "name": "12 Mathematics Standard 2", "readMins": 10, "writeHrs": 2, "writeMins": 30 },
            { "name": "12 Mathematics Advanced", "readMins": 10, "writeHrs": 3, "writeMins": 0 }, { "name": "12 Mathematics Extension 1", "readMins": 10, "writeHrs": 2, "writeMins": 0 },
            { "name": "12 Mathematics Extension 2", "readMins": 10, "writeHrs": 3, "writeMins": 0 }
        ],
        "Science": [
            { "name": "12 Chemistry", "readMins": 5, "writeHrs": 3, "writeMins": 0 }, { "name": "12 Physics", "readMins": 5, "writeHrs": 3, "writeMins": 0 }, { "name": "12 Biology", "readMins": 5, "writeHrs": 3, "writeMins": 0 },
            { "name": "12 Earth and Environmental Science", "readMins": 5, "writeHrs": 3, "writeMins": 0 }, { "name": "12 Investigating Science", "readMins": 5, "writeHrs": 3, "writeMins": 0 }, { "name": "12 Agriculture", "readMins": 5, "writeHrs": 3, "writeMins": 0 },
            { "name": "12 Science Extension", "readMins": 10, "writeHrs": 2, "writeMins": 0 }
        ],
        "HSIE": [
            { "name": "12 Modern History", "readMins": 5, "writeHrs": 3, "writeMins": 0 }, { "name": "12 Ancient History", "readMins": 10, "writeHrs": 3, "writeMins": 0 },
            { "name": "12 History Extension", "readMins": 10, "writeHrs": 2, "writeMins": 0 }, { "name": "12 Legal Studies", "readMins": 5, "writeHrs": 3, "writeMins": 0 },
            { "name": "12 Community & Family Studies", "readMins": 5, "writeHrs": 3, "writeMins": 0 }
        ],
        "TAS": [
            { "name": "12 Work Studies", "readMins": 10, "writeHrs": 1, "writeMins": 0 }, { "name": "12 Food Technology", "readMins": 5, "writeHrs": 3, "writeMins": 0 },
            { "name": "12 Design & Technology", "readMins": 5, "writeHrs": 1, "writeMins": 30 },
            { "name": "12 Industrial Technology - Metal", "readMins": 5, "writeHrs": 1, "writeMins": 30 }, { "name": "12 Industrial Technology - Automotive", "readMins": 5, "writeHrs": 1, "writeMins": 30 },
            { "name": "12 Construction", "readMins": 5, "writeHrs": 2, "writeMins": 0 }, { "name": "Retail Services Examination", "readMins": 5, "writeHrs": 2, "writeMins": 0 }
        ],
        "CAPA": [ { "name": "12 Visual Arts", "readMins": 5, "writeHrs": 1, "writeMins": 30 } ],
        "PDHPE": [
            { "name": "12 Personal Development, Health & Physical Education", "readMins": 5, "writeHrs": 3, "writeMins": 0 },
            { "name": "12 Health and Movement Science", "readMins": 5, "writeHrs": 3, "writeMins": 0 },
            { "name": "12 Sport, Lifestyle and Recreation", "readMins": 5, "writeHrs": 2, "writeMins": 0 },
            { "name": "12 Exploring Early Childhood", "readMins": 5, "writeHrs": 2, "writeMins": 0 }
        ],
        "Other": [ { "name": "12 Distance Education", "readMins": 10, "writeHrs": 3, "writeMins": 0 } ]
    },
    "Exit Examinations": {
        "English": [
            { "name": "English Advanced", "readMins": 5, "writeHrs": 2, "writeMins": 0 },
            { "name": "English Standard", "readMins": 5, "writeHrs": 2, "writeMins": 0 },
            { "name": "English Extension 1", "readMins": 5, "writeHrs": 1, "writeMins": 30 }
        ],
        "Mathematics": [
            { "name": "Mathematics Advanced", "readMins": 5, "writeHrs": 2, "writeMins": 0 },
            { "name": "Mathematics Standard", "readMins": 5, "writeHrs": 2, "writeMins": 0 },
            { "name": "Mathematics Extension", "readMins": 5, "writeHrs": 1, "writeMins": 30 }
        ],
        "Science": [
            { "name": "Biology", "readMins": 5, "writeHrs": 2, "writeMins": 0 },
            { "name": "Chemistry", "readMins": 5, "writeHrs": 2, "writeMins": 0 },
            { "name": "Physics", "readMins": 5, "writeHrs": 2, "writeMins": 0 },
            { "name": "Agriculture", "readMins": 5, "writeHrs": 2, "writeMins": 0 }
        ],
        "HSIE": [
            { "name": "Ancient History", "readMins": 5, "writeHrs": 1, "writeMins": 30 },
            { "name": "Modern History", "readMins": 5, "writeHrs": 1, "writeMins": 30 },
            { "name": "Business Studies", "readMins": 5, "writeHrs": 2, "writeMins": 0 },
            { "name": "Legal Studies", "readMins": 5, "writeHrs": 2, "writeMins": 0 },
            { "name": "Business Studies", "readMins": 5, "writeHrs": 2, "writeMins": 0 }
        ],
        "TAS": [
            { "name": "Food Technology", "readMins": 5, "writeHrs": 2, "writeMins": 0 },
            { "name": "Textiles and Design", "readMins": 5, "writeHrs": 1, "writeMins": 30 },
            { "name": "Industrial Technology - Automotive", "readMins": 5, "writeHrs": 1, "writeMins": 30 },
            { "name": "Design & Technology", "readMins": 5, "writeHrs": 1, "writeMins": 30 }
        ],
        "PDHPE": [
            { "name": "Health and Movement Science", "readMins": 5, "writeHrs": 2, "writeMins": 0 },
            { "name": "Sport, Lifestyle and Recreation", "readMins": 5, "writeHrs": 1, "writeMins": 30 },
            { "name": "Community & Family Studies", "readMins": 5, "writeHrs": 2, "writeMins": 0 },
            { "name": "Exploring Early Childhood", "readMins": 5, "writeHrs": 1, "writeMins": 0 }
        ],
        "CAPA": [
            { "name": "Visual Arts", "readMins": 5, "writeHrs": 1, "writeMins": 30 },
            { "name": "Dance", "readMins": 5, "writeHrs": 1, "writeMins": 0 }
        ]
    }
};
