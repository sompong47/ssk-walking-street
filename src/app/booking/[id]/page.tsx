'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from './booking-detail.module.css';

interface ILot {
  _id: string;
  lotNumber: string;
  section: string;
  status: string; // available, reserved, maintenance, booked
  price: number;
  size?: string | number;
  width?: number;
  length?: number;
  location?: string;
  description?: string;
  amenities?: string[];
}

export default function BookingDetailPage() {
  const params = useParams();
  // ✅ แปลง id เป็น string ให้ชัวร์ (ป้องกันกรณีเป็น array)
  const id = Array.isArray(params?.id) ? params?.id[0] : params?.id;
  
  const router = useRouter();
  const [lot, setLot] = useState<ILot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchLotDetail();
    }
  }, [id]);

  const fetchLotDetail = async () => {
    try {
      setLoading(true);
      // ✅ เรียก API ดึงข้อมูล Lot
      const response = await fetch(`/api/lots/${id}`); 
      const data = await response.json();
      
      if (data.success && data.data) {
        setLot(data.data);
      } else {
        setLot(null);
      }
    } catch (error) {
      console.error('Error fetching lot detail:', error);
      setLot(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
        <div className={styles.container}>
            <div className={styles.loading}>
                กำลังโหลดข้อมูล...
            </div>
        </div>
    );
  }

  if (!lot) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>
          <h2>❌ ไม่พบข้อมูลล็อค</h2>
          <p>ล็อคนี้อาจถูกลบหรือไม่มีอยู่ในระบบ</p>
          <button className={styles.backBtn} onClick={() => router.back()}>
            กลับไปหน้าก่อนหน้า
          </button>
        </div>
      </div>
    );
  }

  // Helper สำหรับแสดงสถานะภาษาไทย
  const getStatusLabel = (status: string) => {
    switch(status) {
        case 'available': return '🟢 ว่าง';
        case 'booked': return '⏳ รอชำระเงิน';
        case 'reserved': return '🔴 จองแล้ว';
        case 'maintenance': return '🔧 ปิดปรับปรุง';
        default: return status;
    }
  };

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={() => router.back()}>← กลับ</button>
      
      <div className={styles.content}>
        <div className={styles.mainInfo}>
          <h1>ล็อค #{lot.lotNumber || '-'}</h1>
          
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <label>โซน/แถว</label>
              <span>{lot.section || '-'}</span>
            </div>
            
            <div className={styles.infoItem}>
              <label>สถานะ</label>
              <span className={`${styles.status} ${styles[lot.status] || ''}`}>
                {getStatusLabel(lot.status)}
              </span>
            </div>

            <div className={styles.infoItem}>
              <label>ขนาดพื้นที่</label>
              <span>
                {/* แสดงขนาดแบบฉลาด (ถ้ามี กว้างxยาว ให้โชว์ ถ้าไม่มีให้โชว์ size ธรรมดา) */}
                {lot.width && lot.length 
                  ? `${lot.width} x ${lot.length} เมตร` 
                  : (lot.size || '-')}
              </span>
            </div>

            <div className={styles.infoItem}>
              <label>ราคาเช่า</label>
              <span className={styles.price}>
                {lot.price ? lot.price.toLocaleString() : 0} บาท/วัน
              </span>
            </div>
          </div>

          {lot.description && (
            <div className={styles.description}>
              <h3>รายละเอียดเพิ่มเติม</h3>
              <p>{lot.description}</p>
            </div>
          )}

          {lot.amenities && lot.amenities.length > 0 && (
            <div className={styles.amenities}>
              <h3>สิ่งอำนวยความสะดวก</h3>
              <ul>
                {lot.amenities.map((amenity, idx) => (
                  <li key={idx}>{amenity}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Sidebar ด้านขวา */}
        <div className={styles.sidebar}>
          <div className={styles.bookingCard}>
            <h3>ดำเนินการ</h3>
            
            {lot.status === 'available' ? (
              <button 
                className={styles.bookBtn} 
                // ✅ แก้ไขสำคัญ: ต้องลิงก์ไปหน้า "กรอกฟอร์มจอง" (booking/create) ก่อน
                // เพื่อเก็บชื่อลูกค้าและสินค้า ก่อนจะไปจ่ายเงิน
                onClick={() => router.push(`/booking/create/${lot._id}`)}
              >
                จองล็อคนี้ทันที
              </button>
            ) : (
              <p className={styles.unavailable}>
                ⛔ ล็อคนี้ไม่ว่าง ({getStatusLabel(lot.status)})
              </p>
            )}

            <div style={{marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '10px'}}>
                <button 
                    onClick={() => router.push('/booking')}
                    style={{background:'none', border:'none', color:'#666', cursor:'pointer', textDecoration:'underline'}}
                >
                    ดูผังตลาดรวม
                </button>
            </div>
          </div>

          {lot.location && (
            <div className={styles.locationInfo}>
              <h3>📍 ตำแหน่งที่ตั้ง</h3>
              <p>{lot.location}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}