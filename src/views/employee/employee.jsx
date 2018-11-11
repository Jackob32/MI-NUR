import React from 'react';
import PropTypes from 'prop-types';
import Cal from '../../components/calendar/Calendar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import Navigation from '../../components/navigation/Navigation';
import Grid from '@material-ui/core/Grid';
import { Router, Route, Switch } from 'react-router-dom';
import Profile from '../../components/profile/Profile';
import Settings from './pages/settings';
import Home from './pages/home';

import { withStyles } from '@material-ui/core/styles';
import withRoot from '../../withRoot';
import styles from '../../theme';
import Usermanager from "../manager/pages/usermanager";



var navData = {
    tabs: [
        {
            value: 0,
            label:"Home",
            to:"/employee"
        },
        {
            value: 1,
            label:"Profile",
            to:"/employee/profile"
        },
        {
            value: 2,
            label:"Settings",
            to:"/employee/settings"
        }

    ],

    login: {
        firstname:"Pepa",
        lastname:"Novák",
        email:"Pepa.Novák@gmail.com"

    },
    logout: "/employee/login",
    switch: "/manager",
};



class Employee extends React.Component {
    state = {
        navData:navData,
        open: false,
    };
    handleSubmit = (user) => {
        this.setState({
            navData: {...this.state.navData,
                login: user
            },

        });
    };

    render() {
        const { classes } = this.props;
        const { open } = this.state;

        return (
            <div className={classes.root}>
                  <Grid
                    container
                    direction="row"
                    justify="center"

                >
                    <Grid item xs={8}>
                        <Navigation data={navData} bell={true}/>
                    </Grid>

                    <Grid item xs={8}>
                        <Switch>
                            <Route path={'/employee'} component={Home} exact />

                            <Route path={'/employee/profile'} render={(props) => <Profile {...props} login={this.state.navData.login} handleSubmit={this.handleSubmit} />} />

                            <Route path={'/employee/settings'} component={Settings} />
                        </Switch>

                    </Grid>
                </Grid>
            </div>
        );
    }
}

Employee.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Employee));
