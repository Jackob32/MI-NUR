import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Title from '../../../components/title/Title';
import Usertable from '../../../components/usertable/Usertable';
import {users as rows} from '../../../data';
import styles from '../../../styles';
import Button from "@material-ui/core/Button/Button";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import Grid from "@material-ui/core/Grid/Grid";
import FormControl from "@material-ui/core/FormControl/FormControl";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import Input from "@material-ui/core/Input/Input";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Select from '@material-ui/core/Select';
import withRoot from "../../../withRoot";
import update from "react-addons-update";


class Usermanager extends React.Component {

    handleClickOpen = (e) => {
        this.setState({isEditModalOpen: true});
    };
    handleClose = () => {
        this.setState({isEditModalOpen: false});
    };
    handleSubmit = () => {

        let index = this.state.rows.findIndex(item => item.id === this.state.edituser.id);

        if(index>=0){
            this.setState((prevState) =>{
                return {
                    rows: update(prevState.rows, {[index]: {$set: prevState.edituser}})
                }
            });

        }else {
            this.setState((prevState) => {
                return {
                    rows: [...this.state.rows, this.state.edituser],
                    edituser: {
                        id: this.state.rows.length + 1,
                        firstname: "",
                        lastname: "",
                        worktime: 0,
                        thisweekworktime: 0,
                        email: ""
                    }
                };
            });
        }
        console.log(this.state);

        this.handleClose();
    };

    handleDelete = (id) => {
        let index = this.state.rows.findIndex(item => item.id === id);
        this.setState((prevState) => {
            let tmpArr = [...prevState.rows];
            tmpArr.splice(index, 1);
            return {rows: tmpArr,};
        });
    };
    handleEdit = (id) => {
        this.handleClickOpen();



        let index = this.state.rows.findIndex(item => item.id === id);
        this.setState(prevState => {
            return {
                edituser: {...prevState.rows[index]}
            };
        });

    };
    handleDialogChange = prop => event => {
        let val = event.target.value;
        this.setState(prevState => {
            return {
                [prop]: prevState.edituser[prop] = val
            };
        });
    };
    handleNewUser=()=>{
        this.setState((prevState) => {
            return {
                   edituser: {
                    id: this.state.rows.length + 1,
                    firstname: "",
                    lastname: "",
                    worktime: 0,
                    thisweekworktime: 0,
                    email: ""
                }
            };
        });
        this.handleClickOpen();
    }

    constructor(props) {
        super(props);

        this.state = {
            rows: rows,
            isAddModalOpen: false,
            isEditModalOpen: false,
            edituser: {
                id: rows.length,
                firstname: "",
                lastname: "",
                worktime: 0,
                thisweekworktime: 0,
                email: ""
            },
        };
        if (this.props.bell === true) this.bell = true;
    };

    render() {
        const {classes} = this.props;
        return (

            <div>
                <br/>
                <Button variant="contained" onClick={this.handleNewUser} color="primary">
                    Nový uživatel
                </Button>
                <Usertable data={this.state.rows} onDelete={this.handleDelete} onEdit={this.handleEdit}/>
                <Dialog
                    open={this.state.isEditModalOpen}
                    onClose={this.handleClose}
                    aria-labelledby="responsive-dialog-title"
                    maxWidth="xs"
                >
                    <DialogTitle id="responsive-dialog-title">Uživatel</DialogTitle>
                    <DialogContent>


                        <Grid container spacing={16} alignContent={"center"}>
                            <Grid item xs={12}>
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
                                    <InputLabel htmlFor="adornment-amount">Typ Uživatele
                                        Vedoucí-Zaměstnanec</InputLabel>
                                    <InputLabel htmlFor="type">Typ Uživatele Vedoucí-Zaměstnanec</InputLabel>
                                    <Select
                                        native
                                        value={this.state.edituser.type || ""}
                                        onChange={this.handleDialogChange('type')}
                                        label="type"
                                    >

                                        <option value={"employee"}>Zaměstnanec</option>
                                        <option value={"manager"}>Vedoucí</option>
                                    </Select>

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

export default withRoot(withStyles(styles)(Usermanager));