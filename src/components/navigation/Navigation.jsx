import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import EventNote from '@material-ui/icons/EventNote';
import ExitToApp from '@material-ui/icons/ExitToApp';
import { Link } from 'react-router-dom';

const styles = (theme) => ({
  appBar: {
    marginBottom: theme.spacing.unit * 2.5,
  },
  toolbar: {
    paddingLeft: theme.spacing.unit * 3,
    paddingRight: theme.spacing.unit * 3,
    minHeight: 58,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing.unit * 4,
    flexShrink: 0,
  },
  brandIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 8,
    background: 'rgba(255,255,255,0.14)',
    border: '1px solid rgba(255,255,255,0.18)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.unit * 1.25,
    flexShrink: 0,
  },
  brandIcon: {
    fontSize: 17,
    color: '#fff',
  },
  brandName: {
    fontWeight: 800,
    letterSpacing: '-0.02em',
    whiteSpace: 'nowrap',
    fontSize: '1rem',
  },
  tabs: {
    flexGrow: 1,
  },
  tab: {
    minWidth: 'auto',
    opacity: 0.7,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
    '&$selected': { opacity: 1 },
    [theme.breakpoints.up('sm')]: { minWidth: 110 },
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
    marginLeft: theme.spacing.unit * 2,
    gap: theme.spacing.unit,
  },
  avatar: {
    width: 34,
    height: 34,
    fontSize: '0.75rem',
    fontWeight: 800,
    background: 'linear-gradient(135deg, #34D399 0%, #059669 100%)',
    color: '#fff',
    boxShadow: '0 0 0 2px rgba(255,255,255,0.2)',
    flexShrink: 0,
  },
  userName: {
    whiteSpace: 'nowrap',
    fontSize: '0.84rem',
    fontWeight: 500,
    opacity: 0.88,
    marginLeft: theme.spacing.unit * 0.5,
    marginRight: theme.spacing.unit * 0.5,
    [theme.breakpoints.down('sm')]: { display: 'none' },
  },
  sep: {
    width: 1,
    height: 18,
    background: 'rgba(255,255,255,0.2)',
    [theme.breakpoints.down('sm')]: { display: 'none' },
  },
  logoutButton: {
    whiteSpace: 'nowrap',
    minWidth: 'auto',
    fontSize: '0.74rem',
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    opacity: 0.75,
    borderRadius: 6,
    '&:hover': { opacity: 1, background: 'rgba(255,255,255,0.1)' },
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing.unit * 0.5,
      minWidth: 0,
    },
  },
  logoutLabel: {
    [theme.breakpoints.down('xs')]: { display: 'none' },
  },
  logoutIcon: {
    [theme.breakpoints.up('sm')]: { display: 'none' },
  },
});

class Navigation extends React.Component {
  state = { value: 0 };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { firstname, lastname } = this.props.data.login;
    const initials =
      `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase();

    return (
      <AppBar position='static' className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <div className={classes.brand}>
            <div className={classes.brandIconWrap}>
              <EventNote className={classes.brandIcon} />
            </div>
            <Typography
              variant='subtitle1'
              color='inherit'
              className={classes.brandName}
            >
              Správce Směn
            </Typography>
          </div>

          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor='secondary'
            textColor='inherit'
            className={classes.tabs}
          >
            {this.props.data.tabs.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={tab.label}
                component={Link}
                to={tab.to}
                className={classes.tab}
              />
            ))}
          </Tabs>

          <div className={classes.userSection}>
            <Tooltip title={`${firstname} ${lastname}`} placement='bottom'>
              <Avatar className={classes.avatar}>{initials}</Avatar>
            </Tooltip>
            <Typography
              variant='body2'
              color='inherit'
              className={classes.userName}
            >
              {firstname} {lastname}
            </Typography>
            <div className={classes.sep} />
            <Tooltip title='Odhlásit se' placement='bottom'>
              <Button
                color='inherit'
                component={Link}
                to={this.props.data.logout}
                className={classes.logoutButton}
                size='small'
              >
                <span className={classes.logoutLabel}>Odhlásit se</span>
                <ExitToApp className={classes.logoutIcon} />
              </Button>
            </Tooltip>
          </div>
        </Toolbar>
      </AppBar>
    );
  }
}

Navigation.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.shape({
    tabs: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.number.isRequired,
        label: PropTypes.string.isRequired,
        to: PropTypes.string.isRequired,
      }),
    ).isRequired,
    login: PropTypes.shape({
      firstname: PropTypes.string.isRequired,
      lastname: PropTypes.string.isRequired,
    }).isRequired,
    logout: PropTypes.string.isRequired,
  }).isRequired,
};

export default withStyles(styles)(Navigation);
