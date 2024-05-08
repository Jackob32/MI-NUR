import React from "react";
// the moment library for getting correct time and date
import moment from "moment";
import PropTypes from 'prop-types';
import withRoot from "../../withRoot";
import styles from "../../styles";
import {withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ArrowForwardIosSharp from '@material-ui/icons/ArrowForwardIosSharp';
import ArrowBackIosSharp from '@material-ui/icons/ArrowBackIosSharp';


function CustomToolbar(toolbar) {


    const goToDayView = () => {
        console.log(toolbar);
        toolbar.onView('day');
    };
    const goToWeekView = () => {
        toolbar.onView('week');
    };
    const goToMonthView = () => {
        toolbar.onView('month');
    };
    const goToAgendaView = () => {
        toolbar.onView('agenda');
    };
    const goToBack = () => {
        toolbar.onNavigate('PREV');
    };
    const goToNext = () => {
        toolbar.onNavigate('NEXT');
    };
    const goToCurrent = () => {
        toolbar.onNavigate('TODAY');
    };
    const label = () => {
        const date = moment(toolbar.date);
        return (
            <span><b>{date.format('MMMM')}</b><span> {date.format('YYYY')}</span></span>
        );
    };

    const {classes} = toolbar;

    return (
        <div>

            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar variant="dense">
                        <div style={{ flex: 1 }} align="left" >

                            <Typography variant="h6" color="inherit">
                                <IconButton  onClick={goToBack} color="inherit"  >
                                <ArrowBackIosSharp/>
                            </IconButton>
                                <Button color="inherit" onClick={goToCurrent} >


                             {toolbar.label}
                                </Button>

                                <IconButton onClick={goToNext} color="inherit" >
                                    <ArrowForwardIosSharp/>
                                </IconButton>
                            </Typography>

                        </div>
                        <div align="right">
                            <Button color="inherit"
                                    onClick={goToDayView}>
                                Den
                            </Button>
                            <Button color="inherit" onClick={goToWeekView}>Týden
                            </Button>
                            <Button color="inherit" onClick={goToMonthView}>Měsíc </Button>
                            <Button color="inherit" onClick={goToAgendaView}>Agenda </Button>
                        </div>
                    </Toolbar>
                </AppBar>
            </div>


        </div>
    );
}


CustomToolbar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(CustomToolbar));
