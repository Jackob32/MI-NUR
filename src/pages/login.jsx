import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import EventNote from '@material-ui/icons/EventNote';
import { Link } from 'react-router-dom';

const styles = (theme) => ({
  card: {
    padding: `${theme.spacing.unit * 5}px ${theme.spacing.unit * 5}px ${theme.spacing.unit * 4}px`,
    borderRadius: 20,
    maxWidth: 420,
    width: '100%',
    boxShadow: '0 32px 64px rgba(0,0,0,0.30), 0 0 0 1px rgba(255,255,255,0.06)',
    background: '#ffffff',
    position: 'relative',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: theme.spacing.unit * 4,
    textAlign: 'center',
  },
  appIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 16,
    background: '#1A73E8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.unit * 2.5,
    boxShadow: '0 2px 8px rgba(26,115,232,0.30)',
  },
  appIcon: { fontSize: 32, color: '#fff' },
  appTitle: {
    fontWeight: 800,
    color: '#0F172A',
    marginBottom: theme.spacing.unit * 0.75,
    letterSpacing: '-0.025em',
    fontSize: '1.65rem',
    lineHeight: 1.15,
  },
  appSubtitle: {
    color: '#94A3B8',
    fontSize: '0.875rem',
    fontWeight: 400,
  },
  demoSection: {
    display: 'flex',
    gap: theme.spacing.unit * 1.5,
    marginBottom: theme.spacing.unit * 3,
  },
  demoBtn: {
    flex: 1,
    padding: `${theme.spacing.unit * 1.25}px`,
    borderRadius: 12,
    fontWeight: 700,
    fontSize: '0.82rem',
    textTransform: 'none',
    letterSpacing: 0,
    border: '1.5px solid',
  },
  demoBtnManager: {
    borderColor: '#1A73E8',
    color: '#1A73E8',
    background: 'rgba(26,115,232,0.04)',
    '&:hover': { background: 'rgba(26,115,232,0.10)', borderColor: '#1557B0' },
  },
  demoBtnEmployee: {
    borderColor: '#34A853',
    color: '#34A853',
    background: 'rgba(52,168,83,0.04)',
    '&:hover': { background: 'rgba(52,168,83,0.10)', borderColor: '#1E8E3E' },
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.unit * 1.5,
    marginBottom: theme.spacing.unit * 2,
    '& hr': {
      flex: 1,
      border: 'none',
      borderTop: '1px solid #E2E8F0',
    },
    '& span': {
      fontSize: '0.75rem',
      color: '#94A3B8',
      fontWeight: 500,
      whiteSpace: 'nowrap',
    },
  },
  submitButton: {
    marginTop: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 2,
    padding: `${theme.spacing.unit * 1.5}px`,
    fontSize: '0.95rem',
    fontWeight: 700,
    background: '#1A73E8',
    boxShadow: 'none',
    '&:hover': {
      background: '#1557B0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
    },
    '&$disabled': {
      background: '#F1F3F4',
      boxShadow: 'none',
      color: '#80868B',
    },
  },
  errorText: {
    marginTop: theme.spacing.unit * 1.5,
    fontSize: '0.8rem',
    fontWeight: 500,
    color: '#EA4335',
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 1.5}px`,
    background: 'rgba(234,67,53,0.06)',
    borderRadius: 8,
    borderLeft: '3px solid #EA4335',
  },
  footerLink: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing.unit * 0.5,
  },
  link: {
    color: '#94A3B8',
    textDecoration: 'none',
    fontSize: '0.8rem',
    fontWeight: 500,
    '&:hover': { color: '#4338CA', textDecoration: 'underline' },
  },
});

class Login extends React.Component {
  state = { username: '', password: '', showPassword: false, submitted: false };

  handleChange = (prop) => (event) => {
    this.setState({ [prop]: event.target.value, submitted: false });
  };
  handleClickShowPassword = () => {
    this.setState((s) => ({ showPassword: !s.showPassword }));
  };
  handleClick = () => {
    this.setState({ submitted: true });
  };

  getRedirect() {
    if (this.state.username === this.props.manager) return '/manager';
    if (this.state.username === this.props.employee) return '/employee';
    return '';
  }

  render() {
    const { classes } = this.props;
    const redirect = this.getRedirect();
    const showError = this.state.submitted && !redirect && this.state.username;

    return (
      <Paper className={classes.card} elevation={0}>
        <div className={classes.header}>
          <div className={classes.appIconWrap}>
            <EventNote className={classes.appIcon} />
          </div>
          <Typography variant='h4' className={classes.appTitle}>
            Správce Směn
          </Typography>
          <Typography className={classes.appSubtitle}>
            Přihlaste se ke svému účtu
          </Typography>
        </div>

        {/* ── Demo quick-login buttons ─────────────────────────── */}
        <div className={classes.demoSection}>
          <Button
            component={Link}
            to='/manager'
            className={`${classes.demoBtn} ${classes.demoBtnManager}`}
            variant='outlined'
          >
            🗂 Demo vedoucí
          </Button>
          <Button
            component={Link}
            to='/employee'
            className={`${classes.demoBtn} ${classes.demoBtnEmployee}`}
            variant='outlined'
          >
            👤 Demo zaměstnanec
          </Button>
        </div>

        <div className={classes.divider}>
          <hr />
          <span>nebo se přihlaste emailem</span>
          <hr />
        </div>

        <TextField
          label='Email'
          id='login-username'
          type='email'
          value={this.state.username}
          onChange={this.handleChange('username')}
          margin='normal'
          fullWidth
          autoFocus
          autoComplete='email'
          error={!!showError}
        />

        <FormControl fullWidth margin='normal'>
          <InputLabel htmlFor='login-password'>Heslo</InputLabel>
          <Input
            id='login-password'
            type={this.state.showPassword ? 'text' : 'password'}
            value={this.state.password}
            onChange={this.handleChange('password')}
            autoComplete='current-password'
            endAdornment={
              <InputAdornment position='end'>
                <IconButton
                  aria-label='Zobrazit nebo skrýt heslo'
                  onClick={this.handleClickShowPassword}
                >
                  {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>

        {showError && (
          <Typography variant='caption' className={classes.errorText}>
            Uživatel „{this.state.username}" nebyl nalezen.
          </Typography>
        )}

        <Button
          fullWidth
          component={Link}
          to={redirect}
          variant='contained'
          color='primary'
          className={classes.submitButton}
          onClick={this.handleClick}
          disabled={!this.state.username}
        >
          Přihlásit se
        </Button>

        <div className={classes.footerLink}>
          <Link to='/' className={classes.link}>
            Zapomněli jste heslo?
          </Link>
        </div>
      </Paper>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
  manager: PropTypes.string.isRequired,
  employee: PropTypes.string.isRequired,
};

export default withStyles(styles)(Login);
