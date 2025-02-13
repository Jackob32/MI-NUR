import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Usertable from '../../../components/usertable/Usertable';
import StatCard from '../../../components/common/StatCard';
import { users as defaultUsers } from '../../../data';
import { loadUsers, saveUsers } from '../../../storage';
import { COLORS } from '../../../constants/colors';
import styles from '../../../styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import PersonAdd from '@material-ui/icons/PersonAdd';
import Search from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import withRoot from '../../../withRoot';
import update from 'immutability-helper';
import { loadEvents } from '../../../storage';
import { events as defaultEvents } from '../../../data';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';

class Usermanager extends React.Component {
  constructor(props) {
    super(props);
    const rows = loadUsers(defaultUsers);

    /* ── Work hours: compute scheduled hours per user from persisted events ── */
    const allEvents = loadEvents(defaultEvents);
    const scheduledHours = {};
    allEvents.forEach((event) => {
      const hours = (new Date(event.end) - new Date(event.start)) / 3600000;
      (event.employees || []).forEach((emp) => {
        scheduledHours[emp.email] = (scheduledHours[emp.email] || 0) + hours;
      });
    });

    this.state = {
      rows,
      scheduledHours,
      search: '',
      isEditModalOpen: false,
      isConfirmDeleteOpen: false,
      pendingDeleteId: null,
      lastDeletedUser: null,
      lastDeletedIndex: -1,
      openUndo: false,
      edituser: {
        id: rows.length,
        firstname: '',
        lastname: '',
        worktime: 0,
        email: '',
        type: 'employee',
      },
    };
  }

  handleClickOpen = () => this.setState({ isEditModalOpen: true });
  handleClose = () => this.setState({ isEditModalOpen: false });

  handleSubmit = () => {
    const index = this.state.rows.findIndex(
      (item) => item.id === this.state.edituser.id,
    );
    let newRows;
    if (index >= 0) {
      newRows = update(this.state.rows, {
        [index]: { $set: this.state.edituser },
      });
    } else {
      newRows = [...this.state.rows, this.state.edituser];
    }
    this.setState({ rows: newRows }, () => saveUsers(this.state.rows));
    this.handleClose();
  };

  /* ── Confirm delete (#10) ─────────────────────────────────────────────── */
  handleDelete = (id) => {
    this.setState({ isConfirmDeleteOpen: true, pendingDeleteId: id });
  };

  confirmDelete = () => {
    const id = this.state.pendingDeleteId;
    const index = this.state.rows.findIndex((item) => item.id === id);
    const removed = this.state.rows[index];
    const newRows = [...this.state.rows];
    newRows.splice(index, 1);
    this.setState(
      {
        rows: newRows,
        isConfirmDeleteOpen: false,
        pendingDeleteId: null,
        lastDeletedUser: removed,
        lastDeletedIndex: index,
        openUndo: true,
      },
      () => saveUsers(this.state.rows),
    );
  };

  handleUndoDelete = () => {
    const { lastDeletedUser, lastDeletedIndex } = this.state;
    if (!lastDeletedUser) {
      this.setState({ openUndo: false });
      return;
    }
    const rows = [...this.state.rows];
    rows.splice(lastDeletedIndex, 0, lastDeletedUser);
    this.setState(
      { rows, lastDeletedUser: null, lastDeletedIndex: -1, openUndo: false },
      () => saveUsers(this.state.rows),
    );
  };

  handleEdit = (id) => {
    const index = this.state.rows.findIndex((item) => item.id === id);
    this.setState({ edituser: { ...this.state.rows[index] } });
    this.handleClickOpen();
  };

  handleDialogChange = (prop) => (event) => {
    const val = event.target.value;
    this.setState((prevState) => ({
      edituser: { ...prevState.edituser, [prop]: val },
    }));
  };

  handleNewUser = () => {
    const nextId = Math.max(...this.state.rows.map((r) => r.id), 0) + 1;
    this.setState({
      edituser: {
        id: nextId,
        firstname: '',
        lastname: '',
        worktime: 0,
        email: '',
        type: 'employee',
      },
    });
    this.handleClickOpen();
  };

