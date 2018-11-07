import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import withRoot from '../withRoot';
import {Link} from 'react-router-dom';

const styles = theme => ({
    root: {
        textAlign: 'center',
        paddingTop: theme.spacing.unit * 20,
    },
});

class Login extends React.Component {
    state = {
        open: false,
    };

    handleClose = () => {
        this.setState({
            open: false,
        });
    };

    handleClick = () => {
        this.setState({
            open: true,
        });
    };

    render() {
        const { classes } = this.props;
        const { open } = this.state;

        return (
            <div className={classes.root}>
                <AppBar
                    title="Login"
                />
                <TextField
                    hintText="Enter your Username"
                    floatingLabelText="Username"
                    onChange={(event,newValue) => this.setState({username:newValue})}
                />
                <br/>
                <TextField
                    type="password"
                    hintText="Enter your Password"
                    floatingLabelText="Password"
                    onChange = {(event,newValue) => this.setState({password:newValue})}
                />
                <br/>
                <Link to={'employee'}>
                    <Button variant="contained" color="secondary" className={classes.button} onClick={(event) => this.handleClick(event)} >
                        Přihlásit
                    </Button>
                </Link>
            </div>
        );
    }
}

Login.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Login));
