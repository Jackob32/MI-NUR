import React from 'react';

/* ── Date helper ──────────────────────────────────────────────────────────── */
function at(daysFromToday, hour, min = 0) {
    const d = new Date();
    d.setDate(d.getDate() + daysFromToday);
    d.setHours(hour, min, 0, 0);
    return d;
}

/* ── Users ────────────────────────────────────────────────────────────────── */
const users = [
    { id: 0, firstname: 'Pepa',   lastname: 'Novak',      worktime: 40, email: 'pepa.novak@gmail.com',        phone: '+420721001001', type: 'employee' },
    { id: 1, firstname: 'Filip',  lastname: 'Dobře',      worktime: 20, email: 'Filip.Dobre@gmail.com',       phone: '+420721001002', type: 'employee' },
    { id: 2, firstname: 'Tomáš',  lastname: 'Chrian',     worktime: 30, email: 'PChrianic@gmail.com',         phone: '+420721001003', type: 'employee' },
    { id: 3, firstname: 'Honza',  lastname: 'Správně',    worktime: 40, email: 'Spavnak@gmail.com',           phone: '+420721001004', type: 'employee' },
    { id: 4, firstname: 'Ondra',  lastname: 'Neposlecha', worktime: 20, email: 'Ondra.Novakcic@gmail.com',    phone: '+420721001005', type: 'employee' },
    { id: 5, firstname: 'Petr',   lastname: 'Novakčič',   worktime: 30, email: 'Petr.Novakcic@gmail.com',     phone: '+420721001006', type: 'employee' },
    { id: 6, firstname: 'Lucie',  lastname: 'Marková',    worktime: 20, email: 'Lucie.Markova@gmail.com',     phone: '+420721001007', type: 'employee' },
    { id: 7, firstname: 'Martin', lastname: 'Kovář',      worktime: 40, email: 'Martin.Kovar@gmail.com',      phone: '+420721001008', type: 'employee' },
    { id: 8, firstname: 'Jana',   lastname: 'Horáková',   worktime: 30, email: 'Jana.Horakova@gmail.com',     phone: '+420721001009', type: 'employee' },
    { id: 9, firstname: 'Pavel',  lastname: 'Šimánek',    worktime: 25, email: 'Pavel.Simanek@gmail.com',     phone: '+420721001010', type: 'employee' },
];

/* Interest stub – inlines firstname/lastname so the calendar can show them */
function i(userId, level) {
    const u = users[userId];
    return { email: u.email, firstname: u.firstname, lastname: u.lastname, level };
}

