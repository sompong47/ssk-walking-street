'use client';

import { useState, useEffect } from 'react';
import styles from './bookings.module.css';

interface Booking {
  _id: string;
  createdAt: string;
  lotId?: {
    lotNumber: string;
  };
  vendorName: string;
  businessType: string;
  vendorPhone: string;
  status: string;
}

export default function AdminBookingsPage() {
  // ✅ กำหนดค่าเริ่มต้นเป็น Array ว่างเสมอ
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/bookings'); 
      const data = await res.json();
      
      // ✅ แก้ไขจุดที่ 1: ตรวจสอบว่าเป็น Array จริงไหม ก่อนบันทึก
      if (data.success && Array.isArray(data.data)) {
        setBookings(data.data);
      } else {
        console.warn('Invalid booking data:', data);
        setBookings([]); // ถ้าข้อมูลผิดฟอร์ม ให้เซ็ตเป็นว่างไว้ก่อน กันแอปพัง
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    if(!confirm(`ยืนยันการเปลี่ยนสถานะเป็น ${newStatus}?`)) return;

    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        alert('อัปเดตสถานะเรียบร้อย!');
        fetchData(); 
      } else {
        alert('เกิดข้อผิดพลาด');
      }
    } catch (error) {
      alert('เชื่อมต่อล้มเหลว');
    }
  };

  // ✅ แก้ไขจุดที่ 2: สร้างตัวแปร safeBookings เพื่อรับประกันว่าเป็น Array 100%
  const safeBookings = Array.isArray(bookings) ? bookings : [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>จัดการการจอง ({safeBookings.length})</h1>
        <button onClick={fetchData} className={styles.refreshBtn}>🔄 รีเฟรช</button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>วันเวลาจอง</th>
              <th>เลขล็อค</th>
              <th>ชื่อผู้ค้า</th>
              <th>เบอร์โทร</th>
              <th>สถานะ</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{textAlign:'center', padding:'20px'}}>กำลังโหลด...</td></tr>
            ) : safeBookings.length === 0 ? (
               // ✅ เพิ่มกรณีไม่มีข้อมูล
               <tr><td colSpan={6} style={{textAlign:'center', padding:'20px', color: '#888'}}>ไม่พบรายการจอง</td></tr>
            ) : (
              // ✅ ใช้ safeBookings.map แทน bookings.map
              safeBookings.map((b) => (
                <tr key={b._id}>
                  <td>{new Date(b.createdAt).toLocaleString('th-TH')}</td>
                  <td>
                    {/* ใช้ Optional Chaining (?) ป้องกัน Error ถ้า lotId หาย */}
                    <span className={styles.lotBadge}>{b.lotId?.lotNumber || 'N/A'}</span>
                  </td>
                  <td>
                      <div style={{fontWeight:'bold'}}>{b.vendorName}</div>
                      <div style={{fontSize:'12px', color:'#666'}}>{b.businessType}</div>
                  </td>
                  <td>{b.vendorPhone}</td>
                  <td>
                    <span className={`${styles.status} ${styles[b.status]}`}>
                      {b.status === 'pending' ? 'รอยืนยัน' : 
                       b.status === 'confirmed' ? 'เรียบร้อย' : 'ยกเลิก'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      {b.status === 'pending' && (
                          <>
                              <button 
                                  onClick={() => updateStatus(b._id, 'confirmed')}
                                  className={styles.approveBtn}
                              >
                                  ✅ อนุมัติ
                              </button>
                              <button 
                                  onClick={() => updateStatus(b._id, 'cancelled')}
                                  className={styles.rejectBtn}
                              >
                                  ❌ ยกเลิก
                              </button>
                          </>
                      )}
                      {b.status === 'confirmed' && (
                          <button 
                              onClick={() => updateStatus(b._id, 'cancelled')}
                              className={styles.rejectBtn}
                          >
                              ยกเลิกการจอง
                          </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}