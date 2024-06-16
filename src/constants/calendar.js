/* ── Calendar-specific constants ─────────────────────────────────────────── */

export const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export const SHIFT_COLORS = [
    '#4338CA', '#059669', '#DC2626', '#D97706',
    '#0EA5E9', '#7C3AED', '#EC4899', '#64748B',
];

/* ── 5-level interest / availability system ─────────────────────────────────
   Levels from most to least willing:
     want       – actively wants this shift
     can        – can take it if needed
     available  – available, no preference
     prefer_not – available but would rather not
     cannot     – hard no, not available
──────────────────────────────────────────────────────────────────────────── */

export const INTEREST_LABELS = {
    want:       'Chci tuto směnu',
    can:        'Mohu vzít',
    available:  'Jsem k dispozici',
    prefer_not: 'Raději ne',
    cannot:     'Nemohu',
};

export const INTEREST_COLORS = {
    want:       '#059669',
    can:        '#0284C7',
    available:  '#6B7280',
    prefer_not: '#D97706',
    cannot:     '#DC2626',
};

/** Lower value = assigned first by auto-assign. 99 = never auto-assigned. */
export const INTEREST_PRIORITY = {
    want:       0,
    can:        1,
    available:  2,
    prefer_not: 99,
    cannot:     99,
};

export const INTEREST_BUTTON_OPTIONS = [
    { level: 'want',       label: 'Chci tuto směnu',  bg: '#DCFCE7', border: '#86EFAC', color: '#059669' },
    { level: 'can',        label: 'Mohu vzít',         bg: '#E0F2FE', border: '#7DD3FC', color: '#0284C7' },
    { level: 'available',  label: 'Jsem k dispozici',  bg: '#F3F4F6', border: '#D1D5DB', color: '#6B7280' },
    { level: 'prefer_not', label: 'Raději ne',         bg: '#FEF3C7', border: '#FCD34D', color: '#D97706' },
    { level: 'cannot',     label: 'Nemohu',            bg: '#FEE2E2', border: '#FECACA', color: '#DC2626' },
];

/* Auto-assign algorithms */
export const AUTO_ASSIGN_ALGORITHMS = {
    greedy:   'greedy',
    balanced: 'balanced',
};

export const STORAGE_SETTINGS_KEY    = 'manager_global';
export const DEFAULT_MANAGER_SETTINGS = {
    interestMode:              false,
    algorithm:                 'greedy',
    /* What employees are allowed to see */
    employeeShowCapacity:      true,   // show X/Y filled slots on tile and in detail
    employeeShowAssignees:     true,   // show list of who is assigned in shift detail
    employeeShowOnlyAvailable: false,  // hide shifts that are already full
};
