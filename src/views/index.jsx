import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import withRoot from '../withRoot';
import { ManagerData, EmployeeData } from '../data';
import Login from '../pages/login';

const styles = {
  root: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    background: `
            radial-gradient(ellipse at 18% 60%, rgba(99,102,241,0.20) 0%, transparent 52%),
            radial-gradient(ellipse at 82% 18%, rgba(5,150,105,0.12) 0%, transparent 48%),
            radial-gradient(ellipse at 65% 82%, rgba(67,56,202,0.12) 0%, transparent 44%),
            linear-gradient(160deg, #0b0b1e 0%, #15102e 45%, #0d1928 100%)
        `,
  },
  grid: {
    position: 'fixed',
    inset: 0,
    backgroundImage:
      'radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)',
    backgroundSize: '28px 28px',
    pointerEvents: 'none',
  },
};

class Index extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.grid} />
        <Login
          manager={ManagerData.login.email}
          employee={EmployeeData.login.email}
        />
      </div>
    );
  }
}

Index.propTypes = { classes: PropTypes.object.isRequired };

export default withRoot(withStyles(styles)(Index));
