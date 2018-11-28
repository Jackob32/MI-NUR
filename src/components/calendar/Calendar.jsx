import React, {Component} from "react";
import BigCalendar from "react-big-calendar";
// the moment library for getting correct time and date
import moment from "moment";
import createSlot from 'react-tackle-box/Slot'
import "./Cal.css";
import withRoot from "../../withRoot";
import styles from "../../styles";
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
import {events as events, users as rows, UserOptions as UserOptions} from "../../data"
import FormControl from '@material-ui/core/FormControl';
import Usertable from "../usertable/Usertable";
import Autocomplete from "../autocomplete/Autocomplete";
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';
import orange from '@material-ui/core/colors/orange';
import blue from '@material-ui/core/colors/blue';
import grey from '@material-ui/core/colors/grey';
import Toolbar from "./Toolbar";
import Event from "./Event";
import update from 'react-addons-update';
import 'typeface-roboto';
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'

import "../../functions";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import FormGroup from "@material-ui/core/FormGroup/FormGroup";
import Lock from "@material-ui/icons/Lock";
import LockOpen from "@material-ui/icons/LockOpen";
import Typography from "@material-ui/core/Typography/Typography";
import SnackbarContent from "@material-ui/core/SnackbarContent/SnackbarContent";
import IconButton from "@material-ui/core/IconButton/IconButton";
import classNames from 'classnames';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';

import amber from '@material-ui/core/colors/amber';
import WarningIcon from '@material-ui/icons/Warning';
import Snackbar from "@material-ui/core/Snackbar/Snackbar";

require('moment/locale/cs');

moment.locale('cs');

const styles1 = theme => ({
    success: {
        backgroundColor: green[600],
    },
    error: {
        backgroundColor: theme.palette.error.dark,
    },
    info: {
        backgroundColor: theme.palette.primary.dark,
    },
    warning: {
        backgroundColor: amber[700],
    },
    icon: {
        fontSize: 20,
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing.unit,
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
});
const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon,
};
function MySnackbarContent(props) {
    const { classes, className, message, onClose, variant, ...other } = props;
    const Icon = variantIcon[variant];

    return (
        <SnackbarContent
            className={classNames(classes[variant], className)}
            aria-describedby="client-snackbar"
            message={
                <span id="client-snackbar" className={classes.message}>
          <Icon className={classNames(classes.icon, classes.iconVariant)} />
                    {message}
        </span>
            }
            action={[
                <IconButton
                    key="close"
                    aria-label="Close"
                    color="inherit"
                    className={classes.close}
                    onClick={onClose}
                >
                    <CloseIcon className={classes.icon} />
                </IconButton>,
            ]}
            {...other}
        />
    );
}

const MySnackbarContentWrapper = withStyles(styles1)(MySnackbarContent);

let ExampleControlSlot = createSlot();

// creating Big Calendar localizer
const localizer = BigCalendar.momentLocalizer(moment);

// the dummy calendar data
const DragAndDropCalendar = withDragAndDrop(BigCalendar);

const action = (
    <Button color="secondary" size="small">
        Vrátit zpět
    </Button>
);

class Cal extends Component {


    openSuccess=(text)=>{
        this.setState({
            openSuccess: true,
            SuccessText: text
        });
    }

    openUndo=(text)=>{
        this.setState({
            openUndo: true,
            UndoText: text
        });
    }

