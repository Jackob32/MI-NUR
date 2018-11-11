import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import withRoot from '../../withRoot';
import Navigation from "../../components/navigation/Navigation";
import Home from "./pages/home";
import Profile from '../../components/profile/Profile';
import Usermanager from "./pages/usermanager";

import Grid from '@material-ui/core/Grid';
import {Route, Switch} from 'react-router-dom';

import styles from '../../theme';



var navData = {
    tabs: [
        {
            value: 0,
            label:"Přehled",
            to:"/manager"
        },
        {
            value: 1,
            label:"Můj profil",
            to:"/manager/profile"
        },
        {
            value: 2,
            label:"Správa uživatelů",
            to:"/manager/usermanager"
        }

    ],

    login: {
        firstname:"Jan",
        lastname:"Král",
email:"jan.kral@gmail.com"

    },

    logout: "/manager/login",
    switch: "/employee",


};


    class Manager extends React.Component {
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
            const {classes} = this.props;
            const {open} = this.state;

            return (
                <div className={classes.root}>
                    <Grid
                        container
                        direction="row"
                        justify="center"
                    >
                        <Grid item xs={8}>
                            <Navigation data={this.state.navData}/>
                        </Grid>

                        <Grid item xs={8}>
                    <Switch>
                        <Route path={'/manager'} component={Home} exact/>

                        <Route path={'/manager/profile'} render={(props) => <Profile {...props} login={this.state.navData.login} handleSubmit={this.handleSubmit} />} />
                        <Route path={'/manager/usermanager'} component={Usermanager}/>
                    </Switch>
                    </Grid>
                    </Grid>
                </div>
            );
        }
    }

Manager.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Manager));
