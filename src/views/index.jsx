import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import withRoot from '../withRoot';
import {ManagerData, EmployeeData } from '../data'

import Login from '../pages/login';

const styles = theme => ({
    root: {
        textAlign: 'center',
        paddingTop: theme.spacing.unit * 20,
    },
});

class Index extends React.Component {
    state = {
        open: false,
    };

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Login manager={ManagerData.login.email} employee={EmployeeData.login.email}/>
            </div>
        );
    }
}

Index.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withRoot(withStyles(styles)(Index));

