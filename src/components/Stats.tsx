'use client';

import React from 'react';

const colors = {
  primary: '#2c3e50',
  secondary: '#3498db',
  success: '#27ae60',
  warning: '#f39c12',
  danger: '#e74c3c',
  light: '#ecf0f1',
  dark: '#2c3e50',
};

interface StatsProps {
  stats: any;
}

export function Stats({ stats }: StatsProps) {
  const statItems = [
    { label: 'ล็อคทั้งหมด', value: stats?.totalLots || 0, color: colors.primary },
    { label: 'ว่าง', value: stats?.availableLots || 0, color: colors.success },
    { label: 'จองแล้ว', value: stats?.bookedLots || 0, color: colors.danger },
    { label: 'รอการชำระ', value: stats?.reservedLots || 0, color: colors.warning },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '12px',
      marginBottom: '20px',
    }}>
      {statItems.map((item, idx) => (
        <div
          key={idx}
          style={{
            backgroundColor: '#fff',
            borderLeft: `4px solid ${item.color}`,
            padding: '15px',
            borderRadius: '6px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
            {item.label}
          </div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: item.color }}>
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
}