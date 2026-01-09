'use client';

import { useState, useEffect } from 'react';
import styles from './payment.module.css';

interface Payment {
  _id: string;
  bookingId: string;
  amount: number;
  status: 'pending' | 'success' | 'failed';
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export default function PaymentPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchPayments();
  }, [filter]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const query = filter !== 'all' ? `?status=${filter}` : '';
      const response = await fetch(`/api/payments${query}`);
      const data = await response.json();
      if (data.success) {
        setPayments(data.data);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return '#27ae60';
      case 'pending':
        return '#f39c12';
      case 'failed':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success':
        return 'สำเร็จ';
      case 'pending':
        return 'รอการชำระ';
      case 'failed':
        return 'ล้มเหลว';
      default:
        return status;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>ประวัติการชำระเงิน</h1>
        <p>ดูสถานะการชำระเงินและรายการทั้งหมด</p>
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
          รอการชำระ
        </button>
        <button 
          className={`${styles.filterBtn} ${filter === 'success' ? styles.active : ''}`}
          onClick={() => setFilter('success')}
        >
          สำเร็จ
        </button>
        <button 
          className={`${styles.filterBtn} ${filter === 'failed' ? styles.active : ''}`}
          onClick={() => setFilter('failed')}
        >
          ล้มเหลว
        </button>
      </div>

      {loading ? (
        <div className={styles.loading}>กำลังโหลด...</div>
      ) : payments.length === 0 ? (
        <div className={styles.empty}>
          <p>ไม่พบข้อมูลการชำระเงิน</p>
        </div>
      ) : (
        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <div className={styles.colId}>ID</div>
            <div className={styles.colAmount}>จำนวนเงิน</div>
            <div className={styles.colMethod}>วิธีการชำระ</div>
            <div className={styles.colStatus}>สถานะ</div>
            <div className={styles.colDate}>วันที่</div>
            <div className={styles.colAction}>ดำเนินการ</div>
          </div>

          {payments.map((payment) => (
            <div key={payment._id} className={styles.tableRow}>
              <div className={styles.colId}>{payment._id.slice(-8)}</div>
              <div className={styles.colAmount}>{payment.amount.toLocaleString()} บาท</div>
              <div className={styles.colMethod}>{payment.paymentMethod}</div>
              <div className={styles.colStatus}>
                <span 
                  className={styles.statusBadge}
                  style={{ background: getStatusColor(payment.status) }}
                >
                  {getStatusText(payment.status)}
                </span>
              </div>
              <div className={styles.colDate}>
                {new Date(payment.createdAt).toLocaleDateString('th-TH')}
              </div>
              <div className={styles.colAction}>
                <button className={styles.viewBtn}>ดู</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
