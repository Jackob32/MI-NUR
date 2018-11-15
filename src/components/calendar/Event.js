import React from "react";
// the moment library for getting correct time and date
import PropTypes from 'prop-types';
import withRoot from "../../withRoot";
import styles from "../../theme";
import {withStyles} from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid/Grid";
import Avatar from "@material-ui/core/Avatar/Avatar";

function Event(props) {


    const {classes, event} = props;

    return (

        <div className={classes.info}>
            <Grid container className={classes.root} spacing={0}>
                <Grid item xs={2}>
                    <div align="left" color={"blue"}>
                            {event.employees.length === event.capacity &&
                            <Avatar className={classes.greenAvatar}>
                                {event.employees.length}/{event.capacity}
                            </Avatar>
                        }
                        { (event.employees.length === 0 ||  event.employees.length > event.capacity) && <Avatar className={classes.redAvatar}>
                            {event.employees.length}/{event.capacity}
                            </Avatar>
                        }
                        {event.employees.length < event.capacity && event.employees.length !== 0 &&
                            <Avatar className={classes.orangeAvatar}>
                            {event.employees.length}/{event.capacity}
                            </Avatar>
                        }

                    </div>
                </Grid>
                <Grid item xs={10}>
                    {event.title}
                </Grid>
            </Grid>

            <Grid container className={classes.root} spacing={0}>
                {event.note}
            </Grid>
        </div>
    )
}

Event.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Event));
