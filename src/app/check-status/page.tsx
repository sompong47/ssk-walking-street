'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './check-status.module.css';

interface IBooking {
  _id: string;
  lotId: {
    lotNumber: string;
    section: string;
  };
  startDate: string;
  endDate: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
}

export default function CheckStatusPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return alert('กรุณากรอกเบอร์โทรศัพท์');
    
    setLoading(true);
    setSearched(true);
    setBookings([]);

    try {
      // ยิง API ค้นหาด้วยเบอร์โทร
      const res = await fetch(`/api/bookings?phone=${phone}`);
      const data = await res.json();
      
      if (data.success) {
        setBookings(data.data);
      }
    } catch (error) {
      console.error(error);
      alert('เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string, paymentStatus: string) => {
    if (status === 'cancelled') return <span className={`${styles.badge} ${styles.cancelled}`}>ยกเลิก</span>;
    if (status === 'confirmed') return <span className={`${styles.badge} ${styles.confirmed}`}>จองสำเร็จ</span>;
    
    if (paymentStatus === 'paid') return <span className={`${styles.badge} ${styles.paid}`}>รอตรวจสอบ</span>;
    return <span className={`${styles.badge} ${styles.pending}`}>รอชำระเงิน</span>;
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchCard}>
        <h1>🔍 ตรวจสอบสถานะการจอง</h1>
        <p>กรอกเบอร์โทรศัพท์ที่คุณใช้จองเพื่อดูรายการทั้งหมด</p>
        
        <form onSubmit={handleSearch} className={styles.searchForm}>
            <input 
                type="tel" 
                placeholder="กรอกเบอร์โทรศัพท์ (เช่น 0812345678)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={styles.input}
            />
            <button type="submit" className={styles.searchBtn} disabled={loading}>
                {loading ? 'กำลังค้นหา...' : 'ค้นหา'}
            </button>
        </form>
      </div>

      {searched && (
        <div className={styles.resultContainer}>
           <h3>ผลการค้นหา: {bookings.length} รายการ</h3>
           
           {bookings.length === 0 && !loading ? (
             <div className={styles.notFound}>
                ❌ ไม่พบประวัติการจองของเบอร์นี้
             </div>
           ) : (
             <div className={styles.grid}>
                {bookings.map((item) => (
                    <div key={item._id} className={styles.bookingItem}>
                        <div className={styles.itemHeader}>
                            <span className={styles.lotBadge}>
                                ล็อค {item.lotId?.lotNumber || '?'}
                            </span>
                            {getStatusBadge(item.status, item.paymentStatus)}
                        </div>
                        
                        <div className={styles.itemBody}>
                            <p><strong>โซน:</strong> {item.lotId?.section}</p>
                            <p><strong>วันที่:</strong> {new Date(item.startDate).toLocaleDateString('th-TH')}</p>
                            <p><strong>ยอดเงิน:</strong> {item.totalAmount?.toLocaleString()} บาท</p>
                        </div>

                        {/* ถ้ายังไม่จ่าย หรือจ่ายแล้วแต่ยังไม่อนุมัติ ให้กดเข้าไปดูได้ */}
                        {item.status !== 'cancelled' && (
                            <button 
                                className={styles.viewBtn}
                                onClick={() => router.push(`/payment/${item._id}`)}
                            >
                                {item.status === 'confirmed' ? 'ดูรายละเอียด' : 'แจ้งโอน / แก้ไข'}
                            </button>
                        )}
                    </div>
                ))}
             </div>
           )}
        </div>
      )}
    </div>
  );
}