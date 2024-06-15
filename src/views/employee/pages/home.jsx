import React from 'react';
import PropTypes from 'prop-types';
import Cal from '../../../components/calendar/Calendar';
import StatCard from '../../../components/common/StatCard';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import grey from '@material-ui/core/colors/grey';
import withRoot from '../../../withRoot';
import { EmployeeData as Data } from '../../../data';
import { events as defaultEvents } from '../../../data';
import styles from '../../../styles';
import { loadEvents, loadSettings } from '../../../storage';
import { getEmployeeWorkload } from '../../../utils/shift';
import { COLORS } from '../../../constants/colors';
import {
  STORAGE_SETTINGS_KEY,
  DEFAULT_MANAGER_SETTINGS,
} from '../../../constants/calendar';

class Home extends React.Component {
  state = {
    freeshifts: true,
    partialshifts: true,
    fullshifts: false,
    showPast: false,
  };

  handleChange = (name) => (event) => {
    this.setState({ [name]: event.target.checked });
  };

  render() {
    const { classes } = this.props;
    const { freeshifts, partialshifts, fullshifts, showPast } = this.state;
    const noneSelected = ![freeshifts, partialshifts, fullshifts].some(Boolean);

    const mgr = loadSettings(STORAGE_SETTINGS_KEY, DEFAULT_MANAGER_SETTINGS);
    const interestMode = mgr.interestMode;
    const employeeShowCapacity = mgr.employeeShowCapacity !== false;
    const employeeShowAssignees = mgr.employeeShowAssignees !== false;
    const employeeShowOnlyAvailable = mgr.employeeShowOnlyAvailable === true;

    const allEvents = loadEvents(defaultEvents);
    const { totalShifts, weekHours, monthHours } = getEmployeeWorkload(
      Data.login.email,
      allEvents,
    );

    return (
      <div className={classes.pageRoot}>
        {/* ── Workload summary ─────────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            gap: 10,
            marginBottom: 14,
            flexWrap: 'wrap',
          }}
        >
          <StatCard
            label='Celkem směn'
            value={totalShifts}
            color={COLORS.blue}
          />
          <StatCard
            label='Hodiny / týden'
            value={`${weekHours} h`}
            color={COLORS.green}
          />
          <StatCard
            label='Hodiny / měsíc'
            value={`${monthHours} h`}
            color={COLORS.yellow}
          />

          {interestMode && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 14px',
                borderRadius: 8,
                background: '#E8F0FE',
                border: `1px solid ${COLORS.border}`,
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>🙋</span>
              <div>
                <div
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: COLORS.blue,
                  }}
                >
                  Režim zájmu
                </div>
                <div style={{ fontSize: '0.62rem', color: COLORS.ink2 }}>
                  Vyjadřujete zájem, vedoucí přiřazuje
                </div>
              </div>
            </div>
          )}
        </div>

        <Paper style={{ padding: '16px 24px', marginBottom: 16 }} elevation={1}>
          <Typography variant='subtitle2' color='textSecondary' gutterBottom>
            Zobrazit
          </Typography>
          {noneSelected && (
            <Typography variant='caption' color='error'>
              Vyberte nejméně jednu kategorii
            </Typography>
          )}
          <FormControl component='fieldset'>
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={partialshifts}
                    onChange={this.handleChange('partialshifts')}
                    value='partialshifts'
                  />
                }
                label={
                  <span
                    style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <span
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 3,
                        backgroundColor: green[500],
                        display: 'inline-block',
                        flexShrink: 0,
                      }}
                    />
                    Moje směny
                  </span>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={freeshifts}
                    onChange={this.handleChange('freeshifts')}
                    value='freeshifts'
                  />
                }
                label={
                  <span
                    style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <span
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 3,
                        backgroundColor: grey[500],
                        display: 'inline-block',
                        flexShrink: 0,
                      }}
                    />
                    Volné směny
                  </span>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={fullshifts}
                    onChange={this.handleChange('fullshifts')}
                    value='fullshifts'
                  />
                }
                label={
                  <span
                    style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <span
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 3,
                        backgroundColor: red[500],
                        display: 'inline-block',
                        flexShrink: 0,
                      }}
                    />
                    Obsazené směny
                  </span>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showPast}
                    onChange={this.handleChange('showPast')}
                    value='showPast'
                  />
                }
                label={
                  <span
                    style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <span
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 3,
                        backgroundColor: COLORS.slate,
                        display: 'inline-block',
                        flexShrink: 0,
                      }}
                    />
                    Minulé směny
                  </span>
                }
              />
            </FormGroup>
          </FormControl>
        </Paper>

        <Grid item xs={12}>
          <Cal
            searchEmployee={Data.login.email}
            freeshifts={freeshifts}
            partialshifts={partialshifts}
            fullshifts={fullshifts}
            showPastShifts={showPast}
            auth='employee'
            interestMode={interestMode}
            employeeShowCapacity={employeeShowCapacity}
            employeeShowAssignees={employeeShowAssignees}
            employeeShowOnlyAvailable={employeeShowOnlyAvailable}
          />
        </Grid>
      </div>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Home));
