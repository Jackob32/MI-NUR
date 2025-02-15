# MI-NUR React App

## How to use

Clone the repo

Install it and run:

**Live demo:** https://jackob32.github.io/MI-NUR/

> ⚠️ **This is a frontend-only demo.** There is no backend, server, or database of any kind — all data lives in browser memory and resets on every page refresh. Authentication is simulated with hardcoded email addresses (see [Demo Credentials](#demo-credentials)). The application was built solely to explore and validate UX concepts, not for production use.

---

## Overview

The project was originally created in **2018** as part of a university UX study and has since been refreshed with modern tooling and code quality improvements while preserving the original design intent.

The application models a real-world shift scheduling system, allowing:

- **Managers** to create, edit, duplicate, lock, and delete shifts on an interactive drag-and-drop calendar
- **Employees** to browse available shifts and sign up for or withdraw from them, or express interest using a 5-level availability system

---

## Features

### Manager View

- 📅 Drag-and-drop calendar — day / week / month / agenda views
- ➕ Create shifts by clicking any time slot in the calendar
- ✏️ Edit shift title, start/end time, capacity, and notes
- 🔒 Lock or unlock all visible shifts with one click
- 🔁 Duplicate existing shifts
- 👥 Add and remove employees from a shift
- 🤖 **Auto-assign** employees to unfilled shifts (MRV, Greedy, or Even distribution algorithms)
- 🔍 Filter shifts by status with colour-coded indicators
- 🔎 Search the calendar by employee name or email
- 👤 Full user management — create, edit, and delete employee accounts
- 📊 Contracted-hours progress bar per employee

### Employee View

- 📅 Calendar with personal shift overview
- ✅ Sign up for or withdraw from available shifts with a single click
- 🗂️ **5-level interest system** — express fine-grained availability per shift
- 🔍 Filter by "My shifts", "Available shifts", and "Full shifts"
- ⚙️ Notification preference settings

### 5-Level Interest System

When Interest Mode is enabled by the manager, employees express availability rather than directly signing up:

| Level            | Symbol | Meaning                  | Auto-assign eligible |
| ---------------- | ------ | ------------------------ | -------------------- |
| Chci tuto směnu  | ★      | Wants this shift         | ✓                    |
| Mohu vzít        | ↑      | Can take it if needed    | ✓                    |
| Jsem k dispozici | ◎      | Available if no one else | ✓                    |
| Raději ne        | ↓      | Prefers not to           | ✗                    |
| Nemohu           | ✗      | Cannot take it           | ✗                    |

The calendar event tile shows live interest chip counts (e.g. ★2 ↑1 ◎3) and an amber dot when someone wants/can take a shift that isn't filled yet.

### Auto-assign Algorithms

**MRV – Minimum Remaining Values** _(recommended)_
Fills the hardest-to-fill shifts first. Calculates `slack = eligible_count − slots_needed` for every pending shift, then processes the lowest-slack shift at each step. Prevents easy shifts from "stealing" employees away from critical ones. Also balances scheduled hours across employees.

**Greedy**
Fills shifts in chronological order using priority: want → can → available.

**Rovnoměrné rozdělení (Even distribution)**
Like greedy but tie-breaks by giving preference to employees with the fewest currently scheduled hours.

### Manager Settings

- **Interest mode** — toggle between direct sign-up and the 5-level interest system
- **Assignment algorithm** — choose MRV, Greedy, or Even distribution
- **Employee visibility controls:**
  - Show/hide shift capacity (`2/5`)
  - Show/hide list of already-assigned employees
  - Show only shifts that still have open slots
- All settings persist automatically in localStorage

### Colour Legend

| Colour    | Manager view                         | Employee view                   |
| --------- | ------------------------------------ | ------------------------------- |
| 🔴 Red    | Empty shift (no employees signed up) | Fully booked — no capacity left |
| 🟠 Orange | Partially filled                     | —                               |
| 🟢 Green  | Fully staffed                        | You are signed up               |
| ⬜ Grey   | —                                    | Available — capacity remaining  |

---

## Tech Stack

| Technology                                                            | Version | Purpose                     |
| --------------------------------------------------------------------- | ------- | --------------------------- |
| [React](https://reactjs.org/)                                         | 17      | UI framework                |
| [Material-UI](https://v3.material-ui.com/)                            | v3      | Component library & theming |
| [React Big Calendar](https://jquense.github.io/react-big-calendar/)   | 0.20    | Interactive calendar        |
| [React Router](https://v5.reactrouter.com/)                           | v4      | Client-side routing         |
| [Moment.js](https://momentjs.com/)                                    | 2.29    | Date and time formatting    |
| [immutability-helper](https://github.com/kolodny/immutability-helper) | 3       | Immutable state updates     |
| [react-select](https://react-select.com/)                             | v2      | Autocomplete dropdowns      |
| [Vite](https://vitejs.dev/)                                           | 6       | Build tool & dev server     |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 20.0.0
- **npm** ≥ 9.0.0

### Installation

```bash
git clone https://github.com/Jackob32/MI-NUR.git
cd MI-NUR
npm install
npm run start
```

### Running the development server

```bash
npm start
```

The app will be available at **http://localhost:5173**

### Building for production

```bash
npm run build
```

Output goes to `dist/`.

### Deploy to GitHub Pages

```bash
npm run deploy
```

Or just push to `master` — GitHub Actions will build and deploy automatically.

---

## Demo Credentials

> 💡 **Quick start:** type one of the emails below into the login screen and click **Přihlásit se**. No real password is required.

| Role        | Email                  | What you can do                                                  |
| ----------- | ---------------------- | ---------------------------------------------------------------- |
| 👔 Manager  | `jan.kral@gmail.com`   | Create, edit, lock, delete shifts; auto-assign; manage employees |
| 🧑‍💼 Employee | `pepa.novak@gmail.com` | Browse shifts, sign up, express interest with 5-level system     |

Both accounts share the same in-memory shift data. Open two tabs to see manager actions reflected in the employee view instantly.

---

## Project Structure

```
src/
├── constants/            # Shared constants (colors, interest levels, calendar config)
│   ├── colors.js
│   ├── calendar.js
│   └── index.js
├── utils/                # Pure helper functions
│   ├── date.js           # toDatetimeLocal, formatDuration, msToHours
│   ├── csv.js            # exportShiftsToCSV
│   ├── shift.js          # computeScheduledHours, getEmployeeWorkload, overlaps
│   └── index.js
├── components/
│   ├── autocomplete/     # Searchable employee dropdown (react-select)
│   ├── calendar/         # BigCalendar wrapper, custom Toolbar and Event tile
│   ├── common/           # Reusable StatCard component
│   ├── navigation/       # Top AppBar with branding, tabs, and user avatar
│   ├── settings/         # Manager + employee settings panels
│   ├── title/            # Reusable page title component
│   └── usertable/        # Paginated employee table with contracted-hours bar
├── views/
│   ├── manager/          # Manager shell, calendar home, user manager page
│   └── employee/         # Employee shell, calendar home, notification settings
├── pages/
│   └── login.jsx         # Login page
├── data.jsx              # Demo data — 10 users, 17 shifts with realistic interests
├── storage.js            # localStorage helpers (events, users, settings)
├── functions.jsx         # Re-export shim for utils/
├── styles.jsx            # Shared JSS style definitions
├── theme.jsx             # Material-UI theme
└── withRoot.jsx          # Theme provider HOC
```

---

## Course Context

This project was developed for the **MI-NUR** course (_Návrh Uživatelského Rozhraní_ — User Interface Design) at [ČVUT FIT](https://fit.cvut.cz/). The primary course deliverables were:

1. **User requirements analysis** — identifying stakeholder needs through interviews and use-case modelling
2. **UX prototyping** — designing and iterating interaction flows for both manager and employee roles
3. **Functional demo** — a React prototype close enough to a real product to be validated with test users

---

## License

This project is licensed under the **MIT License**.

---

\_Originally created 2018 · Refreshed 2024–2025
