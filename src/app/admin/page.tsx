'use client';

import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    pending: 0,
    confirmed: 0,
    revenue: 0
  });

  useEffect(() => {
    // จำลองดึงข้อมูลจริง (เดี๋ยวค่อยทำ API จริงจัง)
    fetch('/api/bookings').then(res => res.json()).then(data => {
      if(data.success && Array.isArray(data.data)) {
        const bookings = data.data;
        setStats({
          totalBookings: bookings.length,
          pending: bookings.filter((b: any) => b.status === 'pending').length,
          confirmed: bookings.filter((b: any) => b.status === 'confirmed').length,
          revenue: bookings.reduce((sum: number, b: any) => sum + (b.totalAmount || 0), 0)
        });
      }
    });
  }, []);

  return (
    <div>
      <h1 style={{fontSize: '24px', marginBottom: '20px', fontWeight: 'bold'}}>ภาพรวมระบบ</h1>
      
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px'}}>
        {/* Card 1 */}
        <div style={{background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'}}>
          <div style={{color: '#64748b', fontSize: '14px'}}>การจองทั้งหมด</div>
          <div style={{fontSize: '32px', fontWeight: 'bold', color: '#1e293b'}}>{stats.totalBookings}</div>
        </div>

        {/* Card 2 */}
        <div style={{background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'}}>
          <div style={{color: '#e67e22', fontSize: '14px'}}>รอยืนยัน/ชำระเงิน</div>
          <div style={{fontSize: '32px', fontWeight: 'bold', color: '#d35400'}}>{stats.pending}</div>
        </div>

        {/* Card 3 */}
        <div style={{background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'}}>
          <div style={{color: '#27ae60', fontSize: '14px'}}>ยืนยันแล้ว</div>
          <div style={{fontSize: '32px', fontWeight: 'bold', color: '#27ae60'}}>{stats.confirmed}</div>
        </div>

        {/* Card 4 */}
        <div style={{background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'}}>
          <div style={{color: '#2980b9', fontSize: '14px'}}>รายได้โดยประมาณ</div>
          <div style={{fontSize: '32px', fontWeight: 'bold', color: '#2980b9'}}>{stats.revenue.toLocaleString()} ฿</div>
        </div>
      </div>
    </div>
  );
}