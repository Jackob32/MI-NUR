import React from 'react';
import PropTypes from 'prop-types';
import Navigation from '../../components/navigation/Navigation';
import Grid from '@material-ui/core/Grid';
import { Route, Switch } from 'react-router-dom';
import Profile from '../../components/profile/Profile';
import Settings from './pages/settings';
import Home from './pages/home';

import { withStyles } from '@material-ui/core/styles';
import withRoot from '../../withRoot';
import styles from '../../styles';

import {EmployeeData as Data} from '../../data'



class Employee extends React.Component {
    state = {
        navData:Data,
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

        return (
            <div className={classes.root}>
                  <Grid
                    container
                    direction="row"
                    justify="center"

                >
                    <Grid item xs={8}>
                        <Navigation data={this.state.navData} bell={true}/>
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
