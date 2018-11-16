import React, {Component} from "react";
import BigCalendar from "react-big-calendar";
// the moment library for getting correct time and date
import moment from "moment";
import createSlot from 'react-tackle-box/Slot'
import "./Cal.css";

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
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';
import orange from '@material-ui/core/colors/orange';
import grey from '@material-ui/core/colors/grey';
import blue from '@material-ui/core/colors/blue';
import Toolbar from "./Toolbar";
import Event from "./Event";
import update from 'react-addons-update';
import 'typeface-roboto';
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'

import "../../functions";

require('moment/locale/cs');

moment.locale('cs');


let ExampleControlSlot = createSlot();

// creating Big Calendar localizer
const localizer = BigCalendar.momentLocalizer(moment);

// the dummy calendar data
const DragAndDropCalendar = withDragAndDrop(BigCalendar)


class Cal extends Component {

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
                            id: this.state.idcnt + 1,
                            start,
                            end,
                            title,
                            capacity,
                            note: "",
                            employees: [],
                        },
                    ],
                    idcnt: this.state.idcnt + 1,
                    isAddModalOpen: false,
                    isEditModalOpen: false,
                })
            }
        }
    };
    handleClickOpen = (e) => {

        let index = this.state.events.findIndex(x => x.id === e.id);

        if (this.props.auth && this.props.auth === "manager") {
            let newdialoginfo = this.state.events[index];

            newdialoginfo.id = e.id;
            this.setState({isEditModalOpen: true, dialoginfo: newdialoginfo});
        }
    };
    handleClose = () => {
        this.setState({isEditModalOpen: false});
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

        let index = this.state.events.findIndex(x => x.id === this.state.dialoginfo.id);

        this.setState({
            events: update(this.state.events, {[index]: {$set: this.state.dialoginfo}})
        });

        this.handleClose();
    };

    handleUserDelete = (x) => {

        let index = this.state.dialoginfo.employees.findIndex(item => item.id === x);

        let array = [...this.state.dialoginfo.employees];
        array.splice(index, 1);
        this.setState({
            dialoginfo: {
                ...this.state.dialoginfo,
                employees: array,
            }
        });
    };

    handleDelete = () => {

        let index = this.state.events.findIndex(x => x.id === this.state.dialoginfo.id);

        let array = [...this.state.events]; // make a separate copy of the array
        array.splice(index, 1);
        this.handleClose();
        this.setState({
            events: array,
        });

    };

    addUserToEvent = (e) => {

        let index = this.state.events.findIndex(x => x.id === e.id);
        let userid = rows.findIndex(x => x.email === "Pepa.Novak@gmail.com");

        let newevent=this.state.events[index];

        if (e.employees.filter(e => e.email === 'Pepa.Novak@gmail.com').length > 0) {
            let userid = newevent.employees.findIndex(x => x.email === "Pepa.Novak@gmail.com");
            newevent.employees.splice(userid,1);

            this.setState({
                events: update(this.state.events, {[index]: {$set: newevent}})
            });

        }else if(e.employees.length<e.capacity){

            newevent.employees.push(rows[userid]);

            this.setState({
                events: update(this.state.events, {[index]: {$set: newevent}})
            });
        }
    }

    handleDialogChange = prop => event => {
        //  console.log(event.target.type);
        // console.log(event.target.value);
        let val = event.target.value;
        if (event.target.type === "datetime-local") {
          //  console.log(val);
            val = new Date(val);

        }
        this.setState(prevState => {
            return {
                [prop]: prevState.dialoginfo[prop] = val
            };
        });
    };
    resizeEvent = ({event, start, end}) => {

        const events = this.state.events;
        const nextEvents = events.map(existingEvent => {
            return existingEvent.id === event.id
                ? {...existingEvent, start, end}
                : existingEvent
        });
        this.setState({
            events: nextEvents,
        });

        // alert(`${event.title} was resized to ${start}-${end}`)
    }

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
            idcnt: events.length,
            isAddModalOpen: false,
            isEditModalOpen: false,
            searchEmployee: "",

        };

        if (this.props.bell === true) this.bell = true;

    };

    EventAgenda({event}) {
        return (
            <span>
      <strong style={{color: 'white'}}>{event.title}</strong>
                {event.note !== "" &&
                <p style={{borderTop: "1px solid white"}}>{event.note}</p>
                }
    </span>
        )
    }
    eventStyleGetter=(event, start, end, isSelected)=> {

        var backgroundColor = '#' + event.hexColor;

        if(this.props.auth === "manager") {

            if (event.employees.length === event.capacity) {
                backgroundColor = green[500];
            }
            if (event.employees.length === 0 || event.employees.length > event.capacity) {
                backgroundColor = red[500];
            }
            if (event.employees.length < event.capacity && event.employees.length !== 0) {
                backgroundColor = orange[500];
            }
        }else{
            backgroundColor = blue[500];
            if(isSelected)
                backgroundColor = blue[700];
            if (event.employees.length >= event.capacity) {
                backgroundColor = red[500];
                if(isSelected)
                backgroundColor = red[700];
            }
            if (event.employees.filter(e => e.email === 'Pepa.Novak@gmail.com').length > 0) {
                backgroundColor = green[500];
                if(isSelected)
                    backgroundColor = green[700];
            }

        }

            let style = {
                backgroundColor: backgroundColor,
                borderRadius: '5px',
                color: 'white',
                border: '6px',
            };

        return {
            style: style
        };
    }
    moveEvent=({event, start, end, isAllDay: droppedOnAllDaySlot})=> {
        const events = this.state.events;

        const idx = events.indexOf(event)
        let allDay = event.allDay

        if (!event.allDay && droppedOnAllDaySlot) {
            allDay = true
        } else if (event.allDay && !droppedOnAllDaySlot) {
            allDay = false
        }

        const updatedEvent = {...event, start, end, allDay}

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

        if (this.props.freeshifts && (this.props.auth && this.props.auth === "manager")) {
            showEvents = showEvents.concat(this.state.events.filter(event => event.employees.length === 0));
        }else if(this.props.freeshifts && (this.props.auth && this.props.auth === "employee")){
            showEvents = showEvents.concat(this.state.events.filter(event => event.capacity > event.employees.length));
        }

        if (this.props.partialshifts && (this.props.auth && this.props.auth === "manager")) {
            showEvents = showEvents.concat(this.state.events.filter(event => event.capacity > event.employees.length && event.employees.length !== 0));
        }

        if (this.props.fullshifts) {
            showEvents = showEvents.concat(this.state.events.filter(event => event.capacity <= event.employees.length));
        }

       // console.log(showEvents);

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
        //console.log("this.state");
       // console.log(this.state);

        let allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k])

        return (
            <div className="App">

                <ExampleControlSlot.Entry waitForOutlet>


                </ExampleControlSlot.Entry>

                {this.props.auth === "manager" ? <DragAndDropCalendar
                        culture={"cs-CZ"}
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
                        rtl
                        longPressThreshold={0}
                        showMultiDayTimes
                        views={allViews}
                        eventPropGetter={(this.eventStyleGetter)}
                        components={{
                            event: Event,
                            toolbar: Toolbar,
                            agenda: {
                                event: this.EventAgenda,
                            },
                        }}

                    />
                    : <BigCalendar
                        culture={"cs-CZ"}
                        localizer={localizer}
                        events={showEvents}
                        defaultView={BigCalendar.Views.WEEK}
                        scrollToTime={new Date(1970, 1, 1, 6)}
                        defaultDate={new Date()}
                        style={{height: "100vh"}}
                        eventPropGetter={(this.eventStyleGetter)}
                        onSelectEvent={this.addUserToEvent}
                        components={{
                            event: Event,
                            toolbar: Toolbar,
                            agenda: {
                                event: this.EventAgenda,
                            },
                        }}
                    />

                }


                <Dialog
                    open={this.state.isEditModalOpen}
                    onClose={this.handleClose}
                    aria-labelledby="responsive-dialog-title"

                    maxWidth="md"
                >
                    <DialogTitle id="responsive-dialog-title">Úprava Směny :                   {this.state.dialoginfo.title || ""}</DialogTitle>
                    <DialogContent>


                        <DialogContentText>
                            <br/> <FormControl fullWidth className={classes.formControl} variant="outlined">
                                <InputLabel htmlFor="adornment-amount">Název</InputLabel>
                                <Input

                                    type="text"
                                    value={this.state.dialoginfo.title || ""}
                                    label="Název"
                                    onChange={this.handleDialogChange('title')}
                                />
                            </FormControl>
                        </DialogContentText>


                        <Grid container spacing={16} alignItems={"flex"}>
                            <Grid item md={4} xs={12}>
                                <FormControl fullWidth className={classes.formControl} variant="outlined">
                                    <InputLabel htmlFor="adornment-amount">Od</InputLabel>
                                    <Input

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
                                <Button variant="contained" className={classes.buttons} fullWidth
                                        onClick={this.handleAdd}>
                                    Přidat
                                </Button>
                            </Grid>

                        </Grid>
                        <Grid container spacing={12} alignContent={"center"}>
                            <Grid item xs={12}>
                                <Usertable data={this.state.dialoginfo.employees || []} onDelete={this.handleUserDelete}/>
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

                        <Button variant="contained" onClick={this.handleDelete}>
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