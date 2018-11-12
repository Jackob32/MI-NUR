import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Title from '../../../components/title/Title';
import Usertable from '../../../components/usertable/Usertable';
import {events, rows} from '../../../data';

import withRoot from '../../../withRoot';
import styles from '../../../theme';
import {Link} from "react-router-dom";
import Button from "@material-ui/core/Button/Button";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import Grid from "@material-ui/core/Grid/Grid";
import FormControl from "@material-ui/core/FormControl/FormControl";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import Input from "@material-ui/core/Input/Input";
import TextField from "@material-ui/core/TextField/TextField";
import Autocomplete from "../../../components/autocomplete/Autocomplete";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import update from "react-addons-update";

const actionsStyles = theme => ({
    root: {
        flexShrink: 0,
        color: theme.palette.text.secondary,
        marginLeft: theme.spacing.unit * 2.5,
    },
});

class Usermanager extends React.Component {

    constructor(props) {

        super(props);

        //here we create the filtering based on given props

        // props.value = props.value || '';

        this.state = {
            rows: rows,
            isAddModalOpen: false,
            isEditModalOpen: false,
        edituser:{
            id:rows.length,
            firstname: "",
                lastname: "",
            worktime: 0,
            thisweekworktime: 0,
            email: ""
        },
        };
        if (this.props.bell === true) this.bell = true;
    };

    handleClickOpen = (e) => {
        this.setState({isEditModalOpen: true});
    };
    handleClose = () => {
        this.setState({isEditModalOpen: false});
    };
    handleSubmit = () => {

        this.setState({
            rows: [...this.state.rows,this.state.edituser],
            edituser:{
                id:this.state.rows.length+1,
                firstname: "",
                lastname: "",
                worktime: 0,
                thisweekworktime: 0,
                email: ""
            },
        });
        console.log(this.state);

        this.handleClose();
    };

    handleDialogChange = prop => event => {
        let val = event.target.value;
        this.setState(prevState => {
            return {
                [prop]: prevState.edituser[prop] = val
            };
        });


        console.log(this.state);
    };
    render() {
        const { classes } = this.props;
      return (

            <div>

                <Title title="Správa Uživatelů" />

                    <Button variant="contained" onClick={this.handleClickOpen}  color="primary">
                        Nový uživatel
                    </Button>

<Usertable data={this.state.rows}/>

                <Dialog
                    open={this.state.isEditModalOpen}
                    onClose={this.handleClose}
                    aria-labelledby="responsive-dialog-title"
                    maxWidth="xs"

                >
                    <DialogTitle id="responsive-dialog-title">Úprava Směny</DialogTitle>
                    <DialogContent>


                        <DialogContentText>
                            Nový uživatel

                        </DialogContentText>


                        <Grid container spacing={16}>
                            <Grid item xs={12} alignContent={"center"}>
                                <FormControl fullWidth className={classes.formControl} variant="outlined">
                                    <InputLabel htmlFor="adornment-amount">Jméno</InputLabel>
                                    <Input
                                        id="adornment-amount"
                                        type="text"
                                        value={this.state.edituser.firstname || ""}
                                        label="Jméno"
                                        onChange={this.handleDialogChange('firstname')}

                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth className={classes.formControl} variant="outlined">
                                    <InputLabel htmlFor="adornment-amount">Příjmení</InputLabel>
                                    <Input
                                        id="adornment-amount"
                                        type="text"
                                        value={this.state.edituser.lastname || ""}
                                        label="Příjmení"
                                        onChange={this.handleDialogChange('lastname')}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth className={classes.formControl} variant="outlined">
                                    <InputLabel htmlFor="adornment-amount">Email</InputLabel>
                                    <Input
                                        id="adornment-amount"
                                        type="email"
                                        value={this.state.edituser.email || ""}
                                        label="email"
                                        onChange={this.handleDialogChange('email')}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <FormControl fullWidth className={classes.formControl} variant="outlined">
                                    <InputLabel htmlFor="adornment-amount">Uvazek</InputLabel>
                                    <Input
                                        id="adornment-amount"
                                        type="number"
                                        value={this.state.edituser.worktime || ""}
                                        label="Uvazek"
                                        onChange={this.handleDialogChange('worktime')}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>

                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" onClick={this.handleSubmit} color="secondary">
                            Uložit
                        </Button>

                        <Button variant="contained" onClick={this.handleClose} color="primary">
                            Zrušit
                        </Button>
                    </DialogActions>
                </Dialog>

            </div>
        );
    }
}

Usermanager.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Usermanager);