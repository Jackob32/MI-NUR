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
import {events, rows} from "../../data"
import FormControl from '@material-ui/core/FormControl';
import Usertable from "../usertable/Usertable";
import Autocomplete from "../autocomplete/Autocomplete";
import update from 'react-addons-update';
import 'typeface-roboto';
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'

import "../../functions";

let ExampleControlSlot = createSlot();

// creating Big Calendar localizer
const localizer = BigCalendar.momentLocalizer(moment);

// the dummy calendar data
const DragAndDropCalendar = withDragAndDrop(BigCalendar)

class Cal extends Component {

    constructor(props) {

        super(props);

        //here we create the filtering based on given props

        // props.value = props.value || '';

        this.state = {
            events: events,
            dialoginfo: {
                id: 0,
                title: 'Volne',
                start: new Date(new Date().setHours(new Date().getHours() - 3)),
                end: new Date(new Date().setHours(new Date().getHours() + 3)),
                capacity: 5,
                note: "",
                employees: []
            },
            isAddModalOpen: false,
            isEditModalOpen: false,
            searchEmployee: "",

        };

        if (this.props.bell === true) this.bell = true;

        this.moveEvent = this.moveEvent.bind(this);

    };

    static getDefaultProps() {
        return {
            freeshifts: true,
            partialshifts: true,
            fullshifts: true,
            searchEmployee: ""
        };
    }