  render() {
    const { classes } = this.props;
    const { edituser, search, scheduledHours } = this.state;
    const isNew = this.state.rows.findIndex((r) => r.id === edituser.id) < 0;

    /* ── User search (#12) ────────────────────────────────────────────── */
    const filteredRows = search
      ? this.state.rows.filter((r) =>
          (r.firstname + ' ' + r.lastname + ' ' + r.email)
            .toLowerCase()
            .includes(search.toLowerCase()),
        )
      : this.state.rows;

    /* ── Work hours stats (#13) ───────────────────────────────────────── */
    const totalContracted = this.state.rows.reduce(
      (s, r) => s + (Number(r.worktime) || 0),
      0,
    );
    const totalScheduled = Object.values(scheduledHours).reduce(
      (s, h) => s + h,
      0,
    );

    return (
      <div>
        {/* ── Work hours summary (#13) ──────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            marginBottom: 16,
            flexWrap: 'wrap',
          }}
        >
          <StatCard
            label='Zaměstnanců'
            value={this.state.rows.length}
            color={COLORS.blue}
            minWidth={120}
          />
          <StatCard
            label='Smluvní h/týden'
            value={`${totalContracted} h`}
            color={COLORS.green}
            minWidth={120}
          />
          <StatCard
            label='Naplánováno celkem'
            value={`${Math.round(totalScheduled)} h`}
            color={COLORS.yellow}
            minWidth={120}
          />
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 12,
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <Typography variant='h6' color='textSecondary'>
            Správa zaměstnanců
          </Typography>

          {/* ── Search (#12) ─────────────────────────────────────── */}
          <TextField
            placeholder='Hledat jméno nebo email…'
            value={search}
            onChange={(e) => this.setState({ search: e.target.value })}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <Search style={{ fontSize: 18, color: '#94A3B8' }} />
                </InputAdornment>
              ),
            }}
            style={{ minWidth: 240 }}
            margin='none'
            variant='outlined'
            inputProps={{ style: { padding: '8px 12px' } }}
          />

          <Button
            variant='contained'
            color='primary'
            onClick={this.handleNewUser}
            style={{ minWidth: 160 }}
          >
            <PersonAdd style={{ marginRight: 8, fontSize: 18 }} />
            Nový uživatel
          </Button>
        </div>

        <Usertable
          data={filteredRows}
          scheduledHours={scheduledHours}
          onDelete={this.handleDelete}
          onEdit={this.handleEdit}
        />

        {/* ── Edit / create dialog ──────────────────────────────────── */}
        <Dialog
          open={this.state.isEditModalOpen}
          onClose={this.handleClose}
          aria-labelledby='user-dialog-title'
          maxWidth='xs'
          fullWidth
        >
          <DialogTitle id='user-dialog-title'>
            {isNew ? 'Nový uživatel' : 'Upravit uživatele'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={8}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth className={classes.formControl}>
                  <InputLabel htmlFor='edit-firstname'>Jméno</InputLabel>
                  <Input
                    id='edit-firstname'
                    type='text'
                    value={edituser.firstname}
                    onChange={this.handleDialogChange('firstname')}
                    autoFocus
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth className={classes.formControl}>
                  <InputLabel htmlFor='edit-lastname'>Příjmení</InputLabel>
                  <Input
                    id='edit-lastname'
                    type='text'
                    value={edituser.lastname}
                    onChange={this.handleDialogChange('lastname')}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth className={classes.formControl}>
                  <InputLabel htmlFor='edit-email'>Email</InputLabel>
                  <Input
                    id='edit-email'
                    type='email'
                    value={edituser.email}
                    onChange={this.handleDialogChange('email')}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth className={classes.formControl}>
                  <InputLabel htmlFor='edit-type'>Role</InputLabel>
                  <Select
                    native
                    inputProps={{ id: 'edit-type' }}
                    value={edituser.type || 'employee'}
                    onChange={this.handleDialogChange('type')}
                  >
                    <option value='employee'>Zaměstnanec</option>
                    <option value='manager'>Vedoucí</option>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth className={classes.formControl}>
                  <InputLabel htmlFor='edit-worktime'>
                    Úvazek (h/týden)
                  </InputLabel>
                  <Input
                    id='edit-worktime'
                    type='number'
                    inputProps={{ min: 0 }}
                    value={edituser.worktime}
                    onChange={this.handleDialogChange('worktime')}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color='default'>
              Zrušit
            </Button>
            <Button
              variant='contained'
              color='secondary'
              onClick={this.handleSubmit}
              disabled={!edituser.firstname || !edituser.lastname}
            >
              {isNew ? 'Vytvořit' : 'Uložit'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* ── Confirm delete ───────────────────────────────────────── */}
        <Dialog
          open={this.state.isConfirmDeleteOpen}
          onClose={() => this.setState({ isConfirmDeleteOpen: false })}
          maxWidth='xs'
          fullWidth
        >
          <DialogTitle>Smazat uživatele?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Opravdu chcete smazat tohoto uživatele? Akci lze vrátit tlačítkem
              „Vrátit zpět".
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

        {/* ── Undo snackbar ─────────────────────────────────────────── */}
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          open={this.state.openUndo}
          autoHideDuration={6000}
          onClose={() => this.setState({ openUndo: false })}
        >
          <SnackbarContent
            message={
              this.state.lastDeletedUser
                ? `Uživatel „${this.state.lastDeletedUser.firstname} ${this.state.lastDeletedUser.lastname}" byl smazán`
                : 'Uživatel byl smazán'
            }
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
      </div>
    );
  }
}

Usermanager.propTypes = { classes: PropTypes.object.isRequired };

export default withRoot(withStyles(styles)(Usermanager));
