'use client';

import { useState, useEffect } from 'react';
import styles from './bookings.module.css';

interface Booking {
  _id: string;
  createdAt: string;
  lotId?: {
    lotNumber: string;
    section: string;
    price: number;
  };
  vendorName: string;
  businessType: string;
  vendorPhone: string;
  status: string;
  paymentStatus: string;
  slipUrl?: string;
  totalAmount?: number;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlip, setSelectedSlip] = useState<Booking | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        const sorted = data.data.sort((a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setBookings(sorted);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error(error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async (booking: Booking, isApprove: boolean) => {
    const action = isApprove ? 'อนุมัติการชำระเงิน' : 'ปฏิเสธการชำระเงิน';
    if (!confirm(`ยืนยัน ${action} ของร้าน ${booking.vendorName} ใช่หรือไม่?`)) return;

    try {
      const res = await fetch(`/api/bookings/${booking._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentStatus: isApprove ? 'verified' : 'failed',
          status: isApprove ? 'confirmed' : 'pending',
        }),
      });

      if (res.ok) {
        alert(`${action}เรียบร้อย`);
        setSelectedSlip(null);
        fetchData();
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาด');
      console.error(error);
    }
  };

  const cancelBooking = async (id: string) => {
    if (!confirm('ยืนยันการยกเลิกการจองนี้?')) return;
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled', paymentStatus: 'failed' }),
      });
      if (res.ok) {
        alert('ยกเลิกการจองเรียบร้อย');
        fetchData();
      }
    } catch (e) {
      alert('เกิดข้อผิดพลาด');
      console.error(e);
    }
  };

  const safeBookings = Array.isArray(bookings) ? bookings : [];

  const getPaymentStatusTag = (status: string) => {
    switch (status) {
      case 'verified':
        return <span className={styles.tagGreen}>✓ จ่ายแล้ว</span>;
      case 'paid':
        return <span className={styles.tagOrange}>⏳ รอตรวจสลิป</span>;
      case 'pending':
        return <span className={styles.tagGray}>⚪ ยังไม่จ่าย</span>;
      case 'failed':
        return <span className={styles.tagRed}>✗ ไม่ผ่าน</span>;
      default:
        return <span className={styles.tagGray}>{status}</span>;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>จัดการการจอง & ตรวจสลิป ({safeBookings.length})</h1>
        <button onClick={fetchData} className={styles.refreshBtn}>
          🔄 รีเฟรช
        </button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>วันเวลา</th>
              <th>ลัก / ราคา</th>
              <th>ผู้ค้า</th>
              <th>สถานะการจ่าย</th>
              <th>สถานะจอง</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                  ⏳ กำลังโหลดข้อมูล...
                </td>
              </tr>
            ) : safeBookings.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                  ไม่มีข้อมูล
                </td>
              </tr>
            ) : (
              safeBookings.map((b) => (
                <tr key={b._id}>
                  <td>
                    <div style={{ fontWeight: 500 }}>
                      {new Date(b.createdAt).toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      })}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                      {new Date(b.createdAt).toLocaleTimeString('th-TH', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </td>
                  <td>
                    <div className={styles.lotBadge}>{b.lotId?.lotNumber || 'N/A'}</div>
                    <div style={{ fontSize: '12px', marginTop: '4px', color: '#64748b' }}>
                      {b.lotId?.price || 0} บาท
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{b.vendorName}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                      {b.vendorPhone}
                    </div>
                  </td>
                  <td>{getPaymentStatusTag(b.paymentStatus)}</td>
                  <td>
                    <span className={`${styles.status} ${styles[b.status]}`}>{b.status}</span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      {b.paymentStatus === 'paid' && (
                        <button
                          onClick={() => setSelectedSlip(b)}
                          className={styles.checkSlipBtn}
                        >
                          📷 ตรวจสลิป
                        </button>
                      )}
                      {b.status !== 'cancelled' && (
                        <button onClick={() => cancelBooking(b._id)} className={styles.rejectBtn}>
                          ยกเลิก
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

      {selectedSlip && (
        <div className={styles.modalOverlay} onClick={() => setSelectedSlip(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>ตรวจสอบสลิปการโอนเงิน</h3>

            <div className={styles.slipWrapper}>
              {selectedSlip.slipUrl ? (
                <img src={selectedSlip.slipUrl} alt="Slip" className={styles.slipImage} />
              ) : (
                <div className={styles.noSlip}>ไม่พบรูปภาพ</div>
              )}
            </div>

            <div className={styles.slipInfo}>
              <p>
                <strong>ผู้โอน:</strong> {selectedSlip.vendorName}
              </p>
              <p>
                <strong>ยอดที่ต้องชำระ:</strong> {selectedSlip.lotId?.price || 0} บาท
              </p>
              <p>
                <strong>เวลาตรวจสอบ:</strong>{' '}
                {new Date().toLocaleTimeString('th-TH', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </p>
            </div>

            <div className={styles.modalActions}>
              <button
                onClick={() => verifyPayment(selectedSlip, true)}
                className={styles.approveBtnFull}
              >
                ✓ ยืนยันการชำระเงิน (อนุมัติ)
              </button>
              <button
                onClick={() => verifyPayment(selectedSlip, false)}
                className={styles.rejectBtnFull}
              >
                ✗ ปฏิเสธ / สลิปปลอม
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}