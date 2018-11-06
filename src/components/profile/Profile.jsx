import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import green from '@material-ui/core/colors/green';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Title from '../title/Title';

//import { withStyles } from '@material-ui/core/styles';
import withRoot from '../../withRoot';

import styles from '../../theme';


class Profile extends React.Component {
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

        const theme = createMuiTheme({
            palette: {
                primary: green,
            },
            typography: {
                useNextVariants: true,
            },
        });

        return (
            <div className={classes.root}>
                <Title title="Profil" />

                <form className={classes.container} noValidate autoComplete="off">

                    <Grid container spacing={12}>
                        <Grid item xs>
                        </Grid>
                        <Grid item xs={4}>
                        <Grid item xs={12}>


                            <TextField
                                label="Jméno"
                                className={classes.textField}
                                margin="normal"
                                fullWidth
                            />

                        </Grid>
                        <Grid item xs={12}>

                            <TextField
                                label="Příjmení"
                                className={classes.textField}
                                margin="normal"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>


                            <TextField
                                label="Email"
                                className={classes.textField}
                                margin="normal"
                                type={"Email"}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>

<br />
                            <Button  margin="normal" variant="contained" color="primary" >
                                Uložit
                            </Button>

                        </Grid>
                    </Grid>
                        <Grid item xs>
                        </Grid>
                    </Grid>
                </form>

            </div>
        );
    }
}

Profile.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Profile));
