import React from 'react';
import PropTypes from 'prop-types';
import { COLORS } from '../../constants/colors';

/**
 * Small metric card showing a coloured value and a muted label beneath it.
 * Used in the employee home page and user manager for workload stats.
 */
function StatCard({ label, value, color, minWidth }) {
    return (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '6px 18px', borderRadius: 8,
            background: COLORS.surface, border: `1px solid ${COLORS.border}`,
            minWidth: minWidth || 110,
        }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 700, color, lineHeight: 1.2 }}>
                {value}
            </span>
            <span style={{ fontSize: '0.65rem', color: COLORS.ink3, fontWeight: 500, marginTop: 2 }}>
                {label}
            </span>
        </div>
    );
}

StatCard.propTypes = {
    label:    PropTypes.string.isRequired,
    value:    PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    color:    PropTypes.string,
    minWidth: PropTypes.number,
};

StatCard.defaultProps = {
    color:    COLORS.blue,
    minWidth: 110,
};

export default StatCard;