    handleSelect = ({start, end, slots, action}) => {
        if (this.props.auth && this.props.auth === "manager") {
            var title = window.prompt('Jmeno Směny');
            var capacity = window.prompt('Kapacita směny');

            if (title && capacity) {
                let id = this.state.events.length;
                this.setState({
                    events: [
                        ...this.state.events,
                        {
                            id,
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
    };
    handleClickOpen = (e) => {
        if (this.props.auth && this.props.auth === "manager")
            this.setState({isEditModalOpen: true, dialoginfo: this.state.events[e.id]});


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
    handleSearchChange = (value) => {
        this.setState({
            searchEmployee: value,
        });
    };
    handleAdd = (value) => {
        //  console.log(this.state.searchEmployee.value);
        if (this.state.searchEmployee && this.state.searchEmployee.value) {

            this.setState({
                dialoginfo: {
                    ...this.state.dialoginfo,
                    employees: [...this.state.dialoginfo.employees, this.state.searchEmployee.value]
                }
            });
        }
        //  console.log(this.state);
    };
    handleSubmit = () => {

        if (!this.state.dialoginfo.id) this.state.dialoginfo.id = this.state.events.length;

        this.setState({
            events: update(this.state.events, {[this.state.dialoginfo.id]: {$set: this.state.dialoginfo}})
        });

        this.handleClose();
    };
    toggleEditModal = event => {
        if (!this.state.isAddModalOpen) {
            this.setState({
                currentEvent: event,
                isEditModalOpen: !this.state.isEditModalOpen,
            });
        }
    };
    handleDialogChange = prop => event => {


        //  console.log(event.target.type);
        // console.log(event.target.value);
        let val = event.target.value;
        if (event.target.type === "datetime-local") {
            console.log(val);
            val = new Date(val);

        }

        this.setState(prevState => {
            return {
                [prop]: prevState.dialoginfo[prop] = val
            };
        });
    };
    resizeEvent = ({ event, start, end }) => {


        const events  = this.state.events;

        const nextEvents = events.map(existingEvent => {
            return existingEvent.id === event.id
                ? { ...existingEvent, start, end }
                : existingEvent
        });

        this.setState({
            events: nextEvents,
        });

       // alert(`${event.title} was resized to ${start}-${end}`)
    }
    moveEvent({ event, start, end, isAllDay: droppedOnAllDaySlot }) {
        const  events  = this.state.events;

        const idx = events.indexOf(event)
        let allDay = event.allDay

        if (!event.allDay && droppedOnAllDaySlot) {
            allDay = true
        } else if (event.allDay && !droppedOnAllDaySlot) {
            allDay = false
        }

        const updatedEvent = { ...event, start, end, allDay }

        const nextEvents = [...events]
        nextEvents.splice(idx, 1, updatedEvent)

        this.setState({
            events: nextEvents,
        })

        // alert(`${event.title} was dropped onto ${updatedEvent.start}`)
    }

    render() {


        const {classes} = this.props;
        let showEvents = [];

        if (this.props.freeshifts || (this.props.auth && this.props.auth === "employee")) {
            showEvents = showEvents.concat(this.state.events.filter(event => event.employees.length === 0));
        }
        if (this.props.partialshifts || (this.props.auth && this.props.auth === "employee")) {
            showEvents = showEvents.concat(this.state.events.filter(event => event.capacity > event.employees.length && event.employees.length !== 0));
        }

        if (this.props.fullshifts || (this.props.auth && this.props.auth === "employee")) {
            showEvents = showEvents.concat(this.state.events.filter(event => event.capacity <= event.employees.length));
        }

        console.log(showEvents);

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

        let options = rows.map(user => ({
            value: user,
            label: user.firstname + " " + user.lastname,
        }));
        console.log("this.state");
        console.log(this.state);


        return (
            <div className="App">

                <ExampleControlSlot.Entry waitForOutlet>


                </ExampleControlSlot.Entry>

                {this.props.auth === "manager" ? <DragAndDropCalendar

                        selectable
                        resizable
                        localizer={localizer}
                        events={showEvents}
                        defaultView={BigCalendar.Views.WEEK}
                        scrollToTime={new Date(1970, 1, 1, 6)}
                        defaultDate={new Date()}
                        onSelectEvent={event => this.handleClickOpen(event)}
                        onSelectSlot={this.handleSelect}
                        style={{height: "100vh"}}
                        onEventDrop={this.moveEvent}
                        onEventResize={this.resizeEvent}
                    />
                    : <BigCalendar
                        selectable
                        localizer={localizer}
                        events={showEvents}
                        defaultView={BigCalendar.Views.WEEK}
                        scrollToTime={new Date(1970, 1, 1, 6)}
                        defaultDate={new Date()}
                        style={{height: "100vh"}}
                    />

                }



                <Dialog
                    open={this.state.isEditModalOpen}
                    onClose={this.handleClose}
                    aria-labelledby="responsive-dialog-title"

                    maxWidth="md"
                >
                    <DialogTitle id="responsive-dialog-title">Úprava Směny</DialogTitle>
                    <DialogContent>


                        <DialogContentText>
                            {this.state.dialoginfo.title || ""}
                            <br/> <br/> <br/>
                        </DialogContentText>


                        <Grid container spacing={16} alignItems={"flex"}>
                            <Grid item md={4} xs={12}>
                                <FormControl fullWidth className={classes.formControl} variant="outlined">
                                    <InputLabel htmlFor="adornment-amount">Od</InputLabel>
                                    <Input
                                        id="adornment-amount"
                                        type="datetime-local"
                                        value={this.state.dialoginfo.start.toDatetimeLocal() || ""}
                                        label="Od"
                                        onChange={this.handleDialogChange('start')}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12}>
                                <FormControl fullWidth className={classes.formControl} variant="outlined">
                                    <InputLabel htmlFor="adornment-amount">Do</InputLabel>
                                    <Input
                                        id="adornment-amount"
                                        type="datetime-local"
                                        value={this.state.dialoginfo.end.toDatetimeLocal() || ""}
                                        label="Do"
                                        onChange={this.handleDialogChange('end')}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12}>
                                <FormControl fullWidth className={classes.formControl} variant="outlined">
                                    <InputLabel htmlFor="adornment-amount">Kapacita</InputLabel>
                                    <Input
                                        autoFocus
                                        margin="dense"
                                        id="name"
                                        label="Kapacita"
                                        type="number"
                                        value={this.state.dialoginfo.capacity || ""}
                                        onChange={this.handleDialogChange('capacity')}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br/>
                        <Grid container spacing={12} alignContent={"center"}>
                            <Grid item md={12} xs={12}>
                                <FormControl fullWidth className={classes.formControl} variant="outlined">
                                    <InputLabel htmlFor="adornment-amount"></InputLabel>
                                    <TextField
                                        id="outlined-textarea"
                                        label="Poznámka"
                                        placeholder="Placeholder"
                                        multiline
                                        margin="normal"
                                        variant="outlined"
                                        value={this.state.dialoginfo.note || ""}
                                        onChange={this.handleDialogChange('note')}
                                        className={classes.textField}

                                    /> </FormControl>
                            </Grid>
                        </Grid>

                        <Grid container spacing={12}>
                            <Grid item md={10} xs={8}>

                                <Autocomplete
                                    value={this.state.searchEmployee}
                                    onChange={this.handleSearchChange}
                                    onSubmit={this.handleSearchSubmit}

                                    id="input-with-icon-grid"
                                    label="Hledat Uživatele"
                                    className={classes.textField}
                                    options={options}
                                />
                            </Grid>
                            <Grid item md={2} xs={4}>
                                <Button variant="contained" className={classes.buttons} fullWidth onClick={this.handleAdd}>
                                    Přidat
                                </Button>
                            </Grid>

                        </Grid>
                        <Grid container spacing={12} alignContent={"center"}>
                            <Grid item xs={12}>
                                <Usertable data={this.state.dialoginfo.employees || []}/>
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

                        <Button variant="contained" onClick={this.handleClose}>
                            Odstranit
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