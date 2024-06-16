import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { withStyles } from '@material-ui/core/styles';
import withRoot from '../../withRoot';
import styles from '../../styles';
import NotificationSettings from '../../views/employee/pages/settings';
import { saveSettings, loadSettings } from '../../storage';

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edituser: this.props.login,
      managerSettings: loadSettings('manager_global', {
        interestMode: false,
        employeeShowCapacity: true,
        employeeShowAssignees: true,
        employeeShowOnlyAvailable: false,
      }),
    };
  }

  handleDialogChange = (prop) => (event) => {
    const val = event.target.value;
    this.setState((prevState) => ({
      edituser: { ...prevState.edituser, [prop]: val },
    }));
  };

  handleSubmit = () => {
    this.props.handleSubmit(this.state.edituser);
  };

  handleManagerToggle = (key) => (event) => {
    const val = event.target.checked;
    const newSettings = { ...this.state.managerSettings, [key]: val };
    this.setState({ managerSettings: newSettings }, () =>
      saveSettings('manager_global', newSettings),
    );
  };

  render() {
    const { classes } = this.props;
    const { managerSettings } = this.state;

    return (
      <div className={classes.root}>
        {this.props.auth === 'employee' && (
          <Paper
            style={{ padding: '16px 24px', marginBottom: 24 }}
            elevation={1}
          >
            <Typography variant='h6' gutterBottom>
              Nastavení notifikací
            </Typography>
            <Divider style={{ marginBottom: 16 }} />
            <NotificationSettings />
          </Paper>
        )}

        {this.props.auth === 'manager' && (
          <Paper
            style={{ padding: '16px 24px', marginBottom: 24 }}
            elevation={1}
          >
            <Typography variant='h6' gutterBottom>
              Režim přiřazování směn
            </Typography>
            <Divider style={{ marginBottom: 16 }} />

            <FormControlLabel
              control={
                <Switch
                  checked={managerSettings.interestMode}
                  onChange={this.handleManagerToggle('interestMode')}
                  color='primary'
                />
              }
              label={
                <span>
                  <strong>Režim zájmu</strong>
                  {
                    ' — zaměstnanci vyjadřují zájem, manažer (nebo systém) přiřazuje'
                  }
                </span>
              }
            />
            <Typography
              variant='caption'
              color='textSecondary'
              style={{ display: 'block', marginTop: 8, maxWidth: 520 }}
            >
              Pokud je zapnuto, zaměstnanci nemohou přihlásit se ke směně přímo.
              Místo toho vyjadřují zájem pomocí 5 úrovní:{' '}
              <strong>Chci tuto směnu</strong>, <strong>Mohu vzít</strong>,{' '}
              <strong>Jsem k dispozici</strong>, <strong>Raději ne</strong> nebo{' '}
              <strong>Nemohu</strong>. Manažer pak může přiřadit zaměstnance
              ručně nebo pomocí automatického přiřazení (automatika přiřazuje
              pouze první tři úrovně).
            </Typography>

            <div style={{ marginTop: 24 }}>
              <Typography
                variant='subtitle2'
                color='textSecondary'
                gutterBottom
              >
                Algoritmy automatického přiřazení
              </Typography>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  maxWidth: 520,
                }}
              >
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: 8,
                    background: '#F3E8FF',
                    border: '1px solid #C4B5FD',
                  }}
                >
                  <Typography
                    variant='body2'
                    style={{ fontWeight: 700, color: '#7C3AED' }}
                  >
                    MRV – Nejdříve nejtěžší ★ Doporučeno
                  </Typography>
                  <Typography variant='caption' color='textSecondary'>
                    Analyzuje všechny směny najednou. Nejdříve obsadí směny,
                    které mají nejméně dostupných zaměstnanců relative k jejich
                    kapacitě (nejmenší „prostor pro chybu"). Zabraňuje situaci,
                    kdy snadné směny „ukradnou" zaměstnance těžkým. Zároveň
                    vyvažuje hodiny napříč zaměstnanci.
                  </Typography>
                </div>
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: 8,
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <Typography variant='body2' style={{ fontWeight: 700 }}>
                    Greedy
                  </Typography>
                  <Typography variant='caption' color='textSecondary'>
                    Pořadí: Chci → Mohu vzít → Jsem k dispozici. Ignoruje
                    „Raději ne" a „Nemohu". Vyplňuje směny v chronologickém
                    pořadí bez ohledu na obtížnost obsazení.
                  </Typography>
                </div>
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: 8,
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <Typography variant='body2' style={{ fontWeight: 700 }}>
                    Rovnoměrné rozdělení
                  </Typography>
                  <Typography variant='caption' color='textSecondary'>
                    Minimalizuje rozdíly v naplánovaných hodinách. Zaměstnancům
                    s nejméně hodinami jsou dávány přednostní přiřazení (při
                    stejné úrovni zájmu). Vyplňuje chronologicky.
                  </Typography>
                </div>
              </div>
            </div>

            <Typography
              variant='caption'
              color='textSecondary'
              style={{ display: 'block', marginTop: 12 }}
            >
              Nastavení je uloženo automaticky v prohlížeči.
            </Typography>
          </Paper>
        )}

        {this.props.auth === 'manager' && (
          <Paper
            style={{ padding: '16px 24px', marginBottom: 24 }}
            elevation={1}
          >
            <Typography variant='h6' gutterBottom>
              Viditelnost směn pro zaměstnance
            </Typography>
            <Divider style={{ marginBottom: 16 }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={managerSettings.employeeShowCapacity !== false}
                    onChange={this.handleManagerToggle('employeeShowCapacity')}
                    color='primary'
                  />
                }
                label={
                  <span>
                    <strong>Zobrazit kapacitu směny</strong>
                    {
                      ' — zaměstnanci vidí počet obsazených a celkových míst (např. 2/5)'
                    }
                  </span>
                }
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={managerSettings.employeeShowAssignees !== false}
                    onChange={this.handleManagerToggle('employeeShowAssignees')}
                    color='primary'
                  />
                }
                label={
                  <span>
                    <strong>Zobrazit přiřazené zaměstnance</strong>
                    {' — zaměstnanci vidí kdo je již přiřazen na směnu'}
                  </span>
                }
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={managerSettings.employeeShowOnlyAvailable === true}
                    onChange={this.handleManagerToggle(
                      'employeeShowOnlyAvailable',
                    )}
                    color='primary'
                  />
                }
                label={
                  <span>
                    <strong>Zobrazit pouze dostupné směny</strong>
                    {
                      ' — zaměstnanci nevidí plně obsazené směny (skryje je z kalendáře)'
                    }
                  </span>
                }
              />
            </div>

            <Typography
              variant='caption'
              color='textSecondary'
              style={{ display: 'block', marginTop: 12 }}
            >
              Tato nastavení ovlivňují pouze pohled zaměstnance — manažer vždy
              vidí vše.
            </Typography>
          </Paper>
        )}

        <Paper style={{ padding: '16px 24px' }} elevation={1}>
          <Typography variant='h6' gutterBottom>
            Nastavení profilu
          </Typography>
          <Divider style={{ marginBottom: 16 }} />

          <Grid
            container
            direction='column'
            spacing={8}
            style={{ maxWidth: 480 }}
          >
            <Grid item>
              <FormControl variant='outlined' fullWidth>
                <TextField
                  label='Jméno'
                  className={classes.textField}
                  margin='normal'
                  value={this.state.edituser.firstname || ''}
                  onChange={this.handleDialogChange('firstname')}
                  fullWidth
                />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl variant='outlined' fullWidth>
                <TextField
                  label='Příjmení'
                  className={classes.textField}
                  margin='normal'
                  value={this.state.edituser.lastname || ''}
                  onChange={this.handleDialogChange('lastname')}
                  fullWidth
                />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl variant='outlined' fullWidth>
                <TextField
                  label='Email'
                  className={classes.textField}
                  margin='normal'
                  value={this.state.edituser.email || ''}
                  onChange={this.handleDialogChange('email')}
                  type='email'
                  fullWidth
                />
              </FormControl>
            </Grid>
            <Grid item style={{ marginTop: 8 }}>
              <Button
                onClick={this.handleSubmit}
                variant='contained'
                color='primary'
              >
                Uložit změny
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </div>
    );
  }
}

Settings.propTypes = {
  classes: PropTypes.object.isRequired,
  login: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  auth: PropTypes.string,
};

export default withRoot(withStyles(styles)(Settings));
