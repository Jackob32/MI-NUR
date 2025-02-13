import React from "react";
import PropTypes from 'prop-types';
import withRoot from "../../withRoot";
import { withStyles } from '@material-ui/core/styles';
import Lock from "@material-ui/icons/Lock";
import LockOpen from "@material-ui/icons/LockOpen";
import { formatDuration } from "../../functions";

const styles = {
    wrap: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: '4px 7px 5px',
        overflow: 'hidden',
    },
    topRow: {
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        marginBottom: 2,
        minWidth: 0,
    },
    badge: {
        flexShrink: 0,
        height: 20,
        minWidth: 32,
        borderRadius: 20,
        background: 'rgba(255,255,255,0.28)',
        border: '1px solid rgba(255,255,255,0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '10px',
        fontWeight: 700,
        color: '#fff',
        letterSpacing: '0.02em',
        padding: '0 5px',
    },
    /* Amber dot — someone has positive interest but isn't assigned yet */
    wantDot: {
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: '#FCD34D',
        flexShrink: 0,
        boxShadow: '0 0 0 2px rgba(252,211,77,0.4)',
    },
    lockIcon: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.7)',
        flexShrink: 0,
    },
    title: {
        fontWeight: 700,
        fontSize: '0.82rem',
        color: '#fff',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        lineHeight: 1.2,
        flex: 1,
    },
    meta: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        marginTop: 2,
        borderTop: '1px solid rgba(255,255,255,0.18)',
        paddingTop: 2,
    },
    duration: {
        fontSize: '0.68rem',
        color: 'rgba(255,255,255,0.65)',
        fontWeight: 600,
        flexShrink: 0,
    },
    note: {
        fontSize: '0.72rem',
        color: 'rgba(255,255,255,0.75)',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        flex: 1,
    },
    interestRow: {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        marginTop: 2,
        flexWrap: 'wrap',
    },
};

/* Inline style per interest level for the small badge chip */
const LEVEL_CHIP = {
    want:       { color: '#6EE7B7', bg: 'rgba(110,231,183,0.18)', symbol: '★' },
    can:        { color: '#7DD3FC', bg: 'rgba(125,211,252,0.18)', symbol: '↑' },
    available:  { color: 'rgba(255,255,255,0.7)', bg: 'rgba(255,255,255,0.12)', symbol: '◎' },
    prefer_not: { color: '#FCD34D', bg: 'rgba(252,211,77,0.18)',  symbol: '↓' },
    cannot:     { color: 'rgba(255,255,255,0.4)', bg: 'rgba(255,255,255,0.08)', symbol: '✗' },
};

function InterestChip({ level, count }) {
    const cfg = LEVEL_CHIP[level];
    if (!cfg || count === 0) return null;
    return (
        <span style={{
            fontSize: '0.62rem', fontWeight: 700,
            color: cfg.color, background: cfg.bg,
            borderRadius: 4, padding: '1px 4px',
        }}>
            {cfg.symbol}{count}
        </span>
    );
}

function Event({ classes, event }) {
    const filled   = event.employees.length;
    const cap      = event.capacity;
    const duration = formatDuration(event.start, event.end);
    const hasMeta  = duration || event.note;
    const interests = event.interests || [];

    const counts = {
        want:       interests.filter(i => i.level === 'want').length,
        can:        interests.filter(i => i.level === 'can').length,
        available:  interests.filter(i => i.level === 'available').length,
        prefer_not: interests.filter(i => i.level === 'prefer_not').length,
        cannot:     interests.filter(i => i.level === 'cannot').length,
    };
    const hasInterests = Object.values(counts).some(n => n > 0);

    /* Dot shows when someone positively interested isn't assigned yet */
    const hasUnassignedPositive = interests.some(
        i => (i.level === 'want' || i.level === 'can') &&
             !event.employees.some(e => e.email === i.email)
    );

    const showCapacity = event._showCapacity !== false;

    return (
        <div className={classes.wrap}>
            <div className={classes.topRow}>
                {showCapacity && <span className={classes.badge}>{filled}/{cap}</span>}
                {hasUnassignedPositive && (
                    <span className={classes.wantDot} title="Někdo chce / může vzít tuto směnu" />
                )}
                {event.locked
                    ? <Lock     className={classes.lockIcon} />
                    : <LockOpen className={classes.lockIcon} />
                }
                <span className={classes.title}>{event.title}</span>
            </div>

            {hasMeta && (
                <div className={classes.meta}>
                    {duration && <span className={classes.duration}>{duration}</span>}
                    {event.note && <span className={classes.note}>{event.note}</span>}
                </div>
            )}

            {hasInterests && (
                <div className={classes.interestRow}>
                    <InterestChip level="want"       count={counts.want} />
                    <InterestChip level="can"        count={counts.can} />
                    <InterestChip level="available"  count={counts.available} />
                    <InterestChip level="prefer_not" count={counts.prefer_not} />
                    <InterestChip level="cannot"     count={counts.cannot} />
                </div>
            )}
        </div>
    );
}

Event.propTypes = {
    classes: PropTypes.object.isRequired,
    event:   PropTypes.shape({
        employees: PropTypes.array.isRequired,
        capacity:  PropTypes.number.isRequired,
        start:     PropTypes.instanceOf(Date).isRequired,
        end:       PropTypes.instanceOf(Date).isRequired,
        title:     PropTypes.string,
        note:      PropTypes.string,
        locked:    PropTypes.bool,
        interests: PropTypes.array,
    }).isRequired,
};

export default withRoot(withStyles(styles)(Event));
