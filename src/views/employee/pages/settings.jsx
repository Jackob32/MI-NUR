import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

import FormControlLabel from '@material-ui/core/FormControlLabel';


import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';

import Title from '../../../components/title/Title';

import withRoot from '../../../withRoot';

import styles from '../../../theme';


class Settings extends React.Component {
    state = {
        open: false,
    };

    handleChange = name => event => {
        this.setState({[name]: event.target.checked});
    };


    handleSearchChange= (e) => {
        this.setState({
            searchEmployee: e.target.value,
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

                <Title title="Nastavení" />

                <form className={classes.container} noValidate autoComplete="off">

                                  </form>

                <Grid container spacing={12}>
                    <Grid item xs>
                    </Grid>
                    <Grid item xs={4}>
                        <Grid item xs={12}>

                            <FormControlLabel
                                control={
                                    <Checkbox checked={true}  onChange={this.handleChange('freeshifts')} value="freeshifts"/>
                                }
                                label="Notifikace o vypsání nových směn"
                            />


                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox checked={true}  onChange={this.handleChange('partialshifts')} value="partialshifts"/>
                                }
                                label="Chci dostávat notifikace"
                            />
                        </Grid>
                        <Grid item xs={12}>

                            <FormControlLabel
                                control={
                                    <Checkbox checked={true}  onChange={this.handleChange('partialshifts')} value="partialshifts"/>
                                }
                                label="Posílat na email"
                            />
                        </Grid>
                        <Grid item xs={12}>

                            <FormControlLabel
                                control={
                                    <Checkbox checked={true}  onChange={this.handleChange('partialshifts')} value="partialshifts"/>
                                }
                                label="Notifikace o zrušení směny"
                            />
                        </Grid>

                        <Grid item xs={12}>

                            <Button variant="contained" color="secondary" theme={theme} className={classes.button} >
                                Uložit
                            </Button>

                        </Grid>
                    </Grid>
                    <Grid item xs>
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
