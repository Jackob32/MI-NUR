/* ── Date / time utilities ───────────────────────────────────────────────── */

/** Formats a Date to the value format expected by datetime-local inputs (YYYY-MM-DDTHH:MM:SS). */
export function toDatetimeLocal(date) {
    const pad = i => (i < 10 ? '0' : '') + i;
    return (
        date.getFullYear() + '-' +
        pad(date.getMonth() + 1) + '-' +
        pad(date.getDate()) + 'T' +
        pad(date.getHours()) + ':' +
        pad(date.getMinutes()) + ':' +
        pad(date.getSeconds())
    );
}

/** Returns a human-readable duration string like "2h 30m" or "45m". */
export function formatDuration(start, end) {
    const diffMs = new Date(end) - new Date(start);
    if (diffMs <= 0) return '';
    const totalMinutes = Math.floor(diffMs / 60000);
    const hours   = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours   === 0) return `${minutes}m`;
    if (minutes === 0) return `${hours}h`;
    return `${hours}h ${minutes}m`;
}

/** Converts milliseconds to decimal hours, rounded to 1 decimal place. */
export function msToHours(ms) {
    return Math.round((ms / 3600000) * 10) / 10;
}