/* ── Events ───────────────────────────────────────────────────────────────── */
const events = [

    /* ── MINULÝ TÝDEN (uzamčeno / obsazeno) ───────────────────────────────── */
    {
        id: 0, title: 'Ranní směna',
        start: at(-7, 6), end: at(-7, 14), capacity: 3,
        note: '', locked: true,
        employees: [users[0], users[2], users[5]],
        interests: [],
    },
    {
        id: 1, title: 'Odpolední směna',
        start: at(-7, 14), end: at(-7, 22), capacity: 2,
        note: '', locked: true,
        employees: [users[1], users[3]],
        interests: [],
    },
    {
        id: 2, title: 'Ranní směna',
        start: at(-5, 6), end: at(-5, 14), capacity: 4,
        note: '', locked: true,
        employees: [users[4], users[6], users[7], users[8]],
        interests: [],
    },
    {
        id: 3, title: 'Noční směna',
        start: at(-4, 22), end: at(-3, 6), capacity: 2,
        note: 'Noční příplatek', locked: true,
        employees: [users[9], users[2]],
        interests: [],
    },
    {
        id: 4, title: 'Ranní směna',
        start: at(-3, 6), end: at(-3, 14), capacity: 3,
        note: '', locked: false,
        employees: [users[0], users[5], users[7]],
        interests: [],
    },
    {
        id: 5, title: 'Víkendová směna',
        start: at(-1, 8), end: at(-1, 16), capacity: 3,
        note: 'Víkendový provoz', locked: false,
        employees: [users[1], users[3]],
        interests: [],
    },

    /* ── DNES / ZÍTRA ─────────────────────────────────────────────────────────
       Klíčový MRV test:
         Provozní tým A (cap 2) má pouze 2 způsobilé zájemce  → slack = 0  ← NEJTĚŽŠÍ
         Provozní tým B (cap 3) má 6 způsobilých zájemců      → slack = 3  ← SNADNÉ
       Pepa a Filip jsou v zájmech obou — Greedy je přiřadí do B a A zůstane prázdné.
       MRV přiřadí Pepu a Filipa do A jako první.
    ─────────────────────────────────────────────────────────────────────────── */
    {
        id: 6,
        title: 'Provozní tým A',
        start: at(0, 8), end: at(0, 16), capacity: 2,
        note: 'Pouze 2 dostupní – MRV musí obsadit jako první',
        locked: false,
        employees: [],
        interests: [
            i(0, 'want'),       // Pepa chce
            i(1, 'can'),        // Filip může
            i(2, 'prefer_not'), // Tomáš raději ne
            i(3, 'cannot'),     // Honza nemůže
        ],
    },
    {
        id: 7,
        title: 'Provozní tým B',
        start: at(0, 8), end: at(0, 16), capacity: 3,
        note: 'Stejný čas jako Tým A – soutěží o stejné zaměstnance',
        locked: false,
        employees: [],
        interests: [
            i(0, 'want'),       // Pepa chce (ale je potřeba v Týmu A!)
            i(1, 'want'),       // Filip chce (ale je potřeba v Týmu A!)
            i(2, 'want'),       // Tomáš chce
            i(3, 'can'),        // Honza může
            i(4, 'available'),  // Ondra k dispozici
            i(7, 'available'),  // Martin k dispozici
        ],
    },
    {
        id: 8,
        title: 'Odpolední směna',
        start: at(0, 14), end: at(0, 22), capacity: 3,
        note: '',
        locked: false,
        employees: [],
        interests: [
            i(5, 'want'),       // Petr chce
            i(6, 'want'),       // Lucie chce
            i(8, 'can'),        // Jana může
            i(9, 'can'),        // Pavel může
            i(4, 'available'),  // Ondra k dispozici
        ],
    },
    {
        id: 9,
        title: 'Noční směna',
        start: at(0, 22), end: at(1, 6), capacity: 2,
        note: 'Kritická – pouze 1 zájemce na 2 místa',
        locked: false,
        employees: [],
        interests: [
            i(9, 'want'),       // Pavel chce
            i(4, 'prefer_not'), // Ondra raději ne
            i(5, 'cannot'),     // Petr nemůže
            i(6, 'cannot'),     // Lucie nemůže
        ],
    },
    {
        id: 10,
        title: 'Ranní směna',
        start: at(1, 6), end: at(1, 14), capacity: 4,
        note: '',
        locked: false,
        employees: [users[6]],  // Lucie již přiřazena
        interests: [
            i(0, 'want'),
            i(2, 'want'),
            i(5, 'can'),
            i(8, 'available'),
            i(9, 'prefer_not'),
        ],
    },
    {
        id: 11,
        title: 'Odpolední směna',
        start: at(1, 14), end: at(1, 22), capacity: 3,
        note: '',
        locked: false,
        employees: [],
        interests: [
            i(3, 'want'),
            i(7, 'want'),
            i(1, 'can'),
            i(4, 'can'),
            i(8, 'available'),
            i(6, 'prefer_not'),
        ],
    },

    /* ── PŘÍŠTÍ TÝDEN ─────────────────────────────────────────────────────── */
    {
        id: 12,
        title: 'Ranní směna',
        start: at(7, 6), end: at(7, 14), capacity: 3,
        note: '',
        locked: false,
        employees: [],
        interests: [
            i(0, 'want'),
            i(1, 'want'),
            i(5, 'can'),
            i(6, 'can'),
            i(8, 'available'),
        ],
    },
    {
        id: 13,
        title: 'Odpolední směna',
        start: at(7, 14), end: at(7, 22), capacity: 2,
        note: '',
        locked: false,
        employees: [],
        interests: [
            i(2, 'want'),
            i(3, 'can'),
            i(7, 'can'),
            i(9, 'available'),
            i(1, 'prefer_not'),
        ],
    },
    {
        id: 14,
        title: 'Ranní směna',
        start: at(8, 6), end: at(8, 14), capacity: 4,
        note: '',
        locked: false,
        employees: [],
        interests: [
            i(4, 'want'),
            i(6, 'want'),
            i(8, 'want'),
            i(0, 'can'),
            i(1, 'can'),
            i(5, 'available'),
            i(9, 'prefer_not'),
            i(3, 'cannot'),
        ],
    },
    {
        id: 15,
        title: 'Noční směna',
        start: at(8, 22), end: at(9, 6), capacity: 2,
        note: 'Noční příplatek',
        locked: false,
        employees: [],
        interests: [
            i(4, 'can'),
            i(9, 'can'),
            i(2, 'available'),
            i(7, 'prefer_not'),
            i(8, 'cannot'),
        ],
    },
    {
        id: 16,
        title: 'Víkendová směna',
        start: at(12, 8), end: at(12, 16), capacity: 3,
        note: 'Víkendový příplatek 25 %',
        locked: false,
        employees: [],
        interests: [
            i(0, 'want'),
            i(3, 'want'),
            i(5, 'want'),
            i(7, 'can'),
            i(9, 'can'),
            i(2, 'available'),
        ],
    },
];

/* ── Navigation / auth data ───────────────────────────────────────────────── */
const ManagerData = {
    tabs: [
        { value: 0, label: 'Přehled',          to: '/manager' },
        { value: 1, label: 'Nastavení',         to: '/manager/settings' },
        { value: 2, label: 'Správa uživatelů',  to: '/manager/usermanager' },
    ],
    login: { firstname: 'Jan', lastname: 'Král', email: 'jan.kral@gmail.com' },
    logout: '/login',
    switch: '/employee',
};

const EmployeeData = {
    tabs: [
        { value: 0, label: 'Přehled',   to: '/employee' },
        { value: 1, label: 'Nastavení', to: '/employee/settings' },
    ],
    login: { firstname: 'Pepa', lastname: 'Novák', email: 'pepa.novak@gmail.com' },
    logout: '/login',
    switch: '/manager',
};

const UserOptions = users.map(u => ({ value: u, label: `${u.firstname} ${u.lastname}` }));

export { events, users, ManagerData, EmployeeData, UserOptions };
