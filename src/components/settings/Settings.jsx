import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import {withStyles} from '@material-ui/core/styles';
import Title from '../title/Title';
import withRoot from '../../withRoot';
import styles from '../../styles';
import {default as Other} from '../../views/employee/pages/settings';


import FormControl from "@material-ui/core/FormControl/FormControl";
import Typography from "@material-ui/core/Typography/Typography";

class Settings extends React.Component {

    handleDialogChange = prop => event => {
        let val = event.target.value;
        this.setState(prevState => {
            return {
                [prop]: prevState.edituser[prop] = val
            };
        });
    };
    handleSubmit = () => {

        this.props.handleSubmit(this.state.edituser);

    };

    constructor(props) {

        super(props);
        this.state = {
            open: false,
            edituser: this.props.login
        };
    }

    render() {
        const {classes} = this.props;


        return (
            <div className={classes.root}>
                {this.props.auth==="employee" &&

<div>
                <Typography variant="h6" color="inherit">
                    Nastavení notifikací
                </Typography>
                <Other />
    <br/>
            </div> }

                <Typography variant="h6" color="inherit">
                    Nastavení Uživatele
                </Typography>
                <Grid     container
                          direction="column"
                          justify="center"
                          alignItems="center" spacing={8} >




                        <Grid item xs={12} md={6}>
                            <Grid item xs={12}>

                                <FormControl  variant="outlined">
                                    <TextField
                                        label="Jméno"
                                        className={classes.textField}
                                        margin="normal"
                                        value={this.state.edituser.firstname || ""}
                                        onChange={this.handleDialogChange('firstname')}
                                        fullWidth
                                    />
                                </FormControl>

                            </Grid>
                            <Grid item xs={12}>
                                <FormControl  variant="outlined">
                                    <TextField
                                        label="Příjmení"
                                        className={classes.textField}
                                        margin="normal"
                                        value={this.state.edituser.lastname || ""}
                                        onChange={this.handleDialogChange('lastname')}
                                        fullWidth
                                    /> </FormControl>

                            </Grid>
                            <Grid item xs={12}>

                                <FormControl variant="outlined">
                                    <TextField
                                        label="Email"
                                        className={classes.textField}
                                        margin="normal"
                                        value={this.state.edituser.email || ""}
                                        onChange={this.handleDialogChange('email')}
                                        type={"Email"}
                                        fullWidth
                                    /> </FormControl>

                            </Grid>
                            <Grid item xs={12}>

                                <br/>
                                <Button onClick={this.handleSubmit} margin="normal" variant="contained" color="primary">
                                    Uložit
                                </Button>

                            </Grid>
                        </Grid>



                    </Grid>


            </div>
        );
    }
}

Settings.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Settings));
