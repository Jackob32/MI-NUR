import React from 'react';
import PropTypes from 'prop-types';
import Cal from '../../../components/calendar/Calendar';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Title from '../../../components/title/Title';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import {withStyles} from '@material-ui/core/styles';
import withRoot from '../../../withRoot';
import styles from '../../../styles';
import Autocomplete from "../../../components/autocomplete/Autocomplete";
import {UserOptions as UserOptions} from "../../../data"
import Button from "@material-ui/core/Button/Button";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";

class Home extends React.Component {
    state = {
        freeshifts: true,
        partialshifts: true,
        fullshifts: true,
        searchEmployee: ""
    };

    handleChange = name => event => {
        this.setState({[name]: event.target.checked});
    };


    handleSearchChange = (value) => {
        let email = "";
        if (value && value.value && value.value.email) email = value.value.email;

        this.setState({
            searchEmployee: email,
        });

        console.log(value)
    };


    render() {

        const {classes} = this.props;
        const {freeshifts, partialshifts, fullshifts} = this.state;
        const error = [freeshifts, partialshifts, fullshifts].filter(v => v).length < 1;

        return (
            <div className={classes.root}>

                <Grid container spacing={16}>

                    <Grid item xs={12} sm={6}>

                        <FormControl component="fieldset" className={classes.formControl}>
                            <FormGroup>
                                {error && <FormHelperText>Vyberte nejméně jednu z možností</FormHelperText>}
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={freeshifts} onChange={this.handleChange('freeshifts')}
                                                  value="freeshifts"/>
                                    }
                                    label="Volné směny"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={partialshifts} onChange={this.handleChange('partialshifts')}
                                                  value="partialshifts"/>
                                    }
                                    label="Částečně zaplněné"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={fullshifts}
                                            onChange={this.handleChange('fullshifts')}
                                            value="fullshifts"
                                        />
                                    }
                                    label="Zcela obsazené směny"
                                />
                            </FormGroup>

                        </FormControl>

                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <div className={classes.grow}/>
                        <div className={classes.search}>
                            <Grid container spacing={8} alignItems="flex-end">
                                <Grid item>


                                    <SearchIcon/>


                                </Grid>
                                <Autocomplete

                                    onChange={this.handleSearchChange}
                                    onSubmit={this.handleSearchChange}
                                    id="input-with-icon-grid"
                                    label="Hledat Uživatele"
                                    className={classes.textField}
                                    options={UserOptions}
                                />
                                <Grid item>

                                </Grid>
                            </Grid>

                        </div>
                        <Grid container spacing={8} alignItems="center">
                        <Grid item>

                            <Button variant="contained" onClick={this.handleSubmit} color="secondary">
                                Zveřejnit směny
                            </Button>

                            <Button variant="contained" onClick={this.handleClose} color="primary">
                                Uzavřít směny
                            </Button>

                        </Grid>
                    </Grid>
                    </Grid>

                </Grid>
                    <Grid item xs>

                        <Cal freeshifts={this.state.freeshifts}
                             partialshifts={this.state.partialshifts}
                             fullshifts={this.state.fullshifts}
                             searchEmployee={this.state.searchEmployee}
                             auth={"manager"}
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
