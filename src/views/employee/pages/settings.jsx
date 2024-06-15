import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import withRoot from '../../../withRoot';
import styles from '../../../styles';
import { saveSettings, loadSettings } from '../../../storage';

const SETTINGS_KEY = 'employee_notifications';
const DEFAULTS = {
  notifshift: true,
  notif: true,
  notifmail: true,
  notifcancelshift: true,
};

const NOTIF_OPTIONS = [
  { key: 'notifshift', label: 'Notifikace o vypsání nových směn' },
  { key: 'notif', label: 'Chci dostávat notifikace' },
  { key: 'notifmail', label: 'Posílat na email' },
  { key: 'notifcancelshift', label: 'Notifikace o zrušení směny' },
];

class Settings extends React.Component {
  constructor(props) {
    super(props);
    /* ── Load notification prefs from localStorage (#3) ── */
    this.state = loadSettings(SETTINGS_KEY, DEFAULTS);
  }

  handleChange = (name) => (event) => {
    const val = event.target.checked;
    this.setState({ [name]: val }, () =>
      saveSettings(SETTINGS_KEY, this.state),
    );
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.pageRoot}>
        <Grid
          container
          direction='column'
          justify='center'
          alignItems='center'
          spacing={8}
        >
          <Grid item xs={12} sm={6} md={4} style={{ textAlign: 'left' }}>
            <Typography
              variant='subtitle1'
              color='textSecondary'
              gutterBottom
              style={{ fontWeight: 600 }}
            >
              Nastavení notifikací
            </Typography>
            {NOTIF_OPTIONS.map((opt) => (
              <Grid item xs={12} key={opt.key}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!this.state[opt.key]}
                      onChange={this.handleChange(opt.key)}
                      value={opt.key}
                      color='primary'
                    />
                  }
                  label={opt.label}
                />
              </Grid>
            ))}
            <Typography
              variant='caption'
              color='textSecondary'
              style={{ marginTop: 12, display: 'block' }}
            >
              Nastavení jsou uložena automaticky v prohlížeči.
            </Typography>
          </Grid>
        </Grid>
      </div>
    );
  }
}

Settings.propTypes = { classes: PropTypes.object.isRequired };

export default withRoot(withStyles(styles)(Settings));
