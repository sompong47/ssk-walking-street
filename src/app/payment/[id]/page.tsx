'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './payment.module.css';

// กำหนด Type ข้อมูลที่จะรับมาจาก API
interface IBooking {
  _id: string;
  lotId: {
    lotNumber: string;
    section: string;
    price: number;
    size?: string;
  };
  vendorName: string;
  startDate: string;
  endDate: string;
  totalAmount?: number;
  status: string;
}

export default function PaymentPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [booking, setBooking] = useState<IBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // 1. ดึงข้อมูลการจองเมื่อเข้าหน้านี้
  useEffect(() => {
    // ใช้ params.id ที่ Next.js ส่งมาให้
    fetch(`/api/bookings/${params.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setBooking(data.data);
        } else {
          alert('ไม่พบข้อมูลการจอง');
          router.push('/');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [params.id, router]);

  // จัดการเมื่อเลือกไฟล์รูป
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  // กดยืนยันการโอน
  const handleConfirmPayment = async () => {
    if (!file) return alert('กรุณาแนบสลิปโอนเงิน');
    setUploading(true);

    try {
      // ตรงนี้จริงๆ ต้องอัปโหลดรูปไป Cloud ก่อน แต่เราจำลองโดยส่งสถานะไปก่อน
      const res = await fetch(`/api/bookings/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentStatus: 'paid', // แจ้งว่าจ่ายแล้ว รอแอดมินตรวจ
          // slipUrl: '...URL รูปภาพ...' 
        })
      });

      const data = await res.json();
      if (data.success) {
        alert('✅ แจ้งชำระเงินเรียบร้อย! กรุณารอเจ้าหน้าที่ตรวจสอบ');
        router.push('/'); // กลับหน้าหลัก หรือไปหน้าประวัติ
      } else {
        alert('เกิดข้อผิดพลาด: ' + data.error);
      }
    } catch (error) {
      alert('เชื่อมต่อ Server ไม่ได้');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className={styles.container}>กำลังโหลดข้อมูล...</div>;
  if (!booking) return null;

  // Helper: แปลงวันที่ให้สวยๆ (เช่น 20 ม.ค. 67)
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      day: 'numeric', month: 'short', year: '2-digit'
    });
  };

  // Helper: คำนวณราคา (ถ้าไม่มี totalAmount ใน DB ให้ใช้ราคาล็อคแทนชั่วคราว)
  const price = booking.totalAmount || booking.lotId.price;

  return (
    <div className={styles.container}>
      
      {/* ส่วนหัวข้อ */}
      <div className={styles.headerTitle}>
        <h1>💳 แจ้งชำระเงิน</h1>
        <p>รหัสการจอง: {booking._id.slice(-6).toUpperCase()}</p>
      </div>

      <div className={styles.contentWrapper}>
        
        {/* --- ฝั่งซ้าย: รายละเอียดการจอง (เพิ่มใหม่!) --- */}
        <div className={styles.summaryCard}>
            <div className={styles.cardHeader}>
                <h3>📋 รายละเอียดการจอง</h3>
            </div>
            <div className={styles.cardBody}>
                <div className={styles.detailRow}>
                    <span>ชื่อร้านค้า</span>
                    <strong>{booking.vendorName}</strong>
                </div>
                <div className={styles.detailRow}>
                    <span>ล็อคที่เลือก</span>
                    <strong className={styles.highlightLot}>ล็อค {booking.lotId.lotNumber}</strong>
                </div>
                <div className={styles.detailRow}>
                    <span>โซน</span>
                    <span>{booking.lotId.section}</span>
                </div>
                
                <div className={styles.divider}></div>
                
                <div className={styles.detailRow}>
                    <span>วันที่เริ่มขาย</span>
                    <span>{formatDate(booking.startDate)}</span>
                </div>
                <div className={styles.detailRow}>
                    <span>ถึงวันที่</span>
                    <span>{formatDate(booking.endDate)}</span>
                </div>
                
                <div className={styles.totalSection}>
                    <span>ยอดชำระทั้งหมด</span>
                    <span className={styles.totalPrice}>{price.toLocaleString()} บาท</span>
                </div>
            </div>
        </div>

        {/* --- ฝั่งขวา: สแกนจ่าย --- */}
        <div className={styles.paymentCard}>
          <div className={styles.qrSection}>
             {/* ใส่รูป QR Code ของจริงของคุณตรงนี้ */}
             <img 
                src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" 
                alt="QR Code" 
                className={styles.qrImage}
             />
             <p className={styles.scanText}>สแกน QR Code เพื่อชำระเงิน</p>
          </div>

          <div className={styles.bankInfo}>
             <p>🏦 <strong>ธนาคารกสิกรไทย</strong></p>
             <p>ชื่อบัญชี: <strong>ตลาดนัดคนเดิน (บริษัท)</strong></p>
             <p className={styles.accNumber}>012-3-45678-9</p>
          </div>

          <div className={styles.uploadSection}>
            <label className={styles.fileLabel}>
              <input type="file" accept="image/*" onChange={handleFileChange} hidden />
              {file ? '✅ เลือกไฟล์แล้ว' : '📸 กดเพื่อแนบสลิปโอนเงิน'}
            </label>

            {previewUrl && (
              <div className={styles.previewBox}>
                <img src={previewUrl} alt="Slip Preview" />
                <p>{file?.name}</p>
              </div>
            )}
          </div>

          <button 
            className={styles.submitBtn} 
            onClick={handleConfirmPayment}
            disabled={uploading || !file}
          >
            {uploading ? '⏳ กำลังส่งข้อมูล...' : 'ยืนยันการแจ้งโอน'}
          </button>
        </div>
      </div>
      
      <button className={styles.backBtn} onClick={() => router.back()}>← กลับไปแก้ไข</button>
    </div>
  );
}