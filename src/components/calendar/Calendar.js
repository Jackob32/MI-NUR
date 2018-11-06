import React, {Component} from "react";
import BigCalendar from "react-big-calendar";
// the moment library for getting correct time and date
import moment from "moment";
import createSlot from 'react-tackle-box/Slot'
import "./Cal.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import withRoot from "../../withRoot";
import styles from "../../theme";
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import {events, rows} from "../../data"
import FormControl from '@material-ui/core/FormControl';
import Usertable from "../usertable/Usertable";


let ExampleControlSlot = createSlot();

// creating Big Calendar localizer
const localizer = BigCalendar.momentLocalizer(moment);

// the dummy calendar data

class Cal extends Component {

    constructor(props) {

        super(props);

        //here we create the filtering based on given props

        // props.value = props.value || '';

        this.state = {
            events: events, dialoginfo: {
                id: 0,
                title: 'Volne',
                start: new Date(new Date().setHours(new Date().getHours() - 3)),
                end: new Date(new Date().setHours(new Date().getHours() + 3)),
                capacity: 5,
                note: ""
            }, isAddModalOpen: false,
            isEditModalOpen: false,
        };

        if (this.props.bell === true) this.bell = true;

    };

    handleSelect = ({start, end, slots, action}) => {

        var title = window.prompt('Jmeno Směny');
        var capacity = window.prompt('Kapacita směny');

        if (title && capacity) {

           this.setState({
                events: [
                    ...this.state.events,
                    {
                        start,
                        end,
                        title,
                        capacity,
                        note: "",
                        employees: [],
                    },

                ],
                isAddModalOpen: false,
                isEditModalOpen: false,
            })
        }
    }
    handleClickOpen = (e) => {
        this.setState({isEditModalOpen: true, dialoginfo: e});
    };
    handleClose = () => {
        this.setState({isEditModalOpen: false});
    };
    toggleAddModal = event => {
        if (!this.state.isEditModalOpen) {
            this.setState({
                currentEvent: event,
                isAddModalOpen: !this.state.isAddModalOpen,
            });
        }
    };
    toggleEditModal = event => {
        if (!this.state.isAddModalOpen) {
            this.setState({
                currentEvent: event,
                isEditModalOpen: !this.state.isEditModalOpen,
            });
        }
    };


    getDefaultProps() {
        return {
            freeshifts: true,
            partialshifts: true,
            fullshifts: true,
            searchEmployee: ""
        };
    }

    render() {
        const { classes } = this.props;
        let showEvents = [];

        if (this.props.freeshifts) {
            showEvents = showEvents.concat(this.state.events.filter(event => event.employees.length === 0));
        }
        if (this.props.partialshifts) {
            showEvents = showEvents.concat(this.state.events.filter(event => event.capacity > event.employees.length && event.employees.length !== 0));
        }

        if (this.props.fullshifts) {
            showEvents = showEvents.concat(this.state.events.filter(event => event.capacity <= event.employees.length));
        }

        if (this.props.searchEmployee !== "") {
            showEvents = showEvents.filter(
                event => event.employees.filter(
                    employee => {
                        return employee.firstname.includes(this.props.searchEmployee)
                            ||
                            employee.lastname.includes(this.props.searchEmployee)
                            ||
                            (employee.firstname + " " + employee.lastname).includes(this.props.searchEmployee)

                            ||
                            employee.email.includes(this.props.searchEmployee);
                    }
                ).length > 0
            );
        }

        console.log(this.state.events);


        let dialogTitle = this.state.dialoginfo.title || "";

        let dialogStartDate = this.state.dialoginfo.start.toISOString().substr(0, 10) || "";
        let dialogStartTime = this.state.dialoginfo.start.toISOString().substr(11, 5) || "";

        let dialogEndDate = this.state.dialoginfo.end.toISOString().substr(0, 10) || "";
        let dialogEndTime = this.state.dialoginfo.end.toISOString().substr(11, 5) || "";

        let dialogCapacity = this.state.dialoginfo.capacity || "";
        let dialogNote = this.state.dialoginfo.note || "";

        let dialogusers = this.state.dialoginfo.employees || [];


        return (
            <div className="App">

                <ExampleControlSlot.Entry waitForOutlet>


                </ExampleControlSlot.Entry>
                <BigCalendar
                    selectable
                    localizer={localizer}
                    events={showEvents}
                    defaultView={BigCalendar.Views.WEEK}
                    scrollToTime={new Date(1970, 1, 1, 6)}
                    defaultDate={new Date()}
                    onSelectEvent={event => this.handleClickOpen(event)}
                    onSelectSlot={this.handleSelect}
                    style={{height: "100vh"}}
                />

                <Dialog
                    open={this.state.isEditModalOpen}
                    onClose={this.handleClose}
                    aria-labelledby="responsive-dialog-title"

                    fullScreen

                >
                    <DialogTitle id="responsive-dialog-title">Úprava Směny</DialogTitle>
                    <DialogContent>


                        <DialogContentText>
                            {dialogTitle}
                            <br/> <br/> <br/>
                        </DialogContentText>


                        <Grid container spacing={12}>
                            <Grid item xs={4}>
                                <FormControl className={classes.formControl} variant="outlined">
                                    <InputLabel htmlFor="adornment-amount">Od</InputLabel>
                                    <Input
                                        id="adornment-amount"
                                        type="date"
                                        value={dialogStartDate}
                                        label="Od"
                                    />
                                    <Input
                                        id="adornment-amount"
                                        type="time"
                                        value={dialogStartTime}
                                        label="Od"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={4}>
                                <FormControl className={classes.formControl} variant="outlined">
                                    <InputLabel htmlFor="adornment-amount">Do</InputLabel>
                                    <Input
                                        id="adornment-amount"
                                        type="date"
                                        value={dialogEndDate}
                                        label="Do"

                                    />
                                    <Input
                                        id="adornment-amount"
                                        type="time"
                                        value={dialogEndTime}
                                        label="Do"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={4}>
                                <FormControl className={classes.formControl} variant="outlined">
                                <InputLabel htmlFor="adornment-amount">Kapacita</InputLabel>
                                <Input
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    label="Kapacita"
                                    type="number"
                                    value={dialogCapacity}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
<br />
                        <Grid container spacing={12}>
                            <Grid item xs={12}>
                                <FormControl  fullWidth className={classes.formControl} variant="outlined">
                                <InputLabel htmlFor="adornment-amount"></InputLabel>
                            <TextField
                                id="outlined-textarea"
                                label="Poznámka"
                                placeholder="Placeholder"
                                multiline
                                margin="normal"
                                variant="outlined"
                                value={dialogNote}

                                className={classes.textField}

                            />    </FormControl>
                            </Grid>
                    </Grid>

                        <Grid container spacing={12}>
                            <Grid item xs={12}>
                                <Usertable data={dialogusers}/>
                            </Grid>
                        </Grid>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Zrušit
                        </Button>
                        <Button onClick={this.handleClose} color="secondary">
                            Uložit
                        </Button>
                    </DialogActions>
                </Dialog>

            </div>
        );
    }
}


Cal.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Cal));