'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from './booking-detail.module.css';

interface ILot {
  _id: string;
  lotNumber: string;
  section: string;
  status: string;
  price: number;
  size: number;
  width?: number;
  length?: number;
  location: string;
  description?: string;
  amenities?: string[];
}

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [lot, setLot] = useState<ILot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLotDetail();
  }, [params.id]);

  const fetchLotDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/lots/${params.id}`);
      const data = await response.json();
      if (data.success) {
        setLot(data.data);
      }
    } catch (error) {
      console.error('Error fetching lot detail:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>กำลังโหลด...</div>;
  }

  if (!lot) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>
          <h2>ไม่พบข้อมูลล็อค</h2>
          <button onClick={() => router.back()}>กลับไป</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={() => router.back()}>← กลับ</button>
      
      <div className={styles.content}>
        <div className={styles.mainInfo}>
          <h1>ล็อค #{lot.lotNumber}</h1>
          
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <label>หมวด</label>
              <span>{lot.section}</span>
            </div>
            <div className={styles.infoItem}>
              <label>สถานะ</label>
              <span className={`${styles.status} ${styles[lot.status]}`}>
                {lot.status === 'available' && 'ว่าง'}
                {lot.status === 'booked' && 'จองแล้ว'}
                {lot.status === 'reserved' && 'จอง'}
              </span>
            </div>
            <div className={styles.infoItem}>
              <label>ขนาด</label>
              <span>{lot.width}×{lot.length}m ({lot.size} ตรม.)</span>
            </div>
            <div className={styles.infoItem}>
              <label>ราคา</label>
              <span className={styles.price}>{lot.price.toLocaleString()} บาท/เดือน</span>
            </div>
          </div>

          {lot.description && (
            <div className={styles.description}>
              <h3>รายละเอียด</h3>
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

        <div className={styles.sidebar}>
          <div className={styles.bookingCard}>
            <h3>จองล็อคนี้</h3>
            {lot.status === 'booked' ? (
              <p className={styles.unavailable}>ล็อคนี้จองแล้ว</p>
            ) : (
              <button className={styles.bookBtn} onClick={() => router.push('/booking')}>
                ไปที่หน้าจอง
              </button>
            )}
          </div>

          <div className={styles.locationInfo}>
            <h3>ตำแหน่ง</h3>
            <p>{lot.location}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
