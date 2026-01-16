'use client';

import { useState, useEffect } from 'react';
import styles from './report.module.css';

interface Booking {
  _id: string;
  lotId?: {
    lotNumber: string;
    section: string;
    price: number;
  };
  vendorName: string;
  businessType: string;
  vendorPhone: string;
  status: string;
  createdAt: string;
}

export default function AdminReportPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('/api/bookings?status=confirmed')
      .then(res => res.json())
      .then(data => {
        if(data.success && Array.isArray(data.data)) {
          const sorted = data.data.sort((a: any, b: any) => {
             const lotA = a.lotId?.lotNumber || '';
             const lotB = b.lotId?.lotNumber || '';
             return lotA.localeCompare(lotB, undefined, {numeric: true});
          });
          setBookings(sorted);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('th-TH', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    // ✅ เพิ่ม id="print-section" ตรงนี้ เพื่อให้ CSS รู้ว่าจะปริ้นท์แค่กล่องนี้
    <div className={styles.container} id="print-section">
      
      {/* 🔥 CSS สูตรเด็ด: ซ่อนทุกอย่างยกเว้น id="print-section" */}
      <style jsx global>{`
        @media print {
          /* 1. ซ่อนทุกอย่างบนหน้าเว็บ */
          body * {
            visibility: hidden;
          }

          /* 2. สั่งให้เฉพาะกล่อง Report ของเรามองเห็นได้ */
          #print-section, #print-section * {
            visibility: visible;
          }

          /* 3. ดึงกล่อง Report มาแปะทับที่มุมซ้ายบนสุดของกระดาษ */
          #print-section {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
            background: white;
          }

          /* ซ่อนเลขหน้าและวันที่ที่ Browser แถมมา (ถ้าทำได้) */
          @page {
            size: auto;
            margin: 5mm;
          }
        }
      `}</style>

      {/* ส่วนหัว */}
      <div className={styles.header}>
        <div className={styles.title}>
            <h1>📑 ใบรายชื่อผู้ค้าตลาดถนนคนเดิน</h1>
            <p>ประจำวันที่: {currentDate}</p>
        </div>
        
        <button onClick={handlePrint} className={styles.printBtn}>
           🖨️ พิมพ์ใบรายชื่อ
        </button>
      </div>

      <div className={styles.stats}>
         รวมร้านค้าทั้งหมด: <strong>{bookings.length}</strong> ร้าน
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th style={{width: '10%'}}>ล็อค</th>
            <th style={{width: '25%'}}>ชื่อร้าน/ผู้จอง</th>
            <th style={{width: '20%'}}>สินค้า</th>
            <th style={{width: '15%'}}>เบอร์โทร</th>
            <th style={{width: '10%'}}>ราคา</th>
            <th style={{width: '20%'}}>หมายเหตุ/เซ็นชื่อ</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
             <tr><td colSpan={6} style={{textAlign: 'center', padding: '20px'}}>กำลังโหลด...</td></tr>
          ) : bookings.length === 0 ? (
             <tr><td colSpan={6} style={{textAlign: 'center', padding: '20px'}}>ไม่มีรายการจองที่ยืนยันแล้วในวันนี้</td></tr>
          ) : (
            bookings.map((b) => (
              <tr key={b._id}>
                <td className={styles.lotCell}>{b.lotId?.lotNumber || '-'}</td>
                <td>{b.vendorName}</td>
                <td>{b.businessType}</td>
                <td>{b.vendorPhone}</td>
                <td>{b.lotId?.price?.toLocaleString()}.-</td>
                <td className={styles.checkCell}></td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className={styles.footer}>
        <p>ผู้ตรวจสอบ: __________________________</p>
        <p>เวลา: __________________</p>
      </div>
    </div>
  );
}