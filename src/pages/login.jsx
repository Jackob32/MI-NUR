import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {Link} from 'react-router-dom';

const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    },
    margin: {
        margin: theme.spacing.unit,
    },
    withoutLabel: {
        marginTop: theme.spacing.unit * 3,
    },
    textField: {
        flexBasis: 200,
    },
});


class Login extends React.Component {
    state = {
        username: '',
        password: '',
        weight: '',
        weightRange: '',
        showPassword: false,
        error: "",
    };

    handleChange = prop => event => {
        this.setState({[prop]: event.target.value});
    };

    handleClickShowPassword = () => {
        this.setState(state => ({showPassword: !state.showPassword}));
    };

    handleClick = () => {
        this.setState({error: "Uživatelské jméno " + this.state.username + " nebo heslo neexistuje"});
    };

    render() {
        const {classes} = this.props;
        let LoginRedirect = "";
        let error = "";
        if (this.state.username === this.props.manager) {
            LoginRedirect = "/manager";
        } else if (this.state.username === this.props.employee) {
            LoginRedirect = "/employee";
        } else {
            error = this.state.error;
        }

        return (
            <div className={classes.root}>
                <form className={classes.container} noValidate autoComplete="off">

                    <Grid container spacing={12}>
                        <Grid item xs>
                        </Grid>
                        <Grid item xs={8} md={4}>
                            <Paper className={classes.root} elevation={1}>
                                <Typography variant="h5" component="h3">
                                    Správce Směn
                                </Typography>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Uživatelské Jméno nebo Email"
                                        id="adornment-username"
                                        type={this.state.username ? 'text' : 'password'}
                                        value={this.state.username}
                                        onChange={this.handleChange('username')}
                                        className={classes.textField}
                                        margin="normal"
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel htmlFor="adornment-password">Heslo</InputLabel>
                                        <Input
                                            fullWidth
                                            id="adornment-password"
                                            type={this.state.showPassword ? 'text' : 'password'}
                                            value={this.state.password}
                                            onChange={this.handleChange('password')}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="Toggle password visibility"
                                                        onClick={this.handleClickShowPassword}
                                                    >
                                                        {this.state.showPassword ? <Visibility/> : <VisibilityOff/>}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12}>
                                    <br/>
                                    <br/>
                                    <Button fullWidth label={"Přihlásit se"} component={Link}
                                            to={LoginRedirect} margin="normal"
                                            variant="contained" color="primary"
                                            onClick={this.handleClick}
                                    >
                                        Přihlásit se
                                    </Button>
                                    <br/> <br/>
                                    <Typography style={{color: "red"}} align={"center"} variant="caption"
                                                component="p">{error}       </Typography>
                                    <hr/>
                                    <Typography align={"right"} variant="body1" component="p">
                                        <Link to={"/"} activeClassName="current">Zapoměli jste heslo?</Link>
                                    </Typography>

                                </Grid>
                            </Paper>

                        </Grid>
                        <Grid item xs>
                        </Grid>
                    </Grid>
                </form>


            </div>
        );
    }
}

Login.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Login);