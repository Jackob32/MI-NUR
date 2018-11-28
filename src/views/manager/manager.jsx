import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import withRoot from '../../withRoot';
import Navigation from "../../components/navigation/Navigation";
import Home from "./pages/home";
import Settings from '../../components/settings/Settings';
import Usermanager from "./pages/usermanager";

import Grid from '@material-ui/core/Grid';
import {Route, Switch} from 'react-router-dom';

import styles from '../../styles';
import {ManagerData as Data} from '../../data'

class Manager extends React.Component {
    state = {
        navData: Data,
        open: false,
    };

    handleSubmit = (user) => {
        this.setState({
            navData: {
                ...this.state.navData,
                login: user
            },

        });
    };

    render() {
        const {classes} = this.props;

        return (
            <div className={classes.root}>
                <Grid
                    container
                    direction="row"
                    justify="center"
                >
                    <Grid item xs={12} md={10} lg={8}>
                        <Navigation data={this.state.navData}/>
                    </Grid>

                    <Grid item xs={12} md={10} lg={8}>
                        <Switch>
                            <Route path={'/manager'} component={Home} exact/>

                            <Route path={'/manager/settings'}
                                   render={(props) => <Settings {...props} auth={"manager"} login={this.state.navData.login}
                                                               handleSubmit={this.handleSubmit}/>}/>

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
