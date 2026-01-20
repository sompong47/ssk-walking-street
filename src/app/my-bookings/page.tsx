'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext'; // 👈 1. เรียกใช้ AuthContext
import styles from './my-bookings.module.css';
import { useRouter } from 'next/navigation';

interface Booking {
  _id: string;
  lotId: {
    _id: string;
    lotNumber: string;
    section: string;
    price: number;
    size: string;
  };
  vendorName: string;
  vendorEmail: string;
  vendorPhone: string;
  businessType: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  totalAmount: number;
  createdAt: string;
  paymentStatus?: 'paid' | 'unpaid' | 'partial';
  notes?: string;
}

export default function MyBookingsPage() {
  // 👈 2. ดึงข้อมูล User จากระบบ Login กลาง
  const { user, isLoggedIn, loading: authLoading } = useAuth();
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'price'>('date');
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  // 👈 3. ฟังก์ชันดึงข้อมูล (ใช้เบอร์จาก user.phone โดยตรง)
  const fetchBookings = useCallback(async () => {
    if (!user?.phone) return;

    try {
      setLoading(true);
      let query = `?phone=${user.phone}`;
      if (filter !== 'all') query += `&status=${filter}`;
      
      const response = await fetch(`/api/bookings${query}`);
      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        setBookings(data.data);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [user?.phone, filter]);

  // 👈 4. เมื่อเข้าหน้าเว็บ ถ้าล็อกอินแล้วให้ดึงข้อมูลเลย
  useEffect(() => {
    if (!authLoading) {
      if (isLoggedIn && user) {
        fetchBookings();
      } else {
        // ถ้ายังไม่ล็อกอิน ดีดกลับหน้าแรก หรือโชว์หน้าว่าง
        // router.push('/'); 
      }
    }
  }, [isLoggedIn, user, authLoading, filter, fetchBookings]);

  const handleCancelBooking = async (bookingId: string) => {
    if (!cancelReason.trim()) {
      alert('กรุณาระบุเหตุผลในการยกเลิก');
      return;
    }

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'cancelled',
          cancelReason 
        }),
      });

      if (response.ok) {
        alert('ยกเลิกการจองสำเร็จ');
        fetchBookings();
        setShowModal(false);
        setCancelReason('');
        setSelectedBooking(null);
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('เกิดข้อผิดพลาดในการยกเลิก');
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'รอการยืนยัน';
      case 'confirmed': return 'ยืนยันแล้ว';
      case 'cancelled': return 'ยกเลิก';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#27ae60';
      case 'pending': return '#f39c12';
      case 'cancelled': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const safeBookings = Array.isArray(bookings) ? bookings : [];

  const filteredAndSortedBookings = safeBookings
    .filter(booking => {
        if (!booking || !booking.lotId) return false;
        return (
            (booking.vendorName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (booking.lotId.lotNumber || '').includes(searchTerm) ||
            (booking.businessType || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
    })
    .sort((a, b) => {
      const priceA = a.lotId?.price || 0;
      const priceB = b.lotId?.price || 0;
      if (sortBy === 'date') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return priceB - priceA;
      }
    });

  const stats = {
    total: safeBookings.length,
    confirmed: safeBookings.filter(b => b.status === 'confirmed').length,
    pending: safeBookings.filter(b => b.status === 'pending').length,
  };

  // 👈 5. กรณีที่ยังไม่ล็อกอิน (โชว์ข้อความเตือนแทนฟอร์มกรอกเบอร์)
  if (!isLoggedIn && !authLoading) {
      return (
          <div className={styles.container} style={{justifyContent:'center', alignItems:'center', height:'60vh'}}>
              <div style={{textAlign:'center', background:'white', padding:40, borderRadius:16, boxShadow:'0 4px 20px rgba(0,0,0,0.05)'}}>
                  <h2 style={{color:'#e74c3c', marginBottom:10}}>⛔ ไม่สามารถเข้าถึงข้อมูลได้</h2>
                  <p style={{color:'#666', marginBottom:20}}>กรุณาเข้าสู่ระบบเพื่อดูประวัติการจองของคุณ</p>
              </div>
          </div>
      )
  }

  // 👈 6. หน้า Dashboard (แสดงทันทีไม่ต้องกรอกเบอร์)
  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>การจองของฉัน</h1>
          {/* แสดงชื่อ User ที่ล็อกอิน */}
          <p>ยินดีต้อนรับคุณ <strong>{user?.name}</strong></p> 
        </div>
        <div className={styles.headerStats}>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{stats.total}</span>
            <span className={styles.statLabel}>ทั้งหมด</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber} style={{ color: '#27ae60' }}>{stats.confirmed}</span>
            <span className={styles.statLabel}>ยืนยันแล้ว</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber} style={{ color: '#f39c12' }}>{stats.pending}</span>
            <span className={styles.statLabel}>รอยืนยัน</span>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className={styles.controlsSection}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="ค้นหา..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filters}>
          <button className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`} onClick={() => setFilter('all')}>ทั้งหมด</button>
          <button className={`${styles.filterBtn} ${filter === 'pending' ? styles.active : ''}`} onClick={() => setFilter('pending')}>รอยืนยัน</button>
          <button className={`${styles.filterBtn} ${filter === 'confirmed' ? styles.active : ''}`} onClick={() => setFilter('confirmed')}>ยืนยันแล้ว</button>
          <button className={`${styles.filterBtn} ${filter === 'cancelled' ? styles.active : ''}`} onClick={() => setFilter('cancelled')}>ยกเลิก</button>
        </div>

        <div className={styles.sortSection}>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as 'date' | 'price')}
            className={styles.sortSelect}
          >
            <option value="date">ล่าสุด</option>
            <option value="price">ราคา</option>
          </select>
        </div>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className={styles.loading}><p>กำลังโหลดข้อมูล...</p></div>
      ) : filteredAndSortedBookings.length === 0 ? (
        <div className={styles.empty}>
          <h3>ไม่พบประวัติการจอง</h3>
          <p>คุณยังไม่ได้จองล็อคใดๆ ในระบบ</p>
          <button className={styles.bookNowBtn} onClick={() => router.push('/booking')}>
            ไปหน้าจองล็อค
          </button>
        </div>
      ) : (
        <div className={styles.bookingsList}>
          {filteredAndSortedBookings.map((booking) => (
            <div key={booking._id} className={styles.bookingCard}>
              <div className={styles.cardHeader}>
                <div className={styles.headerLeft}>
                  <div className={styles.lotInfo}>
                    <h3>ล็อค #{booking.lotId?.lotNumber || 'N/A'}</h3>
                    <span className={styles.section}>{booking.lotId?.section || '-'}</span>
                  </div>
                </div>
                <div className={styles.headerRight}>
                  <span className={styles.status} style={{ background: getStatusColor(booking.status) }}>
                    {getStatusText(booking.status)}
                  </span>
                </div>
              </div>

              <div className={styles.cardBody}>
                 <div className={styles.infoGrid}>
                    <div className={styles.infoItem}><label>ร้าน:</label> <span>{booking.vendorName}</span></div>
                    <div className={styles.infoItem}><label>สินค้า:</label> <span>{booking.businessType}</span></div>
                    <div className={styles.infoItem}><label>ราคา:</label> <span style={{color:'green', fontWeight:'bold'}}>{booking.totalAmount?.toLocaleString()} บ.</span></div>
                 </div>

                 <div className={styles.cardActions} style={{marginTop: '15px', display:'flex', gap:'10px'}}>
                    
                    <button 
                        className={styles.filterBtn}
                        style={{flex:1, justifyContent:'center', background: '#f8fafc', border:'1px solid #cbd5e1', color:'#334155'}}
                        onClick={() => router.push(`/payment/${booking._id}`)}
                    >
                        {booking.status === 'confirmed' ? 'ดูรายละเอียด' : 'แจ้งชำระเงิน'}
                    </button>

                    {booking.status === 'pending' && (
                        <button 
                            className={styles.filterBtn}
                            style={{background: '#fee2e2', color: '#dc2626', border:'none', width:'auto'}}
                            onClick={() => { setSelectedBooking(booking); setShowModal(true); }}
                        >
                            ยกเลิก
                        </button>
                    )}
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancel Modal */}
      {showModal && selectedBooking && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
           <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <h3>ยืนยันการยกเลิก</h3>
                <p>ต้องการยกเลิกจองล็อค {selectedBooking.lotId?.lotNumber} ใช่หรือไม่?</p>
                <textarea 
                    value={cancelReason} 
                    onChange={e => setCancelReason(e.target.value)} 
                    placeholder="เหตุผล..."
                    className={styles.searchInput}
                    style={{width:'100%', minHeight:'80px', margin:'15px 0'}}
                />
                <div style={{display:'flex', gap:'10px', justifyContent:'flex-end'}}>
                    <button onClick={() => setShowModal(false)} className={styles.filterBtn}>ปิด</button>
                    <button onClick={() => handleCancelBooking(selectedBooking._id)} className={styles.filterBtn} style={{background:'#dc2626', color:'white'}}>ยืนยัน</button>
                </div>
           </div>
        </div>
      )}
    </div>
  );
}