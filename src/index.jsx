import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Grid from '@material-ui/core/Grid';
import {createBrowserHistory} from 'history';
import {Route, Router, Switch} from 'react-router-dom';
import indexRoutes from './routes/index';
import Index from './views/';
import CssBaseline from '@material-ui/core/CssBaseline';
import * as serviceWorker from './serviceWorker';

let history = createBrowserHistory();

ReactDOM.render(
    <div>
        <CssBaseline/>
        <Router history={history}>
            <Grid item xs={12}>
                <Switch>
                    <Route path={'/'} component={Index} exact/>
                    <Route path={'/login'} component={Index} exact/>
                    {indexRoutes.map((prop, key) => {
                        return <Route {...prop} key={key}/>;
                    })}
                </Switch>
            </Grid>
        </Router>
    </div>,
    document.querySelector('#root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();