import type { Settings, ExamPresetCategory } from './types';
import schoolCrest from './assets/school_crest.png';

export const DEFAULT_SETTINGS: Settings = {
    sessionTitle: 'Trial HSC Examinations',
    schoolName: 'Inverell High School',
    centreNumber: 'Examination Centre 222',
    showSchool: true,
    showCentre: true,
    showCrest: true,
    crestUrl: schoolCrest,
    showStatus: true,
    showTimes: true,
    showCountdown: false,
    timeBreakdown: true,
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
        'header-session-title': 46,
        'header-school-info': 38,
        'header-centre-number': 22,
        'header-time': 154,
        'header-date': 56,
    }
};

// --- ADDED THE COLOR PALETTE ---
export const CARD_COLORS = [
    { name: 'Default', bg: 'bg-white', text: 'text-slate-900', border: 'border-slate-200', darkBg: 'dark:bg-slate-800', darkText: 'dark:text-slate-100', darkBorder: 'dark:border-slate-700' },
    { name: 'Blue', bg: 'bg-blue-100', text: 'text-blue-900', border: 'border-blue-200', darkBg: 'dark:bg-blue-900/40', darkText: 'dark:text-blue-100', darkBorder: 'dark:border-blue-800' },
    { name: 'Green', bg: 'bg-green-100', text: 'text-green-900', border: 'border-green-200', darkBg: 'dark:bg-green-900/40', darkText: 'dark:text-green-100', darkBorder: 'dark:border-green-800' },
    { name: 'Yellow', bg: 'bg-yellow-100', text: 'text-yellow-900', border: 'border-yellow-200', darkBg: 'dark:bg-yellow-900/40', darkText: 'dark:text-yellow-100', darkBorder: 'dark:border-yellow-800' },
    { name: 'Red', bg: 'bg-red-100', text: 'text-red-900', border: 'border-red-200', darkBg: 'dark:bg-red-900/40', darkText: 'dark:text-red-100', darkBorder: 'dark:border-red-800' },
    { name: 'Purple', bg: 'bg-purple-100', text: 'text-purple-900', border: 'border-purple-200', darkBg: 'dark:bg-purple-900/40', darkText: 'dark:text-purple-100', darkBorder: 'dark:border-purple-800' },
    { name: 'Pink', bg: 'bg-pink-100', text: 'text-pink-900', border: 'border-pink-200', darkBg: 'dark:bg-pink-900/40', darkText: 'dark:text-pink-100', darkBorder: 'dark:border-pink-800' },
];
// --- END OF NEW CODE ---


export const SESSION_PRESETS: Record<string, Partial<Settings>> = {
    'HSC Examinations': { showCentre: true, showCrest: false, gridLayout: 3, showTimes: true, showSchool: true },
    'Trial HSC Examinations': { showSchool: true, showCentre: true, showCrest: true, gridLayout: 3, showTimes: true, showStatus: true },
    'Exit Examinations': { showSchool: true, showCrest: true, showStatus: true, gridLayout: 3, showTimes: true },
    'Half Yearly Examinations': { showSchool: true, showCrest: true, showStatus: true, gridLayout: 3, showTimes: true },
    'Preliminary Examinations': { showSchool: true, showCrest: true, showStatus: true, gridLayout: 3, showTimes: true },
    'Yearly Examinations': { showSchool: true, showCrest: true, showStatus: true, gridLayout: 3, showTimes: true },
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
    'VALID',
    'Check-In Assessment',
    'Minimum Standards'
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
    
};