    handleSelect = ({start, end, slots, action}) => {
        if (this.props.auth && this.props.auth === "manager") {
            var title = window.prompt('Jmeno Směny');
            var capacity = window.prompt('Kapacita směny');

            if (title && capacity && parseInt(capacity, 10)) {
                let id = this.state.events.length;

                this.setState({
                    firstevent:false,
                    events: [
                        ...this.state.events,
                        {
                            id: this.state.idcnt + 1,
                            start,
                            end,
                            title,
                            capacity,
                            note: "",
                            locked: true,
                            employees: [],
                        },
                    ],
                    idcnt: this.state.idcnt + 1,
                    isAddModalOpen: false,
                    isEditModalOpen: false,
                })

                this.openSuccess("Byla vložena nová směna");

            }else if(capacity && !parseInt(capacity, 10)){

                alert("\""+capacity+"\" není číslo")
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

    handleSnackClose = () => {
        this.setState({           openSuccess: false,

            openUndo: false});
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
                searchEmployee:"",
                dialoginfo: {
                    ...this.state.dialoginfo,
                    employees: [...this.state.dialoginfo.employees, this.state.searchEmployee.value]
                }
            });
        }


        //  console.log(this.state);
    };

    handleDuplicate= () => {

        let index = this.state.events.findIndex(x => x.id === this.state.dialoginfo.id);

        let tmp=this.state.events[index];
        tmp.id=this.state.idcnt + 1;

        this.setState({
            firstevent:false,
            idcnt: this.state.idcnt + 1,
            events: [
                ...this.state.events,tmp,
            ],
        });

this.handleClose();
        this.openSuccess("Směna "+tmp.title+" byla zduplikována");
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
        let user=array.splice(index, 1);
        this.setState({
            dialoginfo: {
                ...this.state.dialoginfo,
                employees: array,
            }
        });
        this.openUndo("Odstranili jste uživatele ");
    };
    handleDelete = () => {

        let index = this.state.events.findIndex(x => x.id === this.state.dialoginfo.id);

        let array = [...this.state.events]; // make a separate copy of the array
        let ev=array.splice(index, 1);
        this.handleClose();
        this.openUndo("Odstranili jste směnu ");
        this.setState({
            events: array,
        });

    };
    addUserToEvent = (e) => {

        if(e.locked) return;

        let index = this.state.events.findIndex(x => x.id === e.id);
        let userid = rows.findIndex(x => x.email === this.props.searchEmployee);

        let newevent = this.state.events[index];

        if (e.employees.filter(e => e.email === this.props.searchEmployee).length > 0) {
            let userid = newevent.employees.findIndex(x => x.email === this.props.searchEmployee);
            newevent.employees.splice(userid, 1);

            this.setState({
                firstevent:false,
                events: update(this.state.events, {[index]: {$set: newevent}})
            });
            this.openSuccess("Odhlásili jste se ze směny");
        } else if (e.employees.length < e.capacity) {

            newevent.employees.push(rows[userid]);

            this.setState({
            firstevent:false,
            events: update(this.state.events, {[index]: {$set: newevent}})
            });
            this.openSuccess("Přihlásili jste se na směnu");
        }
    };
    handleDialogChange = prop => event => {
        //  console.log(event.target.type);
        // console.log(event.target.value);
        let val = event.target.value;

        if(val==="false")val=false;
        if(val==="true")val=true;
        console.log(val);

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

    manageLock=(lock)=>{

        let start, end;
        let date=this.state.currentDate;
        let view=this.state.currentView;

        console.log(date);
        console.log(view);


        // if view is day: from moment(date).startOf('day') to moment(date).endOf('day');
        if(view === 'day'){
            start = moment(date).startOf('day');
            end   = moment(date).endOf('day');
        }
        // if view is week: from moment(date).startOf('isoWeek') to moment(date).endOf('isoWeek');
        else if(view === 'week'){
            start = moment(date).startOf('isoWeek');
            end   = moment(date).endOf('isoWeek');
        }
        //if view is month: from moment(date).startOf('month').subtract(7, 'days') to moment(date).endOf('month').add(7, 'days'); i do additional 7 days math because you can see adjacent weeks on month view (that is the way how i generate my recurrent events for the Big Calendar, but if you need only start-end of month - just remove that math);
        else if(view === 'month'){
            start = moment(date).startOf('month').subtract(7, 'days');
            end   = moment(date).endOf('month').add(7, 'days');
        }
        // if view is agenda: from moment(date).startOf('day') to moment(date).endOf('day').add(1, 'month');
        else if(view === 'agenda'){
            start = moment(date).startOf('day');
            end   = moment(date).endOf('day').add(1, 'month');
        }

        this.setState((prevState) => {

            let tmpArr = [...prevState.events];

            for(let i=0; i <tmpArr.length; i++)
            {
                if(tmpArr[i].start>=start && tmpArr[i].end<=end)
                {
                    tmpArr[i].locked=lock;
                }
            }

            return {events: tmpArr,};
        });

}
    handleLock=()=>{
        this.manageLock(true);
        this.openSuccess("Směny v kalendáři byly zamčeny");
    }
    handleOpen=()=>{

        this.manageLock(false);
        this.openSuccess("Směny v kalendáři byly odemčeny");
    }
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
    };
    eventStyleGetter = (event, start, end, isSelected) => {

        var backgroundColor = '#' + event.hexColor;

        if (this.props.auth === "manager") {

            if (event.employees.length === event.capacity) {
                backgroundColor = green[500];
            }
            if (event.employees.length === 0 || event.employees.length > event.capacity) {
                backgroundColor = red[500];
            }
            if (event.employees.length < event.capacity && event.employees.length !== 0) {
                backgroundColor = orange[500];
            }
        } else {
            backgroundColor = grey[500];
            if (isSelected)
                backgroundColor = grey[700];
            if (event.employees.length >= event.capacity) {
                backgroundColor = red[500];
                if (isSelected)
                    backgroundColor = red[700];
            }
            if (event.employees.filter(e => e.email === this.props.searchEmployee).length > 0) {
                backgroundColor = green[500];
                if (isSelected)
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
    };
    moveEvent = ({event, start, end, isAllDay: droppedOnAllDaySlot}) => {
        const events = this.state.events;

        const idx = events.indexOf(event);
        let allDay = event.allDay;

        if (!event.allDay && droppedOnAllDaySlot) {
            allDay = true
        } else if (event.allDay && !droppedOnAllDaySlot) {
            allDay = false
        }

        const updatedEvent = {...event, start, end, allDay};

        const nextEvents = [...events];
        nextEvents.splice(idx, 1, updatedEvent);

        this.setState({
            events: nextEvents,
        })

        // alert(`${event.title} was dropped onto ${updatedEvent.start}`)
    };

    constructor(props) {

        super(props);

        //here we create the filtering based on given props

        // props.value = props.value || '';

        this.state = {
            events: events,
            firstevent:true,
            openSuccess: false,
            SuccessText: "",
            openUndo: false,
            UndoText: "",
            dialoginfo: {
                id: 0,
                title: 'Volne',
                start: new Date(new Date().setHours(new Date().getHours() - 3)),
                end: new Date(new Date().setHours(new Date().getHours() + 3)),
                capacity: 5,
                note: "",
                employees: []
            },
            currentDate:new Date(),
            currentView:"week",
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

    render() {

        const {classes} = this.props;
        let showEvents = [];

        if(this.props.auth && this.props.auth === "manager") {
            if (this.props.freeshifts) {
                showEvents = showEvents.concat(this.state.events.filter(event => event.employees.length === 0));
            }

            if (this.props.partialshifts ) {
                showEvents = showEvents.concat(this.state.events.filter(event => event.capacity > event.employees.length && event.employees.length !== 0));
            }

            if (this.props.fullshifts ) {
                showEvents = showEvents.concat(this.state.events.filter(event => event.capacity <= event.employees.length));
            }
            if (this.props.searchEmployee !== "" ) {
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
        }
        if (this.props.searchEmployee !== ""  && this.props.auth === "employee") {
            showEvents = this.state.events.filter(
                event => event.employees.filter(
                    employee => {
                        return (this.props.partialshifts && (employee.firstname.includes(this.props.searchEmployee)
                            ||
                            employee.lastname.includes(this.props.searchEmployee)
                            ||
                            (employee.firstname + " " + employee.lastname).includes(this.props.searchEmployee)
                            ||
                            employee.email.includes(this.props.searchEmployee)))
                            ||
                            (this.props.freeshifts && (
                                    event.capacity > event.employees.length
                                )
                            )
                            ||
                            (this.props.fullshifts &&  (event.capacity <= event.employees.length)
                            )
                            ;
                    }
                ).length > 0
            );
        }

        let allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k]);

        return (
            <div className="App">
                {this.state.firstevent && this.props.auth === "manager" && <Typography variant="h6" color="inherit">
                Pro vytvoření směny klikněte do kalendáře.
                </Typography>}
                {this.state.firstevent && this.props.auth === "employee" && <Typography variant="h6" color="inherit">
                    Pro přihlášení na směnu klikněte na směnu.
                </Typography>}
                { this.props.auth && this.props.auth === "manager" &&

                       <div>
                           <Button align={"right"} variant="contained" onClick={this.handleLock} color="secondary">
                            Uzamknout směny
                        </Button>

                <Button align={"right"} variant="contained" onClick={this.handleOpen} color="secondary">
                    Odemknout směny
                </Button>
                        {false &&
                        <Button variant="contained" onClick={this.handleClose} color="primary">
                            Uzavřít směny
                        </Button>
                        }
                       </div>
                }
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
                        onNavigate={(date, view) => {
                            console.log('#### onNavigate');
                            console.log('#### date=', date);
                            console.log('#### view=', view);
                            this.setState({currentDate: date});
                        }}
                        onView={(view) => {
                            console.log('#### onView');
                            console.log('#### view=', view);
                            this.setState({currentView: view});
                        }}
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
                    <DialogTitle id="responsive-dialog-title">Úprava Směny
                        : {this.state.dialoginfo.title || ""}</DialogTitle>
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


                        <Grid container spacing={16} alignItems={"stretch"}>
                            <Grid item md={4}  xs={12}>
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
                        <Grid container spacing={16} alignContent={"center"}>
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

                        <Grid container spacing={16}>
                            <Grid item md={10} xs={8}>

                                <Autocomplete
                                    value={this.state.searchEmployee}
                                    onChange={this.handleSearchChange}
                                    onSubmit={this.handleAdd}

                                    id="input-with-icon-grid"
                                    label="Hledat Uživatele"
                                    className={classes.textField}
                                    options={UserOptions}
                                />
                            </Grid>
                            <Grid item md={2} xs={4}>
                                <Button variant="contained" className={classes.buttons} fullWidth
                                        onClick={this.handleAdd}>
                                    Přidat
                                </Button>
                            </Grid>

                        </Grid>
                        <Grid container spacing={16} alignContent={"center"}>
                            <Grid item xs={12}>
                                <Usertable data={this.state.dialoginfo.employees || []}
                                           onDelete={this.handleUserDelete}/>
                            </Grid>
                        </Grid>

                    </DialogContent>
                    <DialogActions>

                        <Button variant="contained" onClick={this.handleDuplicate} color="primary">
                            Duplikovat směnu
                        </Button>

                        <FormControlLabel alignContent={"left"}
                            control={
                                <Checkbox
                                    checked={this.state.dialoginfo.locked}
                                    onChange={this.handleDialogChange('locked')}
                                    value={!this.state.dialoginfo.locked}
                                />

                            }
                            label={this.state.dialoginfo.locked ? <Lock /> : <LockOpen />}
                        />
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
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.openSuccess}
                    autoHideDuration={3000}
                    onClose={this.handleSnackClose}
                >
                <MySnackbarContentWrapper
                    onClose={this.handleSnackClose}
                    variant="success"
                    message={this.state.SuccessText}
                />
            </Snackbar>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.openUndo}
                    autoHideDuration={6000}
                    onClose={this.handleSnackClose}
                >
                <SnackbarContent
                    className={classes.snackbar}
                    message={this.state.UndoText}
                    action={action}
                />
                </Snackbar>
            </div>
        );
    }
}

Cal.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Cal));