/* ─── localStorage persistence helpers ──────────────────────────────────────── */
const EVENTS_KEY  = 'shifts_events_v1';
const USERS_KEY   = 'shifts_users_v1';
const SETTINGS_PFX = 'shifts_settings_v1_';

export function saveEvents(events) {
    try { localStorage.setItem(EVENTS_KEY, JSON.stringify(events)); } catch (e) { /* ignore */ }
}

export function loadEvents(fallback) {
    try {
        const raw = localStorage.getItem(EVENTS_KEY);
        if (!raw) return fallback;
        const parsed = JSON.parse(raw);
        return parsed.map(e => ({ ...e, start: new Date(e.start), end: new Date(e.end) }));
    } catch (e) { return fallback; }
}

export function saveUsers(users) {
    try { localStorage.setItem(USERS_KEY, JSON.stringify(users)); } catch (e) { /* ignore */ }
}

export function loadUsers(fallback) {
    try {
        const raw = localStorage.getItem(USERS_KEY);
        if (!raw) return fallback;
        return JSON.parse(raw);
    } catch (e) { return fallback; }
}

export function saveSettings(key, settings) {
    try { localStorage.setItem(SETTINGS_PFX + key, JSON.stringify(settings)); } catch (e) { /* ignore */ }
}

export function loadSettings(key, fallback) {
    try {
        const raw = localStorage.getItem(SETTINGS_PFX + key);
        if (!raw) return fallback;
        return { ...fallback, ...JSON.parse(raw) };
    } catch (e) { return fallback; }
}
