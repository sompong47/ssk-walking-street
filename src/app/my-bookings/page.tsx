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
  };
  vendorName: string;
  vendorEmail: string;
  vendorPhone: string;
  businessType: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const query = filter !== 'all' ? `?status=${filter}` : '';
      const response = await fetch(`/api/bookings${query}`);
      const data = await response.json();
      if (data.success) {
        setBookings(data.data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>การจองของฉัน</h1>
        <p>ดูและจัดการการจองล็อคของคุณ</p>
      </div>

      <div className={styles.filters}>
        <button 
          className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
          onClick={() => setFilter('all')}
        >
          ทั้งหมด
        </button>
        <button 
          className={`${styles.filterBtn} ${filter === 'pending' ? styles.active : ''}`}
          onClick={() => setFilter('pending')}
        >
          รอการยืนยัน
        </button>
        <button 
          className={`${styles.filterBtn} ${filter === 'confirmed' ? styles.active : ''}`}
          onClick={() => setFilter('confirmed')}
        >
          ยืนยันแล้ว
        </button>
      </div>

      {loading ? (
        <div className={styles.loading}>กำลังโหลด...</div>
      ) : bookings.length === 0 ? (
        <div className={styles.empty}>
          <p>คุณยังไม่มีการจอง</p>
        </div>
      ) : (
        <div className={styles.bookingsList}>
          {bookings.map((booking) => (
            <div key={booking._id} className={styles.bookingCard}>
              <div className={styles.cardHeader}>
                <div>
                  <h3>ล็อค #{booking.lotId.lotNumber}</h3>
                  <p className={styles.section}>{booking.lotId.section}</p>
                </div>
                <span 
                  className={styles.status}
                  style={{ background: getStatusColor(booking.status) }}
                >
                  {getStatusText(booking.status)}
                </span>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.row}>
                  <div className={styles.col}>
                    <label>ชื่อผู้ค้า</label>
                    <span>{booking.vendorName}</span>
                  </div>
                  <div className={styles.col}>
                    <label>เบอร์โทร</label>
                    <span>{booking.vendorPhone}</span>
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.col}>
                    <label>อีเมล</label>
                    <span>{booking.vendorEmail}</span>
                  </div>
                  <div className={styles.col}>
                    <label>ประเภทสินค้า</label>
                    <span>{booking.businessType}</span>
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.col}>
                    <label>วันเริ่มต้น</label>
                    <span>{new Date(booking.startDate).toLocaleDateString('th-TH')}</span>
                  </div>
                  <div className={styles.col}>
                    <label>วันสิ้นสุด</label>
                    <span>{new Date(booking.endDate).toLocaleDateString('th-TH')}</span>
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.col}>
                    <label>ราคา</label>
                    <span className={styles.price}>{booking.lotId.price.toLocaleString()} บาท/เดือน</span>
                  </div>
                </div>
              </div>

              <div className={styles.cardActions}>
                <button className={styles.viewBtn}>ดูรายละเอียด</button>
                {booking.status === 'pending' && (
                  <button className={styles.cancelBtn}>ยกเลิก</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
