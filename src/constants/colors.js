/* ── Google Material Design colour palette ───────────────────────────────────
   Single source of truth for all colours used across the app.
   Import from here instead of hardcoding hex values in components.
─────────────────────────────────────────────────────────────────────────── */

export const COLORS = {
    /* Brand / primary actions */
    blue:    '#1A73E8',
    blueDk:  '#1557B0',
    blueLt:  '#4285F4',

    /* Success / secondary actions */
    green:   '#34A853',
    greenDk: '#1E8E3E',
    greenLt: '#34D399',

    /* Destructive / error */
    red:     '#EA4335',
    redDk:   '#DC2626',

    /* Warning */
    yellow:  '#FBBC04',
    amber:   '#D97706',

    /* Surfaces */
    bg:      '#F8F9FA',
    surface: '#FFFFFF',
    border:  '#DADCE0',

    /* Text hierarchy */
    ink1:    '#202124',
    ink2:    '#5F6368',
    ink3:    '#80868B',

    /* Misc */
    slate:   '#94A3B8',
    navy:    '#1C2333',
};

/* Semantic aliases for common use-cases */
export const C = {
    primary:   COLORS.blue,
    success:   COLORS.green,
    danger:    COLORS.red,
    warning:   COLORS.yellow,
    muted:     COLORS.ink3,
    border:    COLORS.border,
    bg:        COLORS.bg,
};
