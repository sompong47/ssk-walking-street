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
  
  // State สำหรับเช็คเวลาเปิดจอง
  const [isSystemOpen, setIsSystemOpen] = useState(false);
  const [timeMessage, setTimeMessage] = useState('');

  useEffect(() => {
    fetchLots();
    checkTime(); // เช็คเวลาครั้งแรก
    
    // ตั้งเวลาเช็คใหม่ทุก 1 นาที (Real-time update)
    const timer = setInterval(checkTime, 60000);
    return () => clearInterval(timer);
  }, []);

  // ฟังก์ชันเช็ควัน/เวลา (จ-ศ, 07:00-20:00)
  const checkTime = () => {
    const now = new Date();
    const day = now.getDay(); // 0=อาทิตย์, 1=จันทร์, ..., 6=เสาร์
    const hour = now.getHours();

    // เงื่อนไข: วันจันทร์(1) ถึง ศุกร์(5)
    const isWeekday = day >= 1 && day <= 5;
    // เงื่อนไข: เวลา 07:00 ถึง 19:59 (ก่อน 20:00)
    const isOpenHours = hour >= 7 && hour < 20;

    if (isWeekday && isOpenHours) {
      setIsSystemOpen(true);
      setTimeMessage('');
    } else {
      setIsSystemOpen(false);
      setTimeMessage('⛔ ขณะนี้อยู่นอกเวลาทำการ (เปิดจอง จันทร์-ศุกร์ เวลา 07:00 - 20:00 น.)');
    }
  };

  const fetchLots = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/lots?limit=100'); // ดึงทั้งหมดมาแสดง
      const data = await response.json();
      if (data.success) {
        setLots(data.data.lots);
      }
    } catch (error) {
      console.error('Error fetching lots:', error);
    } finally {
      setLoading(false);
    }
  };

  // ... (handleSubmit เดิมของคุณ) ...
  const handleSubmit = async (formData: any) => {
      // ... โค้ดเดิม ...
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>จองล็อคตลาดถนนเดินศรีสะเกษ</h1>
        <p>คลิกที่ล็อคบนผังถนนเพื่อเลือก แล้วกรอกข้อมูลที่ฝั่งทางเท้า</p>

        {!isSystemOpen && (
          <div className={styles.notice}>
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
              <LotGrid 
                lots={lots} 
                selectedLot={selectedLot} 
                onSelectLot={(lot: ILot) => setSelectedLot(lot)} 
                isSystemOpen={isSystemOpen}
              />
            </div>
          </div>
          
          <aside className={styles.formSection}>
            <div className={styles.sidewalkCard}>
              {isSystemOpen && selectedLot ? (
                 <BookingForm 
                   selectedLot={selectedLot} 
                   onSubmit={handleSubmit} 
                   isLoading={isSubmitting}
                 />
              ) : (
                 <div className={styles.placeholder}>
                   {!isSystemOpen 
                     ? 'ระบบปิดรับจองในขณะนี้' 
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