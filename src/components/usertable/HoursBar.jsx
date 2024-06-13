import React from 'react';

export default function HoursBar({ contracted, scheduled }) {
  const pct =
    contracted > 0
      ? Math.min(100, Math.round((scheduled / contracted) * 100))
      : 0;
  const color = pct >= 100 ? '#EA4335' : pct >= 75 ? '#FBBC04' : '#34A853';
  return (
    <div style={{ minWidth: 70 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.72rem',
          marginBottom: 2,
        }}
      >
        <span style={{ color: '#0F172A', fontWeight: 600 }}>
          {contracted} h
        </span>
        {scheduled > 0 && (
          <span style={{ color: '#94A3B8', fontSize: '0.65rem' }}>
            {Math.round(scheduled)}h plán.
          </span>
        )}
      </div>
      <div
        style={{
          height: 4,
          borderRadius: 4,
          background: '#E2E8F0',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            background: color,
            borderRadius: 4,
            transition: 'width 0.3s',
          }}
        />
      </div>
    </div>
  );
}
