'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from './payment-detail.module.css';

interface Payment {
  _id: string;
  bookingId: string;
  amount: number;
  status: 'pending' | 'success' | 'failed';
  paymentMethod?: string;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}

export default function PaymentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaymentDetail();
  }, [params.id]);

  const fetchPaymentDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/payments/${params.id}`);
      const data = await response.json();
      if (data.success) {
        setPayment(data.data);
      }
    } catch (error) {
      console.error('Error fetching payment:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>กำลังโหลด...</div>;
  }

  if (!payment) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>
          <h2>ไม่พบข้อมูลการชำระเงิน</h2>
          <button onClick={() => router.back()}>กลับ</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={() => router.back()}>← กลับ</button>

      <div className={styles.content}>
        <div className={styles.mainInfo}>
          <h1>รายละเอียดการชำระเงิน</h1>

          <div className={styles.statusCard} style={{
            borderLeftColor: payment.status === 'success' ? '#27ae60' : 
                            payment.status === 'pending' ? '#f39c12' : '#e74c3c'
          }}>
            <div className={styles.statusLabel}>สถานะ</div>
            <div className={styles.statusValue}>
              {payment.status === 'success' && 'ชำระเงินสำเร็จ'}
              {payment.status === 'pending' && 'รอการชำระเงิน'}
              {payment.status === 'failed' && 'ล้มเหลว'}
            </div>
          </div>

          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <label>ID การชำระเงิน</label>
              <span>{payment._id}</span>
            </div>
            <div className={styles.infoItem}>
              <label>ID การจอง</label>
              <span>{payment.bookingId}</span>
            </div>
            <div className={styles.infoItem}>
              <label>จำนวนเงิน</label>
              <span className={styles.amount}>{payment.amount.toLocaleString()} บาท</span>
            </div>
            <div className={styles.infoItem}>
              <label>วิธีการชำระ</label>
              <span>{payment.paymentMethod || '-'}</span>
            </div>
            <div className={styles.infoItem}>
              <label>วันที่สร้าง</label>
              <span>{new Date(payment.createdAt).toLocaleDateString('th-TH')}</span>
            </div>
            <div className={styles.infoItem}>
              <label>วันที่อัปเดต</label>
              <span>{new Date(payment.updatedAt).toLocaleDateString('th-TH')}</span>
            </div>
          </div>

          {payment.transactionId && (
            <div className={styles.transactionInfo}>
              <h3>หมายเลขอ้างอิงการทำธุรกรรม</h3>
              <p>{payment.transactionId}</p>
            </div>
          )}
        </div>

        <div className={styles.sidebar}>
          {payment.status === 'pending' && (
            <div className={styles.paymentCard}>
              <h3>ชำระเงิน</h3>
              <p>กรุณาชำระเงินจำนวน {payment.amount.toLocaleString()} บาท</p>
              <button className={styles.payBtn}>ไปชำระเงิน</button>
            </div>
          )}
          {payment.status === 'success' && (
            <div className={styles.successCard}>
              <h3>✓ ชำระเงินเสร็จสิ้น</h3>
              <p>ขอบคุณสำหรับการชำระเงิน</p>
              <button onClick={() => router.push('/my-bookings')}>
                ดูการจองของฉัน
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
