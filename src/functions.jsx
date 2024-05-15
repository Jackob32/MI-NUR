/* ── Backward-compatible re-exports ─────────────────────────────────────────
   All utilities now live in src/utils/. Import from there in new code.
   This file exists so existing imports of "../../functions" keep working.
─────────────────────────────────────────────────────────────────────────── */
export { toDatetimeLocal, formatDuration, msToHours } from './utils/date';
export { exportShiftsToCSV }                          from './utils/csv';
export { computeScheduledHours, getEmployeeWorkload, overlaps } from './utils/shift';

Date.prototype.fromDatetimeLocal = (function (BST) {
    // BST should not be present as UTC time
    return new Date(BST).toISOString().slice(0, 16) === BST ?
        // if it is, it needs to be removed
        function () {
            return new Date(
                this.getTime() +
                (this.getTimezoneOffset() * 60000)
            ).toISOString();
        } :
        // otherwise can just be equivalent of toISOString
        Date.prototype.toISOString;
}('2006-06-06T06:06'));