'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // ใช้ redirect หลังแจ้งโอน
import styles from './payment.module.css'; // เดี๋ยวสร้างไฟล์ css นี้ต่อ

export default function PaymentPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [booking, setBooking] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ดึงข้อมูลการจองมาแสดง (เช่น จ่ายค่าล็อค A05 ราคา 100 บาท)
  useEffect(() => {
    fetch(`/api/bookings/${params.id}`) // ต้องมี API ดึง Booking by ID (เดี๋ยวพาทำถ้ายังไม่มี)
      .then(res => res.json())
      .then(data => {
        if(data.success) setBooking(data.data);
      });
  }, [params.id]);

  // ฟังก์ชันเลือกรูป
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile)); // โชว์ตัวอย่างรูป
    }
  };

  // ฟังก์ชันกดแจ้งโอน
  const handleSubmit = async () => {
    if (!file) return alert('กรุณาแนบสลิปโอนเงิน');
    setLoading(true);

    try {
      // 1. อัปโหลดรูปก่อน
      const formData = new FormData();
      formData.set('file', file);
      
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const uploadData = await uploadRes.json();

      if (!uploadData.success) throw new Error('อัปโหลดรูปไม่สำเร็จ');

      // 2. อัปเดตข้อมูล Booking (บันทึก URL รูป และเปลี่ยนสถานะ)
      const updateRes = await fetch(`/api/bookings/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slipUrl: uploadData.url,
          paymentStatus: 'paid', // เปลี่ยนสถานะเป็น "แจ้งโอนแล้ว"
          status: 'confirmed'    // หรือจะยังเป็น pending รอแอดมินกดก็ได้ แล้วแต่ Flow
        })
      });

      if (updateRes.ok) {
        alert('✅ แจ้งโอนเงินเรียบร้อย! กรุณารอเจ้าหน้าที่ตรวจสอบ');
        router.push('/booking'); // กลับหน้าหลัก
      }

    } catch (error) {
      alert('เกิดข้อผิดพลาด');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!booking) return <div style={{textAlign:'center', marginTop:50}}>กำลังโหลด...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>💸 แจ้งชำระเงิน</h1>
        
        <div className={styles.infoBox}>
           <p><strong>ล็อค:</strong> {booking.lotId?.lotNumber} ({booking.lotId?.section})</p>
           <p><strong>ราคาต้องชำระ:</strong> <span className={styles.price}>{booking.lotId?.price} บาท</span></p>
           <p><strong>ผู้จอง:</strong> {booking.vendorName}</p>
        </div>

        <div className={styles.qrSection}>
           {/* ใส่รูป QR Code จริงๆ ของคุณที่นี่ */}
           <div className={styles.qrPlaceholder}>
             <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" alt="QR Code" width={150} />
             <p>ธนาคารกสิกรไทย</p>
             <p>เลขที่บัญชี: 123-4-56789-0</p>
             <p>ชื่อบัญชี: ตลาดคนเดินศรีสะเกษ</p>
           </div>
        </div>

        <div className={styles.uploadSection}>
           <label className={styles.fileLabel}>
              {preview ? 'เปลี่ยนรูปสลิป' : '📷 แนบหลักฐานการโอนเงิน'}
              <input type="file" accept="image/*" onChange={handleFileChange} hidden />
           </label>

           {preview && (
             <div className={styles.previewBox}>
               <img src={preview} alt="Slip Preview" />
             </div>
           )}
        </div>

        <button 
          onClick={handleSubmit} 
          disabled={loading}
          className={styles.submitBtn}
        >
          {loading ? 'กำลังส่งข้อมูล...' : 'ยืนยันการโอนเงิน'}
        </button>
      </div>
    </div>
  );
}