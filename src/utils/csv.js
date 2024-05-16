/* ── CSV export utilities ────────────────────────────────────────────────── */

/** Triggers a CSV download of the given shifts/events array. */
export function exportShiftsToCSV(events) {
    const headers = ['ID', 'Název', 'Začátek', 'Konec', 'Kapacita', 'Obsazeno', 'Uzamčeno', 'Poznámka'];
    const rows = events.map(e => [
        e.id,
        `"${(e.title  || '').replace(/"/g, '""')}"`,
        new Date(e.start).toLocaleString('cs-CZ'),
        new Date(e.end).toLocaleString('cs-CZ'),
        e.capacity,
        e.employees.length,
        e.locked ? 'Ano' : 'Ne',
        `"${(e.note   || '').replace(/"/g, '""')}"`,
    ]);
    const csv  = [headers.join(';'), ...rows.map(r => r.join(';'))].join('\r\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `smeny_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
