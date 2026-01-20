'use client';

import { useState, useEffect } from 'react';
import { LotGrid } from '@/components/LotGrid';
import { BookingForm } from '@/components/BookingForm';
import type { ILot } from '@/lib/models/Lot';
import styles from './booking.module.css';

export default function BookingPage() {
  const [lots, setLots] = useState<ILot[]>([]);
  const [selectedLot, setSelectedLot] = useState<ILot | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState<string>('');
  
  // 🟢 State ใหม่: เลือกวัน (เสาร์ หรือ อาทิตย์)
  // Default เป็น 'sunday' (วันอาทิตย์) เพราะเห็นภาพรวมทั้งหมด
  const [selectedDay, setSelectedDay] = useState<'saturday' | 'sunday'>('sunday');

  // State สำหรับเช็คเวลาเปิดจอง
  const [isSystemOpen, setIsSystemOpen] = useState(false);
  const [timeMessage, setTimeMessage] = useState('');

  useEffect(() => {
    fetchLots();
    checkTime(); 
    
    // ตั้งเวลาเช็คใหม่ทุก 1 นาที
    const timer = setInterval(checkTime, 60000);
    return () => clearInterval(timer);
  }, []);

  // ---------------------------------------------------------
  // 1. ฟังก์ชันเช็คเวลา
  // ---------------------------------------------------------
  const checkTime = () => {
    const now = new Date();
    const hour = now.getHours();
    
    // ตั้งค่าเวลาเปิดระบบ (0-24 น. คือเปิดตลอด)
    const isOpenDay = true; 
    const isOpenTime = hour >= 0 && hour < 24; 

    if (isOpenDay && isOpenTime) {
      setIsSystemOpen(true);
      setTimeMessage('');
    } else {
      setIsSystemOpen(false);
      setTimeMessage('⛔ ขณะนี้อยู่นอกเวลาทำการ');
      setSelectedLot(null);
    }
  };

  const fetchLots = async () => {
    try {
      setLoading(true);
      setFetchError('');
      
      // 🟢 แก้ไขจุดสำคัญ: เปลี่ยนจาก 300 เป็น 1000 เพื่อให้ดึงข้อมูลครบทุกแถว (900 ล็อค)
      const response = await fetch('/api/lots?limit=1000'); 
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setLots(data.data.lots);
      } else {
        const errMsg = data.error || 'ไม่สามารถโหลดล็อคได้';
        console.error('Failed to fetch lots:', errMsg);
        setFetchError(errMsg);
      }
    } catch (error: any) {
      console.error('Error fetching lots:', error);
      setFetchError(error.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // 2. ฟังก์ชันส่งข้อมูลจอง
  // ---------------------------------------------------------
  const handleSubmit = async (formData: any) => {
    if (!selectedLot) return;

    try {
      setIsSubmitting(true);
      
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          lotId: selectedLot._id,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert('✅ จองล็อคสำเร็จเรียบร้อย!');
        setSelectedLot(null); 
        fetchLots(); // อัปเดตข้อมูลทันที
      } else {
        alert(`❌ ไม่สามารถจองได้: ${result.error}`);
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('❌ เกิดข้อผิดพลาดในการเชื่อมต่อระบบ');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>จองล็อคตลาดถนนเดินศรีสะเกษ</h1>
        <p>คลิกที่ล็อคบนผังถนนเพื่อเลือก แล้วกรอกข้อมูลที่ฝั่งทางเท้า</p>

        {/* 🟢 ส่วนเลือกวัน (Dropdown) */}
        <div style={{ marginTop: '15px', padding: '10px', background: '#f8f9fa', borderRadius: '8px', display: 'inline-block' }}>
            <label style={{ marginRight: '10px', fontWeight: 'bold', color: '#2c3e50' }}>
                📅 เลือกวันที่ต้องการจอง:
            </label>
            <select 
                value={selectedDay}
                onChange={(e) => {
                    setSelectedDay(e.target.value as 'saturday' | 'sunday');
                    setSelectedLot(null); // เคลียร์ล็อคที่เลือกไว้เวลากดเปลี่ยนวัน
                }}
                style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '1rem',
                    cursor: 'pointer'
                }}
            >
                <option value="saturday">วันเสาร์ (ระยะสั้น ~200m)</option>
                <option value="sunday">วันอาทิตย์ (เต็มพื้นที่ ~450m)</option>
            </select>
        </div>

        {/* ส่วนแสดง Error ถ้ามี */}
        {fetchError && (
          <div className={styles.notice} style={{backgroundColor: '#ffebee', color: '#c62828', marginTop: '10px'}}>
            ⚠️ {fetchError}
          </div>
        )}

        {/* ส่วนแสดงสถานะ ปิด/เปิด */}
        {!isSystemOpen && (
          <div className={styles.notice} style={{backgroundColor: '#ffebee', color: '#c62828', marginTop: '10px'}}>
            {timeMessage}
          </div>
        )}
      </div>

      {loading ? (
        <div className={styles.loading}>กำลังโหลดผังตลาด...</div>
      ) : (
        <div className={styles.content}>
          <div className={styles.gridSection}>
            <div className={styles.streetArea}>
              
              {/* 🟢 ส่ง selectedDay ไปให้ LotGrid */}
              <LotGrid 
                lots={lots} 
                selectedLot={selectedLot} 
                onSelectLot={(lot) => {
                    if (!isSystemOpen) {
                        alert(timeMessage);
                        return;
                    }
                    setSelectedLot(lot);
                }} 
                isSystemOpen={isSystemOpen}
                selectedDay={selectedDay} 
              />
              
            </div>
          </div>
          
          <aside className={styles.formSection}>
            <div className={styles.sidewalkCard}>
              {isSystemOpen && selectedLot ? (
                 <BookingForm 
                   selectedLot={selectedLot}
                 />
              ) : (
                 <div className={styles.placeholder}>
                   {!isSystemOpen 
                     ? '⛔ ระบบปิดรับจองในขณะนี้' 
                     : '👈 กรุณาคลิกเลือกล็อคจากผังถนนทางซ้ายมือ'}
                 </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}