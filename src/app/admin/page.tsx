'use client';

import { useEffect, useState } from 'react';

interface Stats {
  totalBookings: number;
  pending: number;
  confirmed: number;
  revenue: number;
  paymentVerified: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalBookings: 0,
    pending: 0,
    confirmed: 0,
    revenue: 0,
    paymentVerified: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();

      if (data.success && Array.isArray(data.data)) {
        const bookings = data.data;
        const totalRevenue = bookings.reduce(
          (sum: number, b: any) => sum + (b.lotId?.price || 0),
          0
        );

        setStats({
          totalBookings: bookings.length,
          pending: bookings.filter((b: any) => b.status === 'pending').length,
          confirmed: bookings.filter((b: any) => b.status === 'confirmed').length,
          paymentVerified: bookings.filter((b: any) => b.paymentStatus === 'verified').length,
          revenue: totalRevenue,
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({
    icon,
    label,
    value,
    color,
    unit = '',
  }: {
    icon: string;
    label: string;
    value: string | number;
    color: string;
    unit?: string;
  }) => (
    <div
      style={{
        background: 'white',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        border: `1px solid ${color}20`,
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow =
          '0 8px 16px rgba(0, 0, 0, 0.1)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow =
          '0 2px 8px rgba(0, 0, 0, 0.06)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
      }}
    >
      <div style={{ fontSize: '32px', marginBottom: '12px' }}>{icon}</div>
      <div
        style={{
          color: '#94a3b8',
          fontSize: '13px',
          fontWeight: 500,
          marginBottom: '8px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: '36px',
          fontWeight: 700,
          color,
          lineHeight: 1,
        }}
      >
        {value}
        <span style={{ fontSize: '16px', marginLeft: '4px' }}>{unit}</span>
      </div>
    </div>
  );

  return (
    <div style={{ padding: '0 0 40px 0' }}>
      {/* Header */}
      <div
        style={{
          marginBottom: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '28px',
              fontWeight: 700,
              color: '#1e293b',
              margin: '0 0 8px 0',
            }}
          >
            ภาพรวมระบบ
          </h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>
            สรุปสถิติการจองและการชำระเงิน
          </p>
        </div>
        <button
          onClick={fetchStats}
          style={{
            padding: '8px 16px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 500,
            fontSize: '14px',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = '#2563eb';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = '#3b82f6';
          }}
        >
          🔄 รีเฟรช
        </button>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                background: 'white',
                padding: '24px',
                borderRadius: '12px',
                height: '160px',
                animation: 'pulse 2s infinite',
              }}
            />
          ))}
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '32px',
          }}
        >
          <StatCard
            icon="■"
            label="การจองทั้งหมด"
            value={stats.totalBookings}
            color="#3b82f6"
          />
          <StatCard
            icon="⧗"
            label="รอยืนยัน/ชำระเงิน"
            value={stats.pending}
            color="#f59e0b"
          />
          <StatCard
            icon="▲"
            label="ยืนยันแล้ว"
            value={stats.confirmed}
            color="#10b981"
          />
          <StatCard
            icon="✓"
            label="ชำระเงินแล้ว"
            value={stats.paymentVerified}
            color="#8b5cf6"
          />
        </div>
      )}

      {/* Revenue Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '32px',
          borderRadius: '12px',
          color: 'white',
          boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
          marginBottom: '32px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <div style={{ fontSize: '16px', fontWeight: 500, opacity: 0.9 }}>
              รายได้โดยประมาณ
            </div>
            <div
              style={{
                fontSize: '40px',
                fontWeight: 700,
                marginTop: '8px',
              }}
            >
              {stats.revenue.toLocaleString('th-TH')} ฿
            </div>
          </div>
          <div
            style={{
              fontSize: '64px',
              opacity: 0.2,
            }}
          >
            $
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
        }}
      >
        <div
          style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            borderLeft: '4px solid #3b82f6',
          }}
        >
          <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>
            อัตราการชำระเงิน
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#3b82f6' }}>
            {stats.totalBookings > 0
              ? Math.round((stats.paymentVerified / stats.totalBookings) * 100)
              : 0}
            %
          </div>
        </div>

        <div
          style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            borderLeft: '4px solid #10b981',
          }}
        >
          <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>
            อัตราการยืนยัน
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#10b981' }}>
            {stats.totalBookings > 0
              ? Math.round((stats.confirmed / stats.totalBookings) * 100)
              : 0}
            %
          </div>
        </div>

        <div
          style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            borderLeft: '4px solid #f59e0b',
          }}
        >
          <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>
            เฉลี่ยต่อการจอง
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#f59e0b' }}>
            {stats.totalBookings > 0
              ? (stats.revenue / stats.totalBookings).toLocaleString('th-TH', {
                  maximumFractionDigits: 0,
                })
              : 0}
            ฿
          </div>
        </div>
      </div>

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}