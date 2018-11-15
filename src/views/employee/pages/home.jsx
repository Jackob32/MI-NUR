import React from 'react';
import PropTypes from 'prop-types';
import Cal from '../../../components/calendar/Calendar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { Router, Route, Switch } from 'react-router-dom';
import Title from '../../../components/title/Title';


import { withStyles } from '@material-ui/core/styles';
import withRoot from '../../../withRoot';

import styles from '../../../theme';
import FormControl from "@material-ui/core/FormControl/FormControl";
import FormGroup from "@material-ui/core/FormGroup/FormGroup";
import FormHelperText from "@material-ui/core/FormHelperText/FormHelperText";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import SearchIcon from "@material-ui/core/SvgIcon/SvgIcon";
import TextField from "@material-ui/core/TextField/TextField";


class Home extends React.Component {
    state = {
        open: false,
        freeshifts: true,
        partialshifts: true,
        fullshifts: true,
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

        const {classes} = this.props;
        const {open} = this.state;


        const {freeshifts, partialshifts, fullshifts} = this.state;
        const error = [freeshifts, partialshifts, fullshifts].filter(v => v).length < 1;

        return (
            <div className={classes.root}>

                <Title title="Přehled" />
                <Grid container spacing={16}>

                    <Grid item xs={12} sm={6}>

                        <FormControl component="fieldset" className={classes.formControl}>
                            <FormGroup>


                                {error && <FormHelperText>Vyberte nejméně jednu z možností</FormHelperText>}

                                <FormControlLabel
                                    control={
                                    <Checkbox checked={partialshifts} onChange={this.handleChange('partialshifts')} value="partialshifts"/>
                                }
                                    label="Moje směny"
                                />

                                <FormControlLabel
                                    control={
                                        <Checkbox checked={freeshifts} onChange={this.handleChange('freeshifts')} value="freeshifts"/>
                                    }
                                    label="Volné směny"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={fullshifts}
                                            onChange={this.handleChange('fullshifts')}
                                            value="fullshifts"
                                        />
                                    }
                                    label="Obsazené Směny"
                                />

                            </FormGroup>

                        </FormControl>

                    </Grid>



                </Grid>

                <Grid item xs>
                <Cal
                    searchEmployee={"Petr"}
                    freeshifts={this.state.freeshifts}
                    partialshifts={this.state.partialshifts}
                    fullshifts={this.state.fullshifts}
                    auth={"employee"}
                />

                </Grid>
            </div>
        );
    }
}

Home.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Home));
