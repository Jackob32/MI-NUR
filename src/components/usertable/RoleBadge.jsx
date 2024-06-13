import React from 'react';

export default function RoleBadge({ type }) {
  const isManager = type === 'manager';
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        borderRadius: 999,
        fontSize: '0.7rem',
        fontWeight: 600,
        letterSpacing: '0.01em',
        whiteSpace: 'nowrap',
        background: isManager
          ? 'rgba(26,115,232,0.08)'
          : 'rgba(52,168,83,0.08)',
        color: isManager ? '#1A73E8' : '#34A853',
        border: isManager
          ? '1px solid rgba(26,115,232,0.2)'
          : '1px solid rgba(52,168,83,0.2)',
      }}
    >
      {isManager ? 'Vedoucí' : 'Zaměstnanec'}
    </span>
  );
}
