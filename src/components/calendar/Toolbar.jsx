import React from "react";
// the moment library for getting correct time and date
import moment from "moment";
import PropTypes from 'prop-types';
import withRoot from "../../withRoot";
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import ArrowForwardIos from '@material-ui/icons/ArrowForwardIosSharp';
import ArrowBackIos from '@material-ui/icons/ArrowBackIosSharp';

/* ─────────────────────────────────────────────────────────────────────────────
   This toolbar renders INSIDE .rbc-calendar which is styled as the unified
   white card in Cal.css. So no shadow / border / background here — just a
   clean header row.
───────────────────────────────────────────────────────────────────────────── */
const styles = theme => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: `${theme.spacing.unit * 1.25}px ${theme.spacing.unit * 2.5}px`,
        borderBottom: '1px solid #E2E8F0',
        background: '#ffffff',
        flexWrap: 'wrap',
        gap: 6,
    },
    left: {
        display: 'flex',
        alignItems: 'center',
        gap: 2,
    },
    right: {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
    },
    navBtn: {
        width: 30,
        height: 30,
        padding: 0,
        color: '#5F6368',
        borderRadius: 8,
        '&:hover': { background: '#F1F3F4', color: '#202124' },
    },
    navIcon: { fontSize: 11 },
    todayBtn: {
        marginLeft: theme.spacing.unit * 0.5,
        marginRight: theme.spacing.unit * 0.5,
        padding: `3px ${theme.spacing.unit * 1.5}px`,
        minHeight: 'unset',
        minWidth: 'unset',
        fontSize: '0.7rem',
        fontWeight: 600,
        letterSpacing: '0.04em',
        textTransform: 'none',
        color: '#5F6368',
        border: '1px solid #DADCE0',
        borderRadius: 8,
        '&:hover': { background: '#F1F3F4', borderColor: '#BDC1C6', color: '#202124' },
    },
    quickBtn: {
        padding: `3px ${theme.spacing.unit * 1.25}px`,
        minHeight: 'unset',
        minWidth: 'unset',
        fontSize: '0.68rem',
        fontWeight: 600,
        letterSpacing: '0.02em',
        textTransform: 'none',
        color: '#5F6368',
        border: '1px solid #DADCE0',
        borderRadius: 8,
        '&:hover': { background: '#F1F3F4', borderColor: '#BDC1C6', color: '#1A73E8' },
    },
    dateLabel: {
        display: 'flex',
        alignItems: 'baseline',
        gap: 5,
        paddingLeft: theme.spacing.unit * 1.5,
        minWidth: 155,
    },
    dateMonth: {
        fontWeight: 700,
        fontSize: '0.95rem',
        color: '#202124',
        letterSpacing: '-0.01em',
    },
    dateYear: {
        fontWeight: 400,
        fontSize: '0.9rem',
        color: '#80868B',
    },
    viewGroup: {
        display: 'flex',
        background: '#F8F9FA',
        borderRadius: 8,
        padding: 3,
        border: '1px solid #DADCE0',
        gap: 2,
    },
    viewBtn: {
        minWidth: 'unset',
        padding: `${theme.spacing.unit * 0.5}px ${theme.spacing.unit * 1.75}px`,
        fontSize: '0.7rem',
        fontWeight: 600,
        letterSpacing: '0.04em',
        textTransform: 'none',
        color: '#5F6368',
        borderRadius: 6,
        lineHeight: 1.4,
        transition: 'all 0.12s ease',
        '&:hover': { background: '#fff', color: '#202124' },
    },
    viewBtnActive: {
        background: '#1A73E8',
        color: '#ffffff !important',
        boxShadow: '0 1px 3px rgba(26,115,232,0.30)',
        '&:hover': { background: '#1557B0' },
    },
});

const VIEW_LIST = [
    { key: 'day',    label: 'Den'    },
    { key: 'week',   label: 'Týden'  },
    { key: 'month',  label: 'Měsíc'  },
    { key: 'agenda', label: 'Agenda' },
];

function CustomToolbar(toolbar) {
    const { classes, view } = toolbar;
    const date = moment(toolbar.date);

    const handlers = {
        day:    () => toolbar.onView('day'),
        week:   () => toolbar.onView('week'),
        month:  () => toolbar.onView('month'),
        agenda: () => toolbar.onView('agenda'),
    };

    const goToThisWeek = () => {
        toolbar.onNavigate('DATE', moment().startOf('isoWeek').toDate());
        toolbar.onView('week');
    };

    const goToNextWeek = () => {
        toolbar.onNavigate('DATE', moment().add(1, 'week').startOf('isoWeek').toDate());
        toolbar.onView('week');
    };

    return (
        <div className={classes.root}>
            <div className={classes.left}>
                <IconButton className={classes.navBtn} onClick={() => toolbar.onNavigate('PREV')}>
                    <ArrowBackIos className={classes.navIcon} />
                </IconButton>
                <Button className={classes.todayBtn} onClick={() => toolbar.onNavigate('TODAY')}>
                    Dnes
                </Button>
                <IconButton className={classes.navBtn} onClick={() => toolbar.onNavigate('NEXT')}>
                    <ArrowForwardIos className={classes.navIcon} />
                </IconButton>
                <div className={classes.dateLabel}>
                    <span className={classes.dateMonth}>{date.format('MMMM')}</span>
                    <span className={classes.dateYear}>{date.format('YYYY')}</span>
                </div>
            </div>

            <div className={classes.right}>
                <Button className={classes.quickBtn} onClick={goToThisWeek}>
                    Tento týden
                </Button>
                <Button className={classes.quickBtn} onClick={goToNextWeek}>
                    Příští týden
                </Button>

                <div className={classes.viewGroup}>
                    {VIEW_LIST.map(v => (
                        <Button
                            key={v.key}
                            disableRipple={view === v.key}
                            className={`${classes.viewBtn}${view === v.key ? ` ${classes.viewBtnActive}` : ''}`}
                            onClick={handlers[v.key]}
                        >
                            {v.label}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
}

CustomToolbar.propTypes = { classes: PropTypes.object.isRequired };

export default withRoot(withStyles(styles)(CustomToolbar));
