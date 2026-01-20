'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from './create-booking.module.css';

export default function CreateBookingPage() {
  const router = useRouter();
  const params = useParams();
  const lotId = Array.isArray(params?.id) ? params?.id[0] : params?.id;

  const [lot, setLot] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    vendorName: '',
    vendorPhone: '',
    vendorEmail: '',
    businessType: '',
    businessDescription: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (lotId) {
      fetch(`/api/lots/${lotId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setLot(data.data);
          } else {
            alert('ไม่พบข้อมูลล็อค');
            router.back();
          }
          setLoading(false);
        })
        .catch(err => setLoading(false));
    }
  }, [lotId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 🔥 เปลี่ยนจาก handleSubmit เป็น handleSave (ไม่ต้องรับ event)
  const handleSave = async () => {
    // Validation แบบบ้านๆ
    if (!formData.vendorName || !formData.vendorPhone || !formData.businessType) {
        alert('กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครบ');
        return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lotId, ...formData })
      });

      const data = await res.json();
      console.log('Result:', data);

      if (data.success && data.data?._id) {
        // ✅ บังคับเปลี่ยนหน้า (สังเกตว่าไม่มี alert มาคั่นแล้ว)
        window.location.href = `/payment/${data.data._id}`;
      } else {
        alert(data.message || 'จองไม่สำเร็จ');
        setSubmitting(false);
      }
    } catch (error) {
      console.error(error);
      alert('Error เชื่อมต่อ Server ไม่ได้');
      setSubmitting(false);
    }
  };

  if (loading) return <div className={styles.container}><div style={{marginTop:50, textAlign:'center'}}>กำลังโหลด...</div></div>;
  if (!lot) return <div className={styles.container}>ไม่พบข้อมูลล็อค</div>;

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <h1 className={styles.title}>📝 ลงทะเบียนจองล็อค</h1>
        <div className={styles.lotSummary}>
          ล็อค: <strong>{lot.lotNumber}</strong> ({lot.section}) | ราคา: <span className={styles.price}>{lot.price}</span> บ.
        </div>

        {/* ❌ เอา <form> ออก เปลี่ยนเป็น <div> แทน */}
        <div className={styles.form}>
          <div className={styles.formGroup}>
            <label>ชื่อร้าน *</label>
            <input name="vendorName" value={formData.vendorName} onChange={handleChange} placeholder="เช่น ร้านป้าพร" />
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
                <label>เบอร์โทร *</label>
                <input type="tel" name="vendorPhone" value={formData.vendorPhone} onChange={handleChange} placeholder="08xxxxxxxx" />
            </div>
            <div className={styles.formGroup}>
                <label>อีเมล</label>
                <input type="email" name="vendorEmail" value={formData.vendorEmail} onChange={handleChange} />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>สินค้า *</label>
            <input name="businessType" value={formData.businessType} onChange={handleChange} placeholder="เช่น เสื้อผ้า, อาหาร" />
          </div>

          <div className={styles.formGroup}>
            <label>รายละเอียดเพิ่มเติม</label>
            <textarea name="businessDescription" rows={3} value={formData.businessDescription} onChange={handleChange}></textarea>
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
               <label>เริ่มขาย</label>
               <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
            </div>
            <div className={styles.formGroup}>
               <label>ถึงวันที่</label>
               <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
            </div>
          </div>

          {/* 🔥 เปลี่ยน type="submit" เป็น type="button" และใส่ onClick */}
          <button 
            type="button" 
            className={styles.submitBtn} 
            disabled={submitting}
            onClick={handleSave}
          >
            {submitting ? 'กำลังบันทึก...' : 'ยืนยันการจอง'}
          </button>
        </div>
      </div>
    </div>
  );
}