import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import './Cal.css';
import withRoot from '../../withRoot';
import styles from '../../styles';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import { events, users as rows, UserOptions } from '../../data';
import FormControl from '@material-ui/core/FormControl';
import Usertable from '../usertable/Usertable';
import Autocomplete from '../autocomplete/Autocomplete';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';
import orange from '@material-ui/core/colors/orange';
import grey from '@material-ui/core/colors/grey';
import Toolbar from './Toolbar';
import Event from './Event';
import update from 'immutability-helper';
import 'typeface-roboto';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import {
  toDatetimeLocal,
  exportShiftsToCSV,
  formatDuration,
} from '../../functions';
import {
  SHIFT_COLORS,
  INTEREST_LABELS,
  INTEREST_COLORS,
  INTEREST_BUTTON_OPTIONS,
  INTEREST_PRIORITY,
  WEEK_MS,
} from '../../constants/calendar';
import { saveEvents, loadEvents, loadUsers } from '../../storage';
import FormControlLabel from '@material-ui/core/FormControlLabel/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox/Checkbox';
import FormGroup from '@material-ui/core/FormGroup/FormGroup';
import Lock from '@material-ui/icons/Lock';
import LockOpen from '@material-ui/icons/LockOpen';
import Typography from '@material-ui/core/Typography/Typography';
import SnackbarContent from '@material-ui/core/SnackbarContent/SnackbarContent';
import IconButton from '@material-ui/core/IconButton/IconButton';
import classNames from 'classnames';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import amber from '@material-ui/core/colors/amber';
import WarningIcon from '@material-ui/icons/Warning';
import Snackbar from '@material-ui/core/Snackbar/Snackbar';
import GetApp from '@material-ui/icons/GetApp';
import FileCopy from '@material-ui/icons/FileCopy';
import 'moment/locale/cs';

moment.locale('cs');

/* ─── Snackbar component ────────────────────────────────────────────────────── */
const styles1 = (theme) => ({
  success: { backgroundColor: green[600] },
  error: { backgroundColor: theme.palette.error.dark },
  info: { backgroundColor: theme.palette.primary.dark },
  warning: { backgroundColor: amber[700] },
  icon: { fontSize: 20 },
  iconVariant: { opacity: 0.9, marginRight: theme.spacing.unit },
  message: { display: 'flex', alignItems: 'center' },
});
const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

function MySnackbarContent(props) {
  const { classes, className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];
  return (
    <SnackbarContent
      className={classNames(classes[variant], className)}
      aria-describedby='client-snackbar'
      message={
        <span id='client-snackbar' className={classes.message}>
          <Icon className={classNames(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton
          key='close'
          aria-label='Close'
          color='inherit'
          className={classes.close}
          onClick={onClose}
        >
          <CloseIcon className={classes.icon} />
        </IconButton>,
      ]}
      {...other}
    />
  );
}
const MySnackbarContentWrapper = withStyles(styles1)(MySnackbarContent);

/* ─── Calendar setup ────────────────────────────────────────────────────────── */
const localizer = BigCalendar.momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(BigCalendar);

/* ─── Colours / labels imported from src/constants/calendar.js ──────────────── */

class Cal extends Component {
  /* ── Lifecycle ──────────────────────────────────────────────────────────── */
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  /* ── Keyboard shortcuts ─────────────────────────────────────────────────── */
  handleKeyDown = (e) => {
    const tag = e.target && e.target.tagName;
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return;

    if (e.key === 'Escape') {
      if (this.state.isLockWarningOpen) {
        this.setState({ isLockWarningOpen: false });
        return;
      }
      if (this.state.isShiftDetailOpen) {
        this.setState({ isShiftDetailOpen: false });
        return;
      }
      if (this.state.isConfirmDeleteOpen) {
        this.setState({ isConfirmDeleteOpen: false });
        return;
      }
      if (this.state.isEditModalOpen) {
        this.handleClose();
        return;
      }
      if (this.state.isCreateModalOpen) {
        this.handleCreateClose();
        return;
      }
    }
    if (
      e.key === 'n' &&
      this.props.auth === 'manager' &&
      !this.state.isEditModalOpen &&
      !this.state.isCreateModalOpen
    ) {
      e.preventDefault();
      const now = new Date();
      const start = new Date(now);
      start.setMinutes(0, 0, 0);
      const end = new Date(start);
      end.setHours(end.getHours() + 1);
      this.setState({ isCreateModalOpen: true, pendingSlot: { start, end } });
    }
  };

  /* ── Snackbar helpers ───────────────────────────────────────────────────── */
  openSuccess = (text) =>
    this.setState({ openSuccess: true, SuccessText: text });
  openUndo = (text) => this.setState({ openUndo: true, UndoText: text });
  openError = (text) => this.setState({ openError: true, ErrorText: text });

  handleSnackClose = () =>
    this.setState({ openSuccess: false, openUndo: false, openError: false });

  /* ── Conflict detection ─────────────────────────────────────────────────── */
  getDoubleBookedEmployees(start, end, excludeId, employees) {
    const conflicts = [];
    this.state.events.forEach((e) => {
      if (e.id === excludeId) return;
      if (
        new Date(e.start) < new Date(end) &&
        new Date(e.end) > new Date(start)
      ) {
        employees.forEach((emp) => {
          if (e.employees.some((ee) => ee.id === emp.id)) conflicts.push(emp);
        });
      }
    });
    return conflicts;
  }

  /* ── Slot selection (create) ────────────────────────────────────────────── */
  handleSelect = ({ start, end }) => {
    if (this.props.auth === 'manager') {
      this.setState({ isCreateModalOpen: true, pendingSlot: { start, end } });
    }
  };

  handleCreateChange = (prop) => (event) =>
    this.setState({ [prop]: event.target.value });

  handleCreateClose = () =>
    this.setState({
      isCreateModalOpen: false,
      newShiftTitle: '',
      newShiftCapacity: '',
      pendingSlot: null,
      newShiftRepeat: false,
      newShiftRepeatWeeks: 1,
    });

  handleCreate = () => {
    const {
      newShiftTitle,
      newShiftCapacity,
      pendingSlot,
      newShiftColor,
      newShiftRepeat,
      newShiftRepeatWeeks,
    } = this.state;
    const capacity = parseInt(newShiftCapacity, 10);
    if (!newShiftTitle || !capacity || capacity < 1) return;
    if (
      pendingSlot &&
      new Date(pendingSlot.start) >= new Date(pendingSlot.end)
    ) {
      this.openError('Začátek směny musí být před koncem.');
      return;
    }
    const baseEvent = {
      id: this.state.idcnt + 1,
      start: pendingSlot.start,
      end: pendingSlot.end,
      title: newShiftTitle,
      capacity,
      note: '',
      locked: false,
      employees: [],
      interests: [],
      color: newShiftColor || null,
    };

    const WEEK = WEEK_MS;
    const eventsToAdd = [baseEvent];
    const repeatWeeks = newShiftRepeat
      ? Math.max(1, Math.min(12, parseInt(newShiftRepeatWeeks, 10) || 1))
      : 1;
    for (let w = 1; w < repeatWeeks; w++) {
      eventsToAdd.push({
        ...baseEvent,
        id: baseEvent.id + w,
        start: new Date(baseEvent.start.getTime() + w * WEEK),
        end: new Date(baseEvent.end.getTime() + w * WEEK),
      });
    }

    this.setState(
      (prevState) => ({
        firstevent: false,
        isCreateModalOpen: false,
        newShiftTitle: '',
        newShiftCapacity: '',
        newShiftColor: null,
        newShiftRepeat: false,
        newShiftRepeatWeeks: 1,
        pendingSlot: null,
        events: [...prevState.events, ...eventsToAdd],
        idcnt: baseEvent.id + (repeatWeeks - 1),
      }),
      () => saveEvents(this.state.events),
    );
    this.openSuccess(
      repeatWeeks > 1
        ? `Vytvořeno ${repeatWeeks} opakujících se směn`
        : 'Byla vložena nová směna',
    );
  };

  /* ── Edit dialog ────────────────────────────────────────────────────────── */
  handleClickOpen = (e) => {
    const index = this.state.events.findIndex((x) => x.id === e.id);
    if (this.props.auth === 'manager') {
      const dialoginfo = { ...this.state.events[index] };
      this.setState({ isEditModalOpen: true, dialoginfo });
    }
  };

  handleClose = () => this.setState({ isEditModalOpen: false });

  handleSearchChange = (value) => this.setState({ searchEmployee: value });

  handleAdd = () => {
    if (this.state.searchEmployee && this.state.searchEmployee.value) {
      const user = this.state.searchEmployee.value;
      if (this.state.dialoginfo.employees.some((e) => e.email === user.email)) {
        this.openError('Tento zaměstnanec je již přiřazen k této směně.');
        return;
      }
      this.setState({
        searchEmployee: '',
        dialoginfo: {
          ...this.state.dialoginfo,
          employees: [...this.state.dialoginfo.employees, user],
        },
      });
    }
  };

  handleDuplicate = () => {
    const index = this.state.events.findIndex(
      (x) => x.id === this.state.dialoginfo.id,
    );
    const newId = this.state.idcnt + 1;
    const duplicate = {
      ...this.state.events[index],
      id: newId,
      employees: [],
      interests: [],
    };
    this.setState(
      (prevState) => ({
        firstevent: false,
        idcnt: newId,
        events: [...prevState.events, duplicate],
      }),
      () => saveEvents(this.state.events),
    );
    this.handleClose();
    this.openSuccess(`Směna ${duplicate.title} byla zduplikována`);
  };

  /* ── Copy shift to next week (#17) ──────────────────────────────────────── */
  handleCopyNextWeek = () => {
    const ev = this.state.dialoginfo;
    const newId = this.state.idcnt + 1;
    const WEEK = 7 * 24 * 60 * 60 * 1000;
    const copied = {
      ...ev,
      id: newId,
      start: new Date(new Date(ev.start).getTime() + WEEK),
      end: new Date(new Date(ev.end).getTime() + WEEK),
      employees: [],
      interests: [],
      locked: false,
    };
    this.setState(
      (prevState) => ({ events: [...prevState.events, copied], idcnt: newId }),
      () => saveEvents(this.state.events),
    );
    this.handleClose();
    this.openSuccess('Směna zkopírována na příští týden');
  };

  /* ── Bulk copy current week ──────────────────────────────────────────────── */
  handleBulkCopyWeek = () => {
    const { currentDate, currentView } = this.state;
    let start, end;
    if (currentView === 'week') {
      start = moment(currentDate).startOf('isoWeek').toDate();
      end = moment(currentDate).endOf('isoWeek').toDate();
    } else if (currentView === 'day') {
      start = moment(currentDate).startOf('day').toDate();
      end = moment(currentDate).endOf('day').toDate();
    } else {
      start = moment(currentDate).startOf('month').toDate();
      end = moment(currentDate).endOf('month').toDate();
    }

    const toCopy = this.state.events.filter(
      (e) => new Date(e.start) >= start && new Date(e.start) <= end,
    );
    if (toCopy.length === 0) {
      this.openError('Žádné směny k zkopírování v aktuálním zobrazení.');
      return;
    }

    const WEEK = WEEK_MS;
    let nextId = this.state.idcnt;
    const copies = toCopy.map((ev) => ({
      ...ev,
      id: ++nextId,
      start: new Date(new Date(ev.start).getTime() + WEEK),
      end: new Date(new Date(ev.end).getTime() + WEEK),
      employees: [],
      interests: [],
      locked: false,
    }));

    this.setState(
      (prevState) => ({
        events: [...prevState.events, ...copies],
        idcnt: nextId,
      }),
      () => saveEvents(this.state.events),
    );
    this.openSuccess(`Zkopírováno ${copies.length} směn na příští týden`);
  };

  handleSubmit = () => {
    const { dialoginfo } = this.state;
    if (new Date(dialoginfo.start) >= new Date(dialoginfo.end)) {
      this.openError('Začátek směny musí být před koncem.');
      return;
    }
    const conflicts = this.getDoubleBookedEmployees(
      dialoginfo.start,
      dialoginfo.end,
      dialoginfo.id,
      dialoginfo.employees,
    );
    if (conflicts.length > 0) {
      const names = conflicts
        .map((c) => `${c.firstname} ${c.lastname}`)
        .join(', ');
      this.openError(`Varování: ${names} má překrývající se směnu.`);
    }
    const index = this.state.events.findIndex((x) => x.id === dialoginfo.id);
    this.setState(
      (prevState) => ({
        events: update(prevState.events, { [index]: { $set: dialoginfo } }),
      }),
      () => saveEvents(this.state.events),
    );
    this.handleClose();
  };

  handleUserDelete = (x) => {
    const index = this.state.dialoginfo.employees.findIndex(
      (item) => item.id === x,
    );
    const array = [...this.state.dialoginfo.employees];
    array.splice(index, 1);
    this.setState({
      dialoginfo: { ...this.state.dialoginfo, employees: array },
    });
    this.openUndo('Odstranili jste uživatele ze směny');
  };

  handleDialogChange = (prop) => (event) => {
    let val = event.target.value;
    if (val === 'false') val = false;
    if (val === 'true') val = true;
    if (event.target.type === 'datetime-local') val = new Date(val);
    this.setState((prevState) => ({
      dialoginfo: { ...prevState.dialoginfo, [prop]: val },
    }));
  };

  /* ── Confirm delete (#10) ───────────────────────────────────────────────── */
  handleDelete = () => this.setState({ isConfirmDeleteOpen: true });

  confirmDelete = () => {
    const index = this.state.events.findIndex(
      (x) => x.id === this.state.dialoginfo.id,
    );
    const array = [...this.state.events];
    const [removed] = array.splice(index, 1);
    this.setState(
      {
        events: array,
        lastDeletedEvent: removed,
        lastDeletedIndex: index,
        isConfirmDeleteOpen: false,
      },
      () => saveEvents(this.state.events),
    );
    this.handleClose();
    this.openUndo(`Směna "${removed.title}" byla smazána`);
  };

  /* ── Functional undo (#2) ───────────────────────────────────────────────── */
  handleUndoDelete = () => {
    const { lastDeletedEvent, lastDeletedIndex } = this.state;
    if (lastDeletedEvent !== null) {
      const evts = [...this.state.events];
      evts.splice(lastDeletedIndex, 0, lastDeletedEvent);
      this.setState(
        {
          events: evts,
          lastDeletedEvent: null,
          lastDeletedIndex: -1,
          openUndo: false,
        },
        () => saveEvents(this.state.events),
      );
    } else {
      this.setState({ openUndo: false });
    }
  };

  /* ── Employee: click shift ──────────────────────────────────────────────── */
  handleEmployeeShiftClick = (event) => {
    if (this.props.interestMode) {
      this.setState({ isShiftDetailOpen: true, shiftDetailEvent: event });
    } else {
      this.addUserToEvent(event);
    }
  };

  /* ── Employee: express interest ─────────────────────────────────────────── */
  handleExpressInterest = (level) => {
    const e = this.state.shiftDetailEvent;
    if (!e) return;
    const evIdx = this.state.events.findIndex((x) => x.id === e.id);
    if (evIdx < 0) return;
    const currentEvent = this.state.events[evIdx];
    const myEmail = this.props.searchEmployee;
    const myUser =
      loadUsers(rows).find((u) => u.email === myEmail) ||
      rows.find((u) => u.email === myEmail);
    if (!myUser) return;

    const existingIdx = (currentEvent.interests || []).findIndex(
      (i) => i.email === myEmail,
    );
    let newInterests;
    if (level === null) {
      newInterests = (currentEvent.interests || []).filter(
        (i) => i.email !== myEmail,
      );
    } else if (existingIdx >= 0) {
      newInterests = [...(currentEvent.interests || [])];
      newInterests[existingIdx] = { ...newInterests[existingIdx], level };
    } else {
      newInterests = [
        ...(currentEvent.interests || []),
        {
          email: myEmail,
          firstname: myUser.firstname,
          lastname: myUser.lastname,
          level,
        },
      ];
    }

    const updatedEvents = update(this.state.events, {
      [evIdx]: { interests: { $set: newInterests } },
    });
    this.setState({ events: updatedEvents, isShiftDetailOpen: false }, () =>
      saveEvents(this.state.events),
    );
    const msgs = {
      want: 'Zájem o směnu byl uložen ✓',
      ok: 'Dostupnost byla uložena',
      no: 'Nedostupnost byla uložena',
    };
    this.openSuccess(level ? msgs[level] : 'Zájem byl odebrán');
  };

  /* ── Employee: enroll / unenroll (#16 capacity enforcement) ────────────── */
  addUserToEvent = (e) => {
    if (e.locked) {
      this.openError('Tato směna je uzamčena.');
      return;
    }
    const eventIndex = this.state.events.findIndex((x) => x.id === e.id);
    const currentEvent = this.state.events[eventIndex];
    const isEnrolled = currentEvent.employees.some(
      (emp) => emp.email === this.props.searchEmployee,
    );

    if (isEnrolled) {
      const updatedEmployees = currentEvent.employees.filter(
        (emp) => emp.email !== this.props.searchEmployee,
      );
      this.setState(
        {
          firstevent: false,
          events: update(this.state.events, {
            [eventIndex]: { employees: { $set: updatedEmployees } },
          }),
        },
        () => saveEvents(this.state.events),
      );
      this.openSuccess('Odhlásili jste se ze směny');
    } else if (currentEvent.employees.length < currentEvent.capacity) {
      const user = rows.find((x) => x.email === this.props.searchEmployee);
      if (!user) return;
      this.setState(
        {
          firstevent: false,
          events: update(this.state.events, {
            [eventIndex]: { employees: { $push: [user] } },
          }),
        },
        () => saveEvents(this.state.events),
      );
      this.openSuccess('Přihlásili jste se na směnu');
    } else {
      this.openError('Směna je plně obsazena.');
    }
  };

  /* ── Manager: assign from interest list ─────────────────────────────────── */
  handleAssignFromInterest = (email) => {
    const currentUsers = loadUsers(rows);
    const user =
      currentUsers.find((u) => u.email === email) ||
      rows.find((u) => u.email === email);
    if (!user) return;
    const event = this.state.dialoginfo;
    if (event.employees.some((e) => e.email === email)) {
      this.openError('Tento zaměstnanec je již přiřazen.');
      return;
    }
    if (event.employees.length >= event.capacity) {
      this.openError('Směna je plně obsazena.');
      return;
    }
    const conflicts = this.getDoubleBookedEmployees(
      event.start,
      event.end,
      event.id,
      [user],
    );
    if (conflicts.length > 0) {
      this.openError(
        `${user.firstname} ${user.lastname} má překrývající se směnu.`,
      );
      return;
    }
    this.setState((prevState) => ({
      dialoginfo: {
        ...prevState.dialoginfo,
        employees: [...prevState.dialoginfo.employees, user],
      },
    }));
    this.openSuccess(`${user.firstname} ${user.lastname} přidán/a`);
  };

  /* ── Manager: clear interests ────────────────────────────────────────────── */
  handleClearInterests = () => {
    const evIdx = this.state.events.findIndex(
      (x) => x.id === this.state.dialoginfo.id,
    );
    if (evIdx >= 0) {
      this.setState(
        (prevState) => ({
          events: update(prevState.events, {
            [evIdx]: { interests: { $set: [] } },
          }),
          dialoginfo: { ...prevState.dialoginfo, interests: [] },
        }),
        () => saveEvents(this.state.events),
      );
    }
    this.openSuccess('Zájmy směny byly vymazány');
  };

  /* ── Auto-assign single shift ────────────────────────────────────────────── */
  handleAutoAssignShift = (mode) => {
    const evIdx = this.state.events.findIndex(
      (x) => x.id === this.state.dialoginfo.id,
    );
    if (evIdx < 0) return;
    const event = this.state.dialoginfo;
    if (event.locked) {
      this.openError('Směna je uzamčena.');
      return;
    }

    const currentUsers = loadUsers(rows);
    const currentHours =
      mode === 'balanced' ? this._computeScheduledHours() : null;

    const interested = [...(event.interests || [])]
      .filter((i) => (INTEREST_PRIORITY[i.level] || 99) < 99)
      .sort((a, b) => {
        const hourDiff = currentHours
          ? (currentHours[a.email] || 0) - (currentHours[b.email] || 0)
          : 0;
        const prioA = INTEREST_PRIORITY[a.level] ?? 99;
        const prioB = INTEREST_PRIORITY[b.level] ?? 99;
        if (prioA !== prioB) return prioA - prioB;
        return hourDiff;
      });

    const assigned = [...event.employees];
    for (const interest of interested) {
      if (assigned.length >= event.capacity) break;
      if (assigned.some((a) => a.email === interest.email)) continue;
      const isDoubleBooked = this.state.events.some((e) => {
        if (e.id === event.id) return false;
        if (
          new Date(e.start) >= new Date(event.end) ||
          new Date(e.end) <= new Date(event.start)
        )
          return false;
        return e.employees.some((emp) => emp.email === interest.email);
      });
      if (isDoubleBooked) continue;
      const user =
        currentUsers.find((u) => u.email === interest.email) ||
        rows.find((u) => u.email === interest.email);
      if (user) assigned.push(user);
    }

    const updatedEvents = update(this.state.events, {
      [evIdx]: { employees: { $set: assigned } },
    });
    this.setState(
      {
        events: updatedEvents,
        dialoginfo: { ...event, employees: assigned },
      },
      () => saveEvents(this.state.events),
    );
    this.openSuccess(
      `Přiřazeno ${assigned.length - event.employees.length} zaměstnanců`,
    );
  };

  /* ── Auto-assign all visible shifts ─────────────────────────────────────── */
  handleAutoAssignAll = (mode) => {
    const currentUsers = loadUsers(rows);
    const currentHours =
      mode === 'balanced' ? this._computeScheduledHours() : null;

    const sorted = [...this.state.events]
      .filter(
        (e) =>
          !e.locked &&
          e.interests &&
          e.interests.some((i) => (INTEREST_PRIORITY[i.level] || 99) < 99),
      )
      .sort((a, b) => new Date(a.start) - new Date(b.start));

    if (sorted.length === 0) {
      this.openError('Žádné směny se zájmy k přiřazení.');
      return;
    }

    let updatedEvents = [...this.state.events];
    let assignedCount = 0;

    sorted.forEach((ev) => {
      const evIdx = updatedEvents.findIndex((e) => e.id === ev.id);
      if (evIdx < 0) return;
      const event = updatedEvents[evIdx];

      const interested = [...(event.interests || [])]
        .filter((i) => (INTEREST_PRIORITY[i.level] || 99) < 99)
        .sort((a, b) => {
          const prioA = INTEREST_PRIORITY[a.level] ?? 99;
          const prioB = INTEREST_PRIORITY[b.level] ?? 99;
          if (prioA !== prioB) return prioA - prioB;
          if (currentHours)
            return (currentHours[a.email] || 0) - (currentHours[b.email] || 0);
          return 0;
        });

      const assigned = [...event.employees];
      const eventDuration =
        (new Date(event.end) - new Date(event.start)) / 3600000;

      for (const interest of interested) {
        if (assigned.length >= event.capacity) break;
        if (assigned.some((a) => a.email === interest.email)) continue;
        const isDoubleBooked = updatedEvents.some((e) => {
          if (e.id === event.id) return false;
          if (
            new Date(e.start) >= new Date(event.end) ||
            new Date(e.end) <= new Date(event.start)
          )
            return false;
          return e.employees.some((emp) => emp.email === interest.email);
        });
        if (isDoubleBooked) continue;
        const user =
          currentUsers.find((u) => u.email === interest.email) ||
          rows.find((u) => u.email === interest.email);
        if (!user) continue;
        assigned.push(user);
        if (currentHours)
          currentHours[interest.email] =
            (currentHours[interest.email] || 0) + eventDuration;
        assignedCount++;
      }

      updatedEvents = update(updatedEvents, {
        [evIdx]: { employees: { $set: assigned } },
      });
    });

    this.setState({ events: updatedEvents }, () =>
      saveEvents(this.state.events),
    );
    this.openSuccess(
      `Auto-přiřazení: ${assignedCount} přiřazení v ${sorted.length} směnách`,
    );
  };

  /* ── MRV: fill hardest-to-fill shifts first ─────────────────────────────
       For each iteration pick the shift whose (eligible − slots_needed) is
       smallest (most constrained). This prevents easy shifts from consuming
       employees that the constrained shifts critically depend on.
    ────────────────────────────────────────────────────────────────────────── */
  handleAutoAssignMRV = () => {
    const currentUsers = loadUsers(rows);
    const currentHours = this._computeScheduledHours();

    const candidates = this.state.events.filter(
      (e) =>
        !e.locked &&
        (e.interests || []).some(
          (i) => (INTEREST_PRIORITY[i.level] ?? 99) < 99,
        ),
    );

    if (candidates.length === 0) {
      this.openError('Žádné směny se zájmy k přiřazení.');
      return;
    }

    /* Working copy of assignments (mutated as we proceed) */
    const assignedMap = {};
    this.state.events.forEach((e) => {
      assignedMap[e.id] = [...e.employees];
    });

    /* Is email already committed to an overlapping shift? */
    const isDoubleBooked = (email, evId, evStart, evEnd) => {
      for (const otherId of Object.keys(assignedMap)) {
        if (Number(otherId) === evId) continue;
        if (!assignedMap[otherId].some((a) => a.email === email)) continue;
        const other = this.state.events.find((x) => x.id === Number(otherId));
        if (!other) continue;
        if (
          new Date(other.start) < new Date(evEnd) &&
          new Date(other.end) > new Date(evStart)
        )
          return true;
      }
      return false;
    };

    const getEligible = (ev) => {
      const already = assignedMap[ev.id] || [];
      return (ev.interests || []).filter((i) => {
        if ((INTEREST_PRIORITY[i.level] ?? 99) >= 99) return false;
        if (already.some((a) => a.email === i.email)) return false;
        if (isDoubleBooked(i.email, ev.id, ev.start, ev.end)) return false;
        return true;
      });
    };

    const pending = new Set(candidates.map((e) => e.id));
    let assignedCount = 0;

    while (pending.size > 0) {
      /* Find the most-constrained pending shift */
      let pick = null;
      let minSlack = Infinity;

      for (const evId of pending) {
        const ev = this.state.events.find((e) => e.id === evId);
        if (!ev) {
          pending.delete(evId);
          continue;
        }

        const slotsNeeded = Math.max(
          0,
          ev.capacity - (assignedMap[evId] || []).length,
        );
        if (slotsNeeded === 0) {
          pending.delete(evId);
          continue;
        }

        const eligible = getEligible(ev);
        const slack = eligible.length - slotsNeeded;

        if (
          pick === null ||
          slack < minSlack ||
          (slack === minSlack && new Date(ev.start) < new Date(pick.ev.start))
        ) {
          pick = { ev, eligible, slotsNeeded };
          minSlack = slack;
        }
      }

      if (!pick) break;
      pending.delete(pick.ev.id);

      const { ev, eligible, slotsNeeded } = pick;
      const duration = (new Date(ev.end) - new Date(ev.start)) / 3600000;

      /* Sort eligible: priority first, then fewest hours (balanced within tier) */
      const sorted = [...eligible].sort((a, b) => {
        const pa = INTEREST_PRIORITY[a.level] ?? 99;
        const pb = INTEREST_PRIORITY[b.level] ?? 99;
        if (pa !== pb) return pa - pb;
        return (currentHours[a.email] || 0) - (currentHours[b.email] || 0);
      });

      for (const interest of sorted.slice(0, slotsNeeded)) {
        const user =
          currentUsers.find((u) => u.email === interest.email) ||
          rows.find((u) => u.email === interest.email);
        if (!user) continue;
        assignedMap[ev.id].push(user);
        currentHours[interest.email] =
          (currentHours[interest.email] || 0) + duration;
        assignedCount++;
      }
    }

    /* Commit to state */
    let updatedEvents = [...this.state.events];
    for (const evId of Object.keys(assignedMap)) {
      const evIdx = updatedEvents.findIndex((e) => e.id === Number(evId));
      if (evIdx < 0) continue;
      updatedEvents = update(updatedEvents, {
        [evIdx]: { employees: { $set: assignedMap[evId] } },
      });
    }

    this.setState({ events: updatedEvents }, () =>
      saveEvents(this.state.events),
    );
    this.openSuccess(
      `MRV: přiřazeno ${assignedCount} zaměstnanců v ${candidates.length} směnách`,
    );
  };

  _computeScheduledHours = () => {
    const hours = {};
    this.state.events.forEach((e) => {
      const h = (new Date(e.end) - new Date(e.start)) / 3600000;
      (e.employees || []).forEach((emp) => {
        hours[emp.email] = (hours[emp.email] || 0) + h;
      });
    });
    return hours;
  };

  /* ── Lock / unlock with count (#19) ────────────────────────────────────── */
  manageLock = (lock) => {
    let start, end;
    const date = this.state.currentDate;
    const view = this.state.currentView;

    if (view === 'day') {
      start = moment(date).startOf('day');
      end = moment(date).endOf('day');
    } else if (view === 'week') {
      start = moment(date).startOf('isoWeek');
      end = moment(date).endOf('isoWeek');
    } else if (view === 'month') {
      start = moment(date).startOf('month').subtract(7, 'days');
      end = moment(date).endOf('month').add(7, 'days');
    } else {
      start = moment(date).startOf('day');
      end = moment(date).endOf('day').add(1, 'month');
    }

    const count = this.state.events.filter(
      (ev) => ev.start >= start && ev.end <= end,
    ).length;

    this.setState(
      (prevState) => ({
        events: prevState.events.map((ev) =>
          ev.start >= start && ev.end <= end ? { ...ev, locked: lock } : ev,
        ),
      }),
      () => saveEvents(this.state.events),
    );
    return count;
  };

  handleLock = () => {
    const { currentDate, currentView } = this.state;
    let start, end;
    if (currentView === 'day') {
      start = moment(currentDate).startOf('day').toDate();
      end = moment(currentDate).endOf('day').toDate();
    } else if (currentView === 'week') {
      start = moment(currentDate).startOf('isoWeek').toDate();
      end = moment(currentDate).endOf('isoWeek').toDate();
    } else {
      start = moment(currentDate).startOf('month').toDate();
      end = moment(currentDate).endOf('month').toDate();
    }

    const understaffed = this.state.events.filter(
      (ev) =>
        new Date(ev.start) >= start &&
        new Date(ev.start) <= end &&
        ev.capacity > 0 &&
        ev.employees.length < ev.capacity * 0.5,
    ).length;

    if (understaffed > 0) {
      this.setState({
        isLockWarningOpen: true,
        lockWarningUnderstaffed: understaffed,
      });
    } else {
      const count = this.manageLock(true);
      this.openSuccess(`Uzamčeno ${count} směn`);
    }
  };

  confirmLock = () => {
    const count = this.manageLock(true);
    this.setState({ isLockWarningOpen: false });
    this.openSuccess(`Uzamčeno ${count} směn`);
  };

  handleOpen = () => {
    const count = this.manageLock(false);
    this.openSuccess(`Odemčeno ${count} směn`);
  };

  /* ── Drag/resize ────────────────────────────────────────────────────────── */
  resizeEvent = ({ event, start, end }) => {
    const nextEvents = this.state.events.map((ev) =>
      ev.id === event.id ? { ...ev, start, end } : ev,
    );
    this.setState({ events: nextEvents }, () => saveEvents(this.state.events));
  };

  moveEvent = ({ event, start, end, isAllDay: droppedOnAllDaySlot }) => {
    const allDay =
      event.allDay && !droppedOnAllDaySlot
        ? false
        : !event.allDay && droppedOnAllDaySlot
          ? true
          : event.allDay;
    const nextEvents = [...this.state.events];
    nextEvents.splice(nextEvents.indexOf(event), 1, {
      ...event,
      start,
      end,
      allDay,
    });
    this.setState({ events: nextEvents }, () => saveEvents(this.state.events));
  };

  /* ── Event colour (#7 custom colors) ───────────────────────────────────── */
  eventStyleGetter = (event, start, end, isSelected) => {
    let backgroundColor;

    if (event.color) {
      backgroundColor = event.color;
    } else if (this.props.auth === 'manager') {
      if (event.employees.length === event.capacity)
        backgroundColor = green[500];
      else if (
        event.employees.length === 0 ||
        event.employees.length > event.capacity
      )
        backgroundColor = red[500];
      else backgroundColor = orange[500];
    } else {
      if (this.props.interestMode) {
        const myEmail = this.props.searchEmployee;
        const myInterest = (event.interests || []).find(
          (i) => i.email === myEmail,
        );
        if (event.employees.some((e) => e.email === myEmail)) {
          backgroundColor = green[600];
        } else if (myInterest) {
          const lvl = myInterest.level;
          if (lvl === 'want') backgroundColor = '#059669';
          else if (lvl === 'can') backgroundColor = '#0284C7';
          else if (lvl === 'available') backgroundColor = '#6B7280';
          else if (lvl === 'prefer_not') backgroundColor = amber[700];
          else backgroundColor = '#94A3B8';
        } else {
          backgroundColor = grey[500];
        }
      } else {
        backgroundColor = grey[500];
        if (isSelected) backgroundColor = grey[700];
        if (event.employees.length >= event.capacity) {
          backgroundColor = red[500];
          if (isSelected) backgroundColor = red[700];
        }
        if (
          event.employees.filter((e) => e.email === this.props.searchEmployee)
            .length > 0
        ) {
          backgroundColor = green[500];
          if (isSelected) backgroundColor = green[700];
        }
      }
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        color: 'white',
        border: '6px',
      },
    };
  };

  /* ── Constructor ────────────────────────────────────────────────────────── */
  constructor(props) {
    super(props);
    this.state = {
      events: loadEvents(events),
      firstevent: true,
      openSuccess: false,
      SuccessText: '',
      openUndo: false,
      UndoText: '',
      openError: false,
      ErrorText: '',
      dialoginfo: {
        id: 0,
        title: 'Volne',
        start: new Date(new Date().setHours(new Date().getHours() - 3)),
        end: new Date(new Date().setHours(new Date().getHours() + 3)),
        capacity: 5,
        note: '',
        employees: [],
        interests: [],
        color: null,
      },
      currentDate: new Date(),
      currentView: 'week',
      idcnt: events.length,
      isCreateModalOpen: false,
      newShiftTitle: '',
      newShiftCapacity: '',
      newShiftColor: null,
      newShiftRepeat: false,
      newShiftRepeatWeeks: 1,
      pendingSlot: null,
      isEditModalOpen: false,
      isConfirmDeleteOpen: false,
      isShiftDetailOpen: false,
      shiftDetailEvent: null,
      isLockWarningOpen: false,
      lockWarningUnderstaffed: 0,
      lastDeletedEvent: null,
      lastDeletedIndex: -1,
      searchEmployee: '',
    };
    if (this.props.bell === true) this.bell = true;
  }

  EventAgenda({ event }) {
    return (
      <span>
        <strong style={{ color: 'white' }}>{event.title}</strong>
        {event.note !== '' && (
          <p style={{ borderTop: '1px solid white' }}>{event.note}</p>
        )}
      </span>
    );
  }

  render() {
    const { classes } = this.props;

    /* ── Visibility flags for employee view ───────────────────────────── */
    const isEmployee = this.props.auth !== 'manager';
    const showCapacity =
      !isEmployee || this.props.employeeShowCapacity !== false;
    const showAssignees =
      !isEmployee || this.props.employeeShowAssignees !== false;

    /* ── Filter visible events ─────────────────────────────────────────── */
    const now = new Date();
    let showEvents = [];
    if (this.props.auth === 'manager') {
      if (this.props.freeshifts)
        showEvents = showEvents.concat(
          this.state.events.filter((e) => e.employees.length === 0),
        );
      if (this.props.partialshifts)
        showEvents = showEvents.concat(
          this.state.events.filter(
            (e) => e.capacity > e.employees.length && e.employees.length !== 0,
          ),
        );
      if (this.props.fullshifts)
        showEvents = showEvents.concat(
          this.state.events.filter((e) => e.capacity <= e.employees.length),
        );
      if (this.props.searchEmployee !== '') {
        showEvents = showEvents.filter((e) =>
          e.employees.some(
            (emp) =>
              emp.firstname.includes(this.props.searchEmployee) ||
              emp.lastname.includes(this.props.searchEmployee) ||
              (emp.firstname + ' ' + emp.lastname).includes(
                this.props.searchEmployee,
              ) ||
              emp.email.includes(this.props.searchEmployee),
          ),
        );
      }
    }
    if (this.props.auth === 'employee') {
      const myEmail = this.props.searchEmployee;
      const collected = [];
      if (this.props.partialshifts)
        collected.push(
          ...this.state.events.filter((e) =>
            e.employees.some((emp) => emp.email === myEmail),
          ),
        );
      if (this.props.freeshifts)
        collected.push(
          ...this.state.events.filter(
            (e) =>
              e.employees.length < e.capacity &&
              !e.employees.some((emp) => emp.email === myEmail),
          ),
        );
      if (this.props.fullshifts)
        collected.push(
          ...this.state.events.filter(
            (e) =>
              e.employees.length >= e.capacity &&
              !e.employees.some((emp) => emp.email === myEmail),
          ),
        );
      const seen = new Set();
      showEvents = collected.filter((e) => {
        if (seen.has(e.id)) return false;
        seen.add(e.id);
        return true;
      });
      if (!this.props.showPastShifts) {
        showEvents = showEvents.filter((e) => new Date(e.end) >= now);
      }
      if (this.props.employeeShowOnlyAvailable) {
        showEvents = showEvents.filter((e) => e.employees.length < e.capacity);
      }
    }

    /* Inject display-settings into each event so Event.jsx can read them */
    const displayEvents = showEvents.map((e) => ({
      ...e,
      _showCapacity: showCapacity,
    }));

    const allViews = Object.keys(BigCalendar.Views).map(
      (k) => BigCalendar.Views[k],
    );

    /* ── Stats (#8) ────────────────────────────────────────────────────── */
    const total = this.state.events.length;
    const emptyCount = this.state.events.filter(
      (e) => e.employees.length === 0,
    ).length;
    const partCount = this.state.events.filter(
      (e) => e.employees.length > 0 && e.employees.length < e.capacity,
    ).length;
    const fullCount = this.state.events.filter(
      (e) => e.capacity > 0 && e.employees.length >= e.capacity,
    ).length;
    const totalSlots = this.state.events.reduce((s, e) => s + e.capacity, 0);
    const filledSlots = this.state.events.reduce(
      (s, e) => s + Math.min(e.employees.length, e.capacity),
      0,
    );
    const fillRate =
      totalSlots > 0 ? Math.round((filledSlots / totalSlots) * 100) : 0;

    const statCard = (color, value, label) => (
      <div
        key={label}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '6px 14px',
          borderRadius: 8,
          background: '#fff',
          border: `1px solid #DADCE0`,
          minWidth: 72,
        }}
      >
        <span
          style={{
            fontSize: '1.2rem',
            fontWeight: 700,
            color,
            lineHeight: 1.2,
          }}
        >
          {value}
        </span>
        <span
          style={{
            fontSize: '0.65rem',
            color: '#80868B',
            fontWeight: 500,
            textTransform: 'none',
            letterSpacing: 0,
            marginTop: 2,
          }}
        >
          {label}
        </span>
      </div>
    );

    /* ── Interests summary for detail dialog ────────────────────────────── */
    const detailEvent = this.state.shiftDetailEvent;
    const myEmail = this.props.searchEmployee;
    const myInterest = detailEvent
      ? (detailEvent.interests || []).find((i) => i.email === myEmail)
      : null;

    /* ── Interests panel for edit dialog ────────────────────────────────── */
    const editInterests = this.state.dialoginfo.interests || [];

    return (
      <div className='App'>
        {/* ── Manager hint & stats ──────────────────────────────────── */}
        {this.state.firstevent && this.props.auth === 'manager' && (
          <Typography
            variant='body2'
            color='textSecondary'
            style={{ marginBottom: 8 }}
          >
            Klikněte do kalendáře pro vytvoření nové směny · <kbd>N</kbd> = nová
            směna dnes
          </Typography>
        )}
        {this.state.firstevent && this.props.auth === 'employee' && (
          <Typography
            variant='body2'
            color='textSecondary'
            style={{ marginBottom: 8 }}
          >
            {this.props.interestMode
              ? 'Klikněte na směnu pro vyjádření zájmu.'
              : 'Klikněte na směnu pro přihlášení nebo odhlášení.'}
          </Typography>
        )}

        {this.props.auth === 'manager' && (
          <div
            style={{
              display: 'flex',
              gap: 8,
              marginBottom: 10,
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            {/* Stats bar */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {statCard('#5F6368', total, 'Celkem')}
              {statCard('#EA4335', emptyCount, 'Volné')}
              {statCard('#FBBC04', partCount, 'Částečné')}
              {statCard('#34A853', fullCount, 'Plné')}
              {statCard('#1A73E8', `${fillRate}%`, 'Obsazenost')}
            </div>

            {/* Action buttons */}
            <div
              style={{
                display: 'flex',
                gap: 6,
                marginLeft: 'auto',
                flexWrap: 'wrap',
              }}
            >
              {this.props.interestMode && (
                <>
                  <Button
                    variant='contained'
                    onClick={this.handleAutoAssignMRV}
                    size='small'
                    style={{
                      background: '#7C3AED',
                      color: '#fff',
                      boxShadow: 'none',
                    }}
                  >
                    Auto-přiřadit (MRV)
                  </Button>
                  <Button
                    variant='outlined'
                    onClick={() => this.handleAutoAssignAll('greedy')}
                    size='small'
                    style={{ borderColor: '#34A853', color: '#34A853' }}
                  >
                    Auto (Greedy)
                  </Button>
                  <Button
                    variant='outlined'
                    onClick={() => this.handleAutoAssignAll('balanced')}
                    size='small'
                    style={{ borderColor: '#1A73E8', color: '#1A73E8' }}
                  >
                    Auto (Rovnoměrně)
                  </Button>
                </>
              )}
              <Button
                variant='outlined'
                onClick={this.handleBulkCopyWeek}
                size='small'
              >
                <FileCopy style={{ fontSize: 15, marginRight: 4 }} />
                Kopírovat týden
              </Button>
              <Button variant='outlined' onClick={this.handleLock} size='small'>
                <Lock style={{ fontSize: 16, marginRight: 5 }} />
                Uzamknout
              </Button>
              <Button variant='outlined' onClick={this.handleOpen} size='small'>
                <LockOpen style={{ fontSize: 16, marginRight: 5 }} />
                Odemknout
              </Button>
              <Button
                variant='outlined'
                onClick={() => exportShiftsToCSV(this.state.events)}
                size='small'
              >
                <GetApp style={{ fontSize: 16, marginRight: 5 }} />
                Export CSV
              </Button>
            </div>
          </div>
        )}

        {/* ── Empty state (#9) ─────────────────────────────────────── */}
        {displayEvents.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '10px 16px',
              marginBottom: 8,
              background: '#F8FAFC',
              border: '1px dashed #CBD5E1',
              borderRadius: 10,
            }}
          >
            <Typography variant='body2' color='textSecondary'>
              {this.props.auth === 'manager'
                ? 'Žádné směny k zobrazení. Klikněte do kalendáře pro vytvoření nové směny.'
                : 'Žádné směny k zobrazení pro zvolené filtry.'}
            </Typography>
          </div>
        )}

        {/* ── Calendar ─────────────────────────────────────────────── */}
        {this.props.auth === 'manager' ? (
          <DragAndDropCalendar
            culture='cs-CZ'
            selectable
            resizable
            localizer={localizer}
            events={displayEvents}
            defaultView={BigCalendar.Views.WEEK}
            scrollToTime={new Date(1970, 1, 1, 6)}
            defaultDate={new Date()}
            onSelectEvent={(event) => this.handleClickOpen(event)}
            onSelectSlot={this.handleSelect}
            style={{ height: '100vh' }}
            onEventDrop={this.moveEvent}
            onEventResize={this.resizeEvent}
            onNavigate={(date) => this.setState({ currentDate: date })}
            onView={(view) => this.setState({ currentView: view })}
            rtl
            longPressThreshold={0}
            showMultiDayTimes
            views={allViews}
            eventPropGetter={this.eventStyleGetter}
            messages={{ noEventsInRange: ' ' }}
            components={{
              event: Event,
              toolbar: Toolbar,
              agenda: { event: this.EventAgenda },
            }}
          />
        ) : (
          <BigCalendar
            culture='cs-CZ'
            localizer={localizer}
            events={displayEvents}
            defaultView={BigCalendar.Views.WEEK}
            scrollToTime={new Date(1970, 1, 1, 6)}
            defaultDate={new Date()}
            style={{ height: '100vh' }}
            eventPropGetter={this.eventStyleGetter}
            onSelectEvent={this.handleEmployeeShiftClick}
            messages={{ noEventsInRange: ' ' }}
            components={{
              event: Event,
              toolbar: Toolbar,
              agenda: { event: this.EventAgenda },
            }}
          />
        )}

        {/* ── Edit dialog ──────────────────────────────────────────── */}
        <Dialog
          open={this.state.isEditModalOpen}
          onClose={this.handleClose}
          aria-labelledby='edit-shift-dialog-title'
          maxWidth='md'
          fullWidth
          scroll='paper'
        >
          <DialogTitle id='edit-shift-dialog-title'>
            Úprava směny: {this.state.dialoginfo.title || ''}
          </DialogTitle>
          <DialogContent>
            <FormControl fullWidth className={classes.formControl}>
              <InputLabel htmlFor='edit-title'>Název směny</InputLabel>
              <Input
                id='edit-title'
                type='text'
                value={this.state.dialoginfo.title || ''}
                onChange={this.handleDialogChange('title')}
                autoFocus
              />
            </FormControl>

            <Grid
              container
              spacing={16}
              alignItems='flex-end'
              style={{ marginTop: 8 }}
            >
              <Grid item md={4} xs={12}>
                <FormControl fullWidth className={classes.formControl}>
                  <InputLabel htmlFor='edit-start'>Začátek</InputLabel>
                  <Input
                    id='edit-start'
                    type='datetime-local'
                    value={toDatetimeLocal(this.state.dialoginfo.start)}
                    onChange={this.handleDialogChange('start')}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12}>
                <FormControl fullWidth className={classes.formControl}>
                  <InputLabel htmlFor='edit-end'>Konec</InputLabel>
                  <Input
                    id='edit-end'
                    type='datetime-local'
                    value={toDatetimeLocal(this.state.dialoginfo.end)}
                    onChange={this.handleDialogChange('end')}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12}>
                <FormControl fullWidth className={classes.formControl}>
                  <InputLabel htmlFor='edit-capacity'>Kapacita</InputLabel>
                  <Input
                    id='edit-capacity'
                    type='number'
                    inputProps={{ min: 1 }}
                    value={this.state.dialoginfo.capacity || ''}
                    onChange={this.handleDialogChange('capacity')}
                  />
                </FormControl>
              </Grid>
            </Grid>

            <TextField
              id='edit-note'
              label='Poznámka'
              placeholder='Volitelná poznámka ke směně…'
              multiline
              rows={2}
              margin='normal'
              variant='outlined'
              fullWidth
              value={this.state.dialoginfo.note || ''}
              onChange={this.handleDialogChange('note')}
              style={{ marginTop: 16 }}
            />

            {/* ── Color picker (#7) ─────────────────────────────── */}
            <div style={{ marginTop: 12 }}>
              <Typography
                variant='caption'
                color='textSecondary'
                style={{ display: 'block', marginBottom: 6 }}
              >
                Barva směny (prázdné = automatická dle obsazenosti)
              </Typography>
              <div
                style={{
                  display: 'flex',
                  gap: 6,
                  flexWrap: 'wrap',
                  alignItems: 'center',
                }}
              >
                {SHIFT_COLORS.map((c) => (
                  <div
                    key={c}
                    onClick={() =>
                      this.setState((ps) => ({
                        dialoginfo: { ...ps.dialoginfo, color: c },
                      }))
                    }
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 6,
                      backgroundColor: c,
                      cursor: 'pointer',
                      boxSizing: 'border-box',
                      border:
                        this.state.dialoginfo.color === c
                          ? '2.5px solid #0F172A'
                          : '2.5px solid transparent',
                    }}
                  />
                ))}
                <div
                  onClick={() =>
                    this.setState((ps) => ({
                      dialoginfo: { ...ps.dialoginfo, color: null },
                    }))
                  }
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    cursor: 'pointer',
                    background:
                      'linear-gradient(135deg,#f00 0%,#0f0 50%,#00f 100%)',
                    boxSizing: 'border-box',
                    border: !this.state.dialoginfo.color
                      ? '2.5px solid #0F172A'
                      : '2.5px solid transparent',
                  }}
                  title='Auto (podle obsazenosti)'
                />
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
                marginTop: 12,
              }}
            >
              <div style={{ flex: 1 }}>
                <Autocomplete
                  value={this.state.searchEmployee}
                  onChange={this.handleSearchChange}
                  onSubmit={this.handleAdd}
                  id='shift-employee-search'
                  label='Přidat zaměstnance'
                  options={UserOptions.filter(
                    (o) =>
                      !this.state.dialoginfo.employees.some(
                        (e) => e.email === o.value.email,
                      ),
                  )}
                />
              </div>
              <Button
                variant='contained'
                color='primary'
                onClick={this.handleAdd}
                style={{ flexShrink: 0, marginTop: 6 }}
              >
                Přidat
              </Button>
            </div>

            <Grid container spacing={8} style={{ marginTop: 8 }}>
              <Grid item xs={12}>
                <Usertable
                  data={this.state.dialoginfo.employees || []}
                  onDelete={this.handleUserDelete}
                  initialRowsPerPage={3}
                  compact
                />
              </Grid>
            </Grid>

            {/* ── Interests panel ───────────────────────────────── */}
            {this.props.interestMode && (
              <div style={{ marginTop: 20 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'inherit',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: '#5F6368',
                    }}
                  >
                    Vyjádřené zájmy ({editInterests.length})
                  </span>
                  {editInterests.length > 0 && (
                    <Button
                      size='small'
                      onClick={this.handleClearInterests}
                      style={{
                        fontSize: '0.75rem',
                        color: '#80868B',
                        minWidth: 'auto',
                      }}
                    >
                      Vymazat vše
                    </Button>
                  )}
                </div>

                {editInterests.length === 0 ? (
                  <div
                    style={{
                      padding: '10px 14px',
                      borderRadius: 8,
                      background: '#F8F9FA',
                      border: '1px solid #DADCE0',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'inherit',
                        fontSize: '0.82rem',
                        color: '#80868B',
                      }}
                    >
                      Žádné vyjádřené zájmy pro tuto směnu.
                    </span>
                  </div>
                ) : (
                  <div
                    style={{ display: 'flex', flexDirection: 'column', gap: 4 }}
                  >
                    {[...editInterests]
                      .sort(
                        (a, b) =>
                          (INTEREST_PRIORITY[a.level] ?? 99) -
                          (INTEREST_PRIORITY[b.level] ?? 99),
                      )
                      .map((i) => {
                        const isAssigned = this.state.dialoginfo.employees.some(
                          (e) => e.email === i.email,
                        );
                        const canAssign =
                          (INTEREST_PRIORITY[i.level] ?? 99) < 99 &&
                          !isAssigned;
                        const color = INTEREST_COLORS[i.level] || '#80868B';
                        return (
                          <div
                            key={i.email}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 10,
                              padding: '7px 10px',
                              borderRadius: 8,
                              background: '#F8F9FA',
                              border: '1px solid #DADCE0',
                              fontFamily: 'inherit',
                            }}
                          >
                            <span
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                flexShrink: 0,
                                background: color,
                              }}
                            />
                            <span
                              style={{
                                flex: 1,
                                fontSize: '0.83rem',
                                fontWeight: 500,
                                color: '#202124',
                                fontFamily: 'inherit',
                              }}
                            >
                              {i.firstname} {i.lastname}
                            </span>
                            <span
                              style={{
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                fontFamily: 'inherit',
                                color,
                              }}
                            >
                              {INTEREST_LABELS[i.level] || i.level}
                            </span>
                            {isAssigned ? (
                              <span
                                style={{
                                  fontSize: '0.72rem',
                                  color: '#34A853',
                                  fontWeight: 600,
                                  fontFamily: 'inherit',
                                }}
                              >
                                ✓ Přiřazen
                              </span>
                            ) : canAssign ? (
                              <Button
                                size='small'
                                variant='outlined'
                                color='primary'
                                style={{
                                  minWidth: 'auto',
                                  padding: '2px 8px',
                                  fontSize: '0.72rem',
                                  height: 26,
                                }}
                                onClick={() =>
                                  this.handleAssignFromInterest(i.email)
                                }
                              >
                                Přiřadit
                              </Button>
                            ) : null}
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            )}
          </DialogContent>

          <DialogActions>
            <Button
              onClick={this.handleDelete}
              style={{ color: '#EA4335', marginRight: 'auto' }}
            >
              Odstranit
            </Button>
            <Button onClick={this.handleDuplicate} color='default'>
              Duplikovat
            </Button>
            {/* ── Copy to next week (#17) ──────────────────────── */}
            <Button onClick={this.handleCopyNextWeek} color='default'>
              <FileCopy style={{ fontSize: 15, marginRight: 5 }} />
              Příští týden
            </Button>
            {this.props.interestMode && (
              <>
                <Button
                  onClick={this.handleAutoAssignMRV}
                  color='default'
                  style={{ color: '#7C3AED', fontWeight: 700 }}
                >
                  Auto (MRV)
                </Button>
                <Button
                  onClick={() => this.handleAutoAssignShift('greedy')}
                  color='default'
                  style={{ color: '#34A853' }}
                >
                  Greedy
                </Button>
                <Button
                  onClick={() => this.handleAutoAssignShift('balanced')}
                  color='default'
                  style={{ color: '#1A73E8' }}
                >
                  Rovnoměrně
                </Button>
              </>
            )}
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.dialoginfo.locked}
                  onChange={this.handleDialogChange('locked')}
                  value={String(!this.state.dialoginfo.locked)}
                />
              }
              label={this.state.dialoginfo.locked ? <Lock /> : <LockOpen />}
            />
            <Button onClick={this.handleClose}>Zrušit</Button>
            <Button
              variant='contained'
              onClick={this.handleSubmit}
              color='secondary'
              disabled={!this.state.dialoginfo.title}
            >
              Uložit
            </Button>
          </DialogActions>
        </Dialog>

        {/* ── Confirm delete dialog (#10) ───────────────────────────── */}
        <Dialog
          open={this.state.isConfirmDeleteOpen}
          onClose={() => this.setState({ isConfirmDeleteOpen: false })}
          maxWidth='xs'
          fullWidth
        >
          <DialogTitle>Smazat směnu?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Opravdu chcete smazat směnu „{this.state.dialoginfo.title}"? Tuto
              akci lze vrátit pomocí tlačítka „Vrátit zpět".
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => this.setState({ isConfirmDeleteOpen: false })}
            >
              Zrušit
            </Button>
            <Button
              onClick={this.confirmDelete}
              style={{ color: '#fff', background: '#EA4335' }}
              variant='contained'
            >
              Smazat
            </Button>
          </DialogActions>
        </Dialog>

        {/* ── Lock warning dialog ───────────────────────────────────── */}
        <Dialog
          open={this.state.isLockWarningOpen}
          onClose={() => this.setState({ isLockWarningOpen: false })}
          maxWidth='xs'
          fullWidth
        >
          <DialogTitle>Varování: nedostatečné obsazení</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <strong>{this.state.lockWarningUnderstaffed}</strong> směn{' '}
              {this.state.lockWarningUnderstaffed === 1 ? 'je' : 'je'} obsazena
              méně než z 50 %. Přesto uzamknout?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.setState({ isLockWarningOpen: false })}>
              Zrušit
            </Button>
            <Button
              onClick={this.confirmLock}
              style={{ color: '#fff', background: '#EA4335' }}
              variant='contained'
            >
              Uzamknout i tak
            </Button>
          </DialogActions>
        </Dialog>

        {/* ── Create dialog ─────────────────────────────────────────── */}
        <Dialog
          open={this.state.isCreateModalOpen}
          onClose={this.handleCreateClose}
          aria-labelledby='create-dialog-title'
        >
          <DialogTitle id='create-dialog-title'>Nová Směna</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              label='Název směny'
              type='text'
              fullWidth
              margin='normal'
              value={this.state.newShiftTitle}
              onChange={this.handleCreateChange('newShiftTitle')}
            />
            <TextField
              label='Kapacita'
              type='number'
              fullWidth
              margin='normal'
              inputProps={{ min: 1 }}
              value={this.state.newShiftCapacity}
              onChange={this.handleCreateChange('newShiftCapacity')}
            />

            {/* Recurring options */}
            <div
              style={{
                marginTop: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                flexWrap: 'wrap',
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.newShiftRepeat}
                    onChange={(e) =>
                      this.setState({ newShiftRepeat: e.target.checked })
                    }
                    color='primary'
                  />
                }
                label='Opakovat týdně'
              />
              {this.state.newShiftRepeat && (
                <TextField
                  label='Počet týdnů'
                  type='number'
                  value={this.state.newShiftRepeatWeeks}
                  onChange={(e) =>
                    this.setState({
                      newShiftRepeatWeeks: Math.max(
                        1,
                        Math.min(12, parseInt(e.target.value) || 1),
                      ),
                    })
                  }
                  inputProps={{ min: 1, max: 12 }}
                  style={{ width: 110 }}
                  margin='none'
                />
              )}
            </div>

            {/* Colour picker for new shift */}
            <div style={{ marginTop: 12 }}>
              <Typography
                variant='caption'
                color='textSecondary'
                style={{ display: 'block', marginBottom: 6 }}
              >
                Barva (prázdné = auto)
              </Typography>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {SHIFT_COLORS.map((c) => (
                  <div
                    key={c}
                    onClick={() => this.setState({ newShiftColor: c })}
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 5,
                      backgroundColor: c,
                      cursor: 'pointer',
                      boxSizing: 'border-box',
                      border:
                        this.state.newShiftColor === c
                          ? '2.5px solid #0F172A'
                          : '2.5px solid transparent',
                    }}
                  />
                ))}
                <div
                  onClick={() => this.setState({ newShiftColor: null })}
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 5,
                    cursor: 'pointer',
                    background:
                      'linear-gradient(135deg,#f00 0%,#0f0 50%,#00f 100%)',
                    boxSizing: 'border-box',
                    border: !this.state.newShiftColor
                      ? '2.5px solid #0F172A'
                      : '2.5px solid transparent',
                  }}
                  title='Auto'
                />
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.handleCreate}
              color='secondary'
              variant='contained'
              disabled={
                !this.state.newShiftTitle ||
                !parseInt(this.state.newShiftCapacity, 10)
              }
            >
              {this.state.newShiftRepeat && this.state.newShiftRepeatWeeks > 1
                ? `Vytvořit (${this.state.newShiftRepeatWeeks}×)`
                : 'Vytvořit'}
            </Button>
            <Button onClick={this.handleCreateClose} color='primary'>
              Zrušit
            </Button>
          </DialogActions>
        </Dialog>

        {/* ── Employee: Shift detail + interest dialog ─────────────── */}
        <Dialog
          open={this.state.isShiftDetailOpen}
          onClose={() => this.setState({ isShiftDetailOpen: false })}
          maxWidth='sm'
          fullWidth
        >
          {detailEvent && (
            <>
              <DialogTitle>
                {detailEvent.title}
                {detailEvent.locked && (
                  <Lock
                    style={{
                      fontSize: 18,
                      marginLeft: 8,
                      verticalAlign: 'middle',
                      color: '#94A3B8',
                    }}
                  />
                )}
              </DialogTitle>
              <DialogContent>
                {/* Shift info */}
                <div
                  style={{
                    display: 'flex',
                    gap: 16,
                    flexWrap: 'wrap',
                    marginBottom: 16,
                  }}
                >
                  <div style={{ minWidth: 120 }}>
                    <Typography variant='caption' color='textSecondary'>
                      Čas
                    </Typography>
                    <Typography variant='body2'>
                      {moment(detailEvent.start).format('dd D.M. HH:mm')} –{' '}
                      {moment(detailEvent.end).format('HH:mm')}
                    </Typography>
                    <Typography variant='caption' color='textSecondary'>
                      ({formatDuration(detailEvent.start, detailEvent.end)})
                    </Typography>
                  </div>
                  {showCapacity && (
                    <div>
                      <Typography variant='caption' color='textSecondary'>
                        Obsazenost
                      </Typography>
                      <Typography variant='body2'>
                        {detailEvent.employees.length} / {detailEvent.capacity}
                        {detailEvent.employees.length >=
                        detailEvent.capacity ? (
                          <span
                            style={{
                              color: '#DC2626',
                              marginLeft: 6,
                              fontSize: '0.75rem',
                            }}
                          >
                            Plné
                          </span>
                        ) : (
                          <span
                            style={{
                              color: '#059669',
                              marginLeft: 6,
                              fontSize: '0.75rem',
                            }}
                          >
                            Volná místa
                          </span>
                        )}
                      </Typography>
                    </div>
                  )}
                </div>

                {/* Note */}
                {detailEvent.note && (
                  <div
                    style={{
                      padding: '8px 12px',
                      borderRadius: 8,
                      background: '#FFF7ED',
                      border: '1px solid #FED7AA',
                      marginBottom: 16,
                    }}
                  >
                    <Typography
                      variant='caption'
                      color='textSecondary'
                      style={{ display: 'block', marginBottom: 2 }}
                    >
                      Poznámka vedoucího
                    </Typography>
                    <Typography variant='body2'>{detailEvent.note}</Typography>
                  </div>
                )}

                {/* Assigned employees */}
                {showAssignees && detailEvent.employees.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <Typography
                      variant='caption'
                      color='textSecondary'
                      style={{ display: 'block', marginBottom: 6 }}
                    >
                      Přiřazení zaměstnanci
                    </Typography>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {detailEvent.employees.map((emp) => (
                        <span
                          key={emp.email}
                          style={{
                            padding: '3px 10px',
                            borderRadius: 20,
                            fontSize: '0.78rem',
                            background:
                              emp.email === myEmail ? '#DCFCE7' : '#F1F5F9',
                            color:
                              emp.email === myEmail ? '#059669' : '#334155',
                            border:
                              emp.email === myEmail
                                ? '1px solid #86EFAC'
                                : '1px solid #E2E8F0',
                            fontWeight: emp.email === myEmail ? 700 : 400,
                          }}
                        >
                          {emp.firstname} {emp.lastname}
                          {emp.email === myEmail ? ' (vy)' : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Interest expression */}
                {this.props.interestMode ? (
                  <div>
                    <Typography variant='subtitle2' gutterBottom>
                      {myInterest
                        ? `Váš zájem: ${INTEREST_LABELS[myInterest.level]}`
                        : 'Vyjádřit zájem o tuto směnu:'}
                    </Typography>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      {INTEREST_BUTTON_OPTIONS.map((opt) => (
                        <Button
                          key={opt.level}
                          variant={
                            myInterest && myInterest.level === opt.level
                              ? 'contained'
                              : 'outlined'
                          }
                          onClick={() => this.handleExpressInterest(opt.level)}
                          style={{
                            background:
                              myInterest && myInterest.level === opt.level
                                ? opt.bg
                                : undefined,
                            borderColor: opt.border,
                            color: opt.color,
                            fontWeight:
                              myInterest && myInterest.level === opt.level
                                ? 700
                                : 400,
                          }}
                        >
                          {opt.label}
                        </Button>
                      ))}
                    </div>
                    {myInterest && (
                      <Button
                        size='small'
                        style={{ marginTop: 8, color: '#94A3B8' }}
                        onClick={() => this.handleExpressInterest(null)}
                      >
                        Odebrat zájem
                      </Button>
                    )}
                  </div>
                ) : (
                  <div>
                    {detailEvent.locked ? (
                      <Typography variant='body2' color='textSecondary'>
                        Tato směna je uzamčena.
                      </Typography>
                    ) : detailEvent.employees.some(
                        (e) => e.email === myEmail,
                      ) ? (
                      <Button
                        variant='outlined'
                        color='secondary'
                        onClick={() => {
                          this.addUserToEvent(detailEvent);
                          this.setState({ isShiftDetailOpen: false });
                        }}
                      >
                        Odhlásit se ze směny
                      </Button>
                    ) : detailEvent.employees.length < detailEvent.capacity ? (
                      <Button
                        variant='contained'
                        color='primary'
                        onClick={() => {
                          this.addUserToEvent(detailEvent);
                          this.setState({ isShiftDetailOpen: false });
                        }}
                      >
                        Přihlásit se na směnu
                      </Button>
                    ) : (
                      <Typography variant='body2' color='error'>
                        Směna je plně obsazena.
                      </Typography>
                    )}
                  </div>
                )}
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => this.setState({ isShiftDetailOpen: false })}
                >
                  Zavřít
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* ── Snackbars ─────────────────────────────────────────────── */}
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          open={this.state.openSuccess}
          autoHideDuration={3000}
          onClose={this.handleSnackClose}
        >
          <MySnackbarContentWrapper
            onClose={this.handleSnackClose}
            variant='success'
            message={this.state.SuccessText}
          />
        </Snackbar>

        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          open={this.state.openUndo}
          autoHideDuration={6000}
          onClose={this.handleSnackClose}
        >
          <SnackbarContent
            message={this.state.UndoText}
            action={
              <Button
                color='secondary'
                size='small'
                onClick={this.handleUndoDelete}
              >
                Vrátit zpět
              </Button>
            }
          />
        </Snackbar>

        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          open={this.state.openError}
          autoHideDuration={4000}
          onClose={this.handleSnackClose}
        >
          <MySnackbarContentWrapper
            onClose={this.handleSnackClose}
            variant='error'
            message={this.state.ErrorText}
          />
        </Snackbar>
      </div>
    );
  }
}

Cal.propTypes = {
  classes: PropTypes.object.isRequired,
  interestMode: PropTypes.bool,
  showPastShifts: PropTypes.bool,
  employeeShowCapacity: PropTypes.bool,
  employeeShowAssignees: PropTypes.bool,
  employeeShowOnlyAvailable: PropTypes.bool,
};

Cal.defaultProps = {
  interestMode: false,
  showPastShifts: false,
  employeeShowCapacity: true,
  employeeShowAssignees: true,
  employeeShowOnlyAvailable: false,
};

export default withRoot(withStyles(styles)(Cal));
