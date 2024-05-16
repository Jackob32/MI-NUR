/* ── Shift / scheduling utilities ───────────────────────────────────────── */
import moment from 'moment';

/**
 * Builds a map of { email → totalScheduledHours } from an events array.
 * Used in Usertable and auto-assign algorithms.
 */
export function computeScheduledHours(events) {
    const map = {};
    events.forEach(event => {
        const hours = (new Date(event.end) - new Date(event.start)) / 3600000;
        (event.employees || []).forEach(emp => {
            map[emp.email] = (map[emp.email] || 0) + hours;
        });
    });
    return map;
}

/**
 * Returns workload stats for a single employee from an events array.
 * @param {string} email
 * @param {Array}  events
 * @returns {{ totalShifts: number, weekHours: number, monthHours: number }}
 */
export function getEmployeeWorkload(email, events) {
    const weekStart  = moment().startOf('isoWeek').toDate();
    const weekEnd    = moment().endOf('isoWeek').toDate();
    const monthStart = moment().startOf('month').toDate();
    const monthEnd   = moment().endOf('month').toDate();

    let weekHours = 0, monthHours = 0, totalShifts = 0;

    events.forEach(e => {
        if (!(e.employees || []).some(emp => emp.email === email)) return;
        const h     = (new Date(e.end) - new Date(e.start)) / 3600000;
        const start = new Date(e.start);
        totalShifts++;
        if (start >= weekStart  && start <= weekEnd)   weekHours  += h;
        if (start >= monthStart && start <= monthEnd)  monthHours += h;
    });

    return {
        totalShifts,
        weekHours:  Math.round(weekHours  * 10) / 10,
        monthHours: Math.round(monthHours * 10) / 10,
    };
}

/**
 * Returns true if the two time intervals overlap.
 */
export function overlaps(aStart, aEnd, bStart, bEnd) {
    return new Date(aStart) < new Date(bEnd) && new Date(aEnd) > new Date(bStart);
}
