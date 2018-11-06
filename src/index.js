import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { createBrowserHistory } from 'history';
import { Router, Route, Switch } from 'react-router-dom';
import indexRoutes from './routes/index';
import Index from './views/';
import login from './pages/login';

var hist = createBrowserHistory();



ReactDOM.render(
    <Router history={hist}>
        <Grid item xs={12}>
                <Switch>
                    <Route path={'/'} component={Index} exact />
                    <Route path={'/employee/login'} component={login} exact />
                    <Route path={'/manager/login'} component={login} exact />


                    {indexRoutes.map((prop, key) => {
                        return <Route {...prop} key={key} />;
                    })}
                </Switch>
  </Grid>
    </Router>,
    document.querySelector('#root')
);
