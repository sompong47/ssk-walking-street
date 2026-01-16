'use client';

import { useState, useEffect } from 'react';
import styles from './my-bookings.module.css';

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
  // ✅ กำหนดค่าเริ่มต้นเป็น Array ว่างเสมอ
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'price'>('date');
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const query = filter !== 'all' ? `?status=${filter}` : '';
      const response = await fetch(`/api/bookings${query}`);
      const data = await response.json();
      
      // ✅ แก้ไข 1: เช็คว่า data.data เป็น Array จริงไหม ก่อน set state
      if (data.success && Array.isArray(data.data)) {
        setBookings(data.data);
      } else {
        console.warn('API did not return an array:', data);
        setBookings([]); // ถ้าไม่ใช่ Array ให้เซ็ตเป็นว่างเพื่อกันแอปพัง
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]); // กรณี Error ให้เซ็ตเป็นว่าง
    } finally {
      setLoading(false);
    }
  };

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
      case 'pending':
        return 'รอการยืนยัน';
      case 'confirmed':
        return 'ยืนยันแล้ว';
      case 'cancelled':
        return 'ยกเลิก';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '#27ae60';
      case 'pending':
        return '#f39c12';
      case 'cancelled':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  };

  const getPaymentStatusText = (status?: string) => {
    switch (status) {
      case 'paid':
        return 'ชำระแล้ว';
      case 'unpaid':
        return 'ยังไม่ชำระ';
      case 'partial':
        return 'ชำระบางส่วน';
      default:
        return 'ยังไม่ชำระ';
    }
  };

  const calculateDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  // ✅ แก้ไข 2: เพิ่มการตรวจสอบ Array.isArray(bookings) ก่อน filter
  const safeBookings = Array.isArray(bookings) ? bookings : [];

  const filteredAndSortedBookings = safeBookings
    .filter(booking => {
        // ✅ ป้องกันกรณี booking หรือ lotId เป็น null/undefined
        if (!booking || !booking.lotId) return false;

        return (
            (booking.vendorName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (booking.lotId.lotNumber || '').includes(searchTerm) ||
            (booking.businessType || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
    })
    .sort((a, b) => {
      // ✅ ป้องกันกรณี lotId ไม่มีอยู่จริง
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
    cancelled: safeBookings.filter(b => b.status === 'cancelled').length,
  };

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>การจองของฉัน</h1>
          <p>ดูและจัดการการจองล็อคของคุณ</p>
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
          <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="ค้นหาด้วยชื่อ, เลขล็อค, หรือประเภทสินค้า..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filters}>
          <button 
            className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
            onClick={() => setFilter('all')}
          >
            ทั้งหมด ({stats.total})
          </button>
          <button 
            className={`${styles.filterBtn} ${filter === 'pending' ? styles.active : ''}`}
            onClick={() => setFilter('pending')}
          >
            รอการยืนยัน ({stats.pending})
          </button>
          <button 
            className={`${styles.filterBtn} ${filter === 'confirmed' ? styles.active : ''}`}
            onClick={() => setFilter('confirmed')}
          >
            ยืนยันแล้ว ({stats.confirmed})
          </button>
          <button 
            className={`${styles.filterBtn} ${filter === 'cancelled' ? styles.active : ''}`}
            onClick={() => setFilter('cancelled')}
          >
            ยกเลิก ({stats.cancelled})
          </button>
        </div>

        <div className={styles.sortSection}>
          <label>เรียงตาม:</label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as 'date' | 'price')}
            className={styles.sortSelect}
          >
            <option value="date">วันที่จอง</option>
            <option value="price">ราคา</option>
          </select>
        </div>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>กำลังโหลด...</p>
        </div>
      ) : filteredAndSortedBookings.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📋</div>
          <h3>ไม่พบการจอง</h3>
          <p>คุณยังไม่มีการจองในระบบ</p>
          <button className={styles.bookNowBtn} onClick={() => window.location.href = '/booking'}>
            จองล็อคเลย
          </button>
        </div>
      ) : (
        <div className={styles.bookingsList}>
          {filteredAndSortedBookings.map((booking) => (
            <div key={booking._id} className={styles.bookingCard}>
              <div className={styles.cardHeader}>
                <div className={styles.headerLeft}>
                  <div className={styles.lotInfo}>
                    {/* ✅ ใช้ Optional Chaining ป้องกัน Error หาก lotId เป็น null */}
                    <h3>ล็อค #{booking.lotId?.lotNumber || 'N/A'}</h3>
                    <span className={styles.section}>{booking.lotId?.section || '-'}</span>
                  </div>
                  {booking.lotId?.size && (
                    <span className={styles.lotSize}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M2 2h12v12H2V2zm1 1v10h10V3H3z"/>
                      </svg>
                      {booking.lotId.size}
                    </span>
                  )}
                </div>
                <div className={styles.headerRight}>
                  <span 
                    className={styles.status}
                    style={{ background: getStatusColor(booking.status) }}
                  >
                    {getStatusText(booking.status)}
                  </span>
                  <span className={styles.bookingId}>ID: {booking._id.slice(-6)}</span>
                </div>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <svg className={styles.icon} width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-4.42 0-8 1.79-8 4v2h16v-2c0-2.21-3.58-4-8-4z"/>
                    </svg>
                    <div>
                      <label>ชื่อผู้ค้า</label>
                      <span>{booking.vendorName}</span>
                    </div>
                  </div>

                  <div className={styles.infoItem}>
                    <svg className={styles.icon} width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4zm2 0v12h12V4H4z"/>
                    </svg>
                    <div>
                      <label>ประเภทสินค้า</label>
                      <span>{booking.businessType}</span>
                    </div>
                  </div>

                  <div className={styles.infoItem}>
                    <svg className={styles.icon} width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 4h16v2H2V4zm0 5h16v2H2V9zm0 5h16v2H2v-2z"/>
                    </svg>
                    <div>
                      <label>เบอร์โทร</label>
                      <span>{booking.vendorPhone}</span>
                    </div>
                  </div>

                  <div className={styles.infoItem}>
                    <svg className={styles.icon} width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.5 4A1.5 1.5 0 0 1 4 2.5h12A1.5 1.5 0 0 1 17.5 4v12a1.5 1.5 0 0 1-1.5 1.5H4A1.5 1.5 0 0 1 2.5 16V4z"/>
                    </svg>
                    <div>
                      <label>อีเมล</label>
                      <span>{booking.vendorEmail}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.dateSection}>
                  <div className={styles.dateRange}>
                    <div className={styles.dateItem}>
                      <label>วันเริ่มต้น</label>
                      <span className={styles.dateValue}>
                        {new Date(booking.startDate).toLocaleDateString('th-TH', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className={styles.dateArrow}>→</div>
                    <div className={styles.dateItem}>
                      <label>วันสิ้นสุด</label>
                      <span className={styles.dateValue}>
                        {new Date(booking.endDate).toLocaleDateString('th-TH', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className={styles.duration}>
                      <span>{calculateDuration(booking.startDate, booking.endDate)} วัน</span>
                    </div>
                  </div>
                </div>

                <div className={styles.priceSection}>
                  <div className={styles.priceDetails}>
                    <div className={styles.priceItem}>
                      <span>ราคาต่อเดือน</span>
                      {/* ✅ ป้องกัน Error ถ้า lotId หาย */}
                      <span className={styles.priceValue}>{(booking.lotId?.price || 0).toLocaleString()} บาท</span>
                    </div>
                    <div className={styles.priceItem}>
                      <span>ระยะเวลา</span>
                      <span>{Math.ceil(calculateDuration(booking.startDate, booking.endDate) / 30)} เดือน</span>
                    </div>
                    <div className={styles.totalPrice}>
                      <span>ยอดรวมทั้งหมด</span>
                      <span className={styles.totalAmount}>
                        {(booking.totalAmount || (booking.lotId?.price || 0) * Math.ceil(calculateDuration(booking.startDate, booking.endDate) / 30)).toLocaleString()} บาท
                      </span>
                    </div>
                  </div>
                  <div className={styles.paymentStatus}>
                    <span className={`${styles.paymentBadge} ${styles[booking.paymentStatus || 'unpaid']}`}>
                      {getPaymentStatusText(booking.paymentStatus)}
                    </span>
                  </div>
                </div>

                {booking.notes && (
                  <div className={styles.notesSection}>
                    <label>หมายเหตุ:</label>
                    <p>{booking.notes}</p>
                  </div>
                )}

                <div className={styles.timestamp}>
                  <span>จองเมื่อ: {new Date(booking.createdAt).toLocaleString('th-TH')}</span>
                </div>
              </div>

              <div className={styles.cardActions}>
                <button 
                  className={styles.viewBtn}
                  onClick={() => window.location.href = `/booking/${booking._id}`}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 3C4.5 3 1.5 5.5 0 8c1.5 2.5 4.5 5 8 5s6.5-2.5 8-5c-1.5-2.5-4.5-5-8-5zm0 8a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                  </svg>
                  ดูรายละเอียด
                </button>
                
                {booking.status === 'confirmed' && booking.paymentStatus !== 'paid' && (
                  <button className={styles.payBtn}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M2 2h12v2H2V2zm0 4h12v8H2V6zm2 2v4h8V8H4z"/>
                    </svg>
                    ชำระเงิน
                  </button>
                )}

                {booking.status === 'pending' && (
                  <button 
                    className={styles.cancelBtn}
                    onClick={() => {
                      setSelectedBooking(booking);
                      setShowModal(true);
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M4 4l8 8m0-8l-8 8" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    ยกเลิก
                  </button>
                )}

                <button className={styles.printBtn}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M4 2h8v2H4V2zm0 4h8v8H4V6z"/>
                  </svg>
                  พิมพ์
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancel Modal */}
      {showModal && selectedBooking && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>ยกเลิกการจอง</h2>
              <button 
                className={styles.closeBtn}
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              {/* ✅ ใช้ Optional Chaining ที่ lotId */}
              <p>คุณต้องการยกเลิกการจองล็อค #{selectedBooking.lotId?.lotNumber || 'N/A'} ใช่หรือไม่?</p>
              <div className={styles.formGroup}>
                <label>เหตุผลในการยกเลิก *</label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="กรุณาระบุเหตุผล..."
                  rows={4}
                  className={styles.textarea}
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button 
                className={styles.cancelModalBtn}
                onClick={() => {
                  setShowModal(false);
                  setCancelReason('');
                }}
              >
                ปิด
              </button>
              <button 
                className={styles.confirmCancelBtn}
                onClick={() => handleCancelBooking(selectedBooking._id)}
              >
                ยืนยันยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}