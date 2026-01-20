'use client';

import { useState, useEffect } from 'react';
import type { ILot } from '@/lib/models/Lot';
import styles from './BookingForm.module.css';

interface BookingFormProps {
  selectedLot: ILot | null;
  // ลบ onSubmit ออก เพราะเราจะจัดการเองในนี้
  onCancel?: () => void; 
}

export function BookingForm({ selectedLot }: BookingFormProps) {
  const [formData, setFormData] = useState({
    vendorName: '',
    vendorPhone: '',
    vendorEmail: '',
    businessType: '',
    businessDescription: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  // คำนวณราคา
  useEffect(() => {
    if (selectedLot && formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1; 
      setTotalPrice(selectedLot.price * diffDays);
    }
  }, [selectedLot, formData.startDate, formData.endDate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔥 ฟังก์ชันยิง API และเปลี่ยนหน้า (ย้ายมาไว้ในนี้เลย)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // ห้ามรีเฟรชหน้าเด็ดขาด

    if (!selectedLot) return alert('กรุณาเลือกล็อคก่อน');
    if (!formData.vendorName || !formData.vendorPhone) return alert('กรุณากรอกชื่อและเบอร์โทร');

    setIsLoading(true);

    try {
      console.log('🚀 กำลังจองล็อต:', selectedLot.lotNumber);

      // 1. ยิง API
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lotId: selectedLot._id, // ใช้ ID จาก Props
          ...formData,
          totalPrice
        })
      });

      const data = await res.json();
      console.log('📡 Server ตอบกลับ:', data);

      if (data.success && data.data?._id) {
        // ✅ 2. ถ้าสำเร็จ บังคับเปลี่ยนหน้าทันที!
        window.location.href = `/payment/${data.data._id}`;
      } else {
        // ถ้าไม่สำเร็จ (เช่น ล็อคไม่ว่าง)
        alert(`❌ จองไม่สำเร็จ: ${data.message || 'ล็อตนี้อาจถูกจองไปแล้ว'}`);
        setIsLoading(false);
      }

    } catch (error) {
      console.error(error);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
      setIsLoading(false);
    }
  };

  if (!selectedLot) {
    return (
        <div className={`${styles.card} ${styles.emptyState}`}>
            <div className={styles.emptyIcon}>👈</div>
            <h3>กรุณาเลือกล็อคจากรายการ</h3>
        </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
         <h3>🛒 จองล็อค: <span className={styles.lotNumber}>#{selectedLot.lotNumber}</span></h3>
         <span className={styles.badge}>{selectedLot.section}</span>
      </div>

      <div className={styles.summaryBox}>
        <div className={styles.summaryItem}>
             <label>ราคา/วัน</label>
             <span className={styles.price}>{selectedLot.price.toLocaleString()} ฿</span>
        </div>
        <div className={`${styles.summaryItem} ${styles.totalHighlight}`}>
             <label>ราคารวม</label>
             <span>{totalPrice.toLocaleString()} ฿</span>
        </div>
      </div>

      {/* ใช้ onSubmit ที่เราเขียนเองด้านบน */}
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        
        <div className={styles.formGroup}>
            <label>ชื่อ-นามสกุล / ชื่อร้าน <span className={styles.req}>*</span></label>
            <input name="vendorName" value={formData.vendorName} onChange={handleChange} placeholder="ระบุชื่อร้าน" className={styles.input} />
        </div>

        <div className={styles.row}>
            <div className={styles.formGroup}>
                <label>เบอร์โทรศัพท์ <span className={styles.req}>*</span></label>
                <input name="vendorPhone" value={formData.vendorPhone} onChange={handleChange} placeholder="08xxxxxxxx" maxLength={10} className={styles.input} />
            </div>
            <div className={styles.formGroup}>
                <label>อีเมล</label>
                <input name="vendorEmail" value={formData.vendorEmail} onChange={handleChange} placeholder="ถ้ามี" className={styles.input} />
            </div>
        </div>

        <div className={styles.formGroup}>
            <label>ประเภทสินค้า <span className={styles.req}>*</span></label>
            <input name="businessType" value={formData.businessType} onChange={handleChange} placeholder="เช่น อาหาร, เสื้อผ้า" className={styles.input} />
        </div>

        <div className={styles.formGroup}>
            <label>รายละเอียดเพิ่มเติม</label>
            <textarea name="businessDescription" value={formData.businessDescription} onChange={handleChange} rows={2} className={styles.input} />
        </div>

        <div className={styles.row}>
            <div className={styles.formGroup}>
                <label>วันเริ่มขาย</label>
                <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className={styles.input} />
            </div>
            <div className={styles.formGroup}>
                <label>ถึงวันที่</label>
                <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className={styles.input} />
            </div>
        </div>

        <button type="submit" className={styles.submitBtn} disabled={isLoading}>
            {isLoading ? '⏳ กำลังบันทึกและเปลี่ยนหน้า...' : `ยืนยันการจอง (${totalPrice.toLocaleString()} บ.)`}
        </button>
      </form>
    </div>
  );
}