'use client';

import React from 'react';
import styles from './lotGrid.module.css';

// Interface นี้ต้องตรงกับ Model ของคุณ
interface ILot {
  _id: string;
  lotNumber: string;
  status: 'available' | 'reserved' | 'booked';
  price: number;
  section?: string; 
}

interface LotGridProps {
  lots: ILot[];
  selectedLot: ILot | null;
  onSelectLot: (lot: ILot) => void;
  isSystemOpen: boolean; // รับค่าว่าอยู่ในเวลาจองหรือไม่
}

export const LotGrid = ({ lots, selectedLot, onSelectLot, isSystemOpen }: LotGridProps) => {
  
  // แบ่งข้อมูลเป็น 2 ฝั่ง (สมมติ: ครึ่งแรก = ฝั่งซ้าย, ครึ่งหลัง = ฝั่งขวา)
  const halfIndex = Math.ceil(lots.length / 2);
  const leftLaneLots = lots.slice(0, halfIndex);
  const rightLaneLots = lots.slice(halfIndex);

  // ฟังก์ชันเรนเดอร์แต่ละกล่อง
  const renderLotBtn = (lot: ILot) => {
    const isSelected = selectedLot?._id === lot._id;
    const isAvailable = lot.status === 'available';
    
    // เงื่อนไขการกด: ต้องว่าง + ระบบเปิดอยู่
    const canClick = isAvailable && isSystemOpen;

    return (
      <button
        key={lot._id}
        type="button"
        onClick={() => canClick && onSelectLot(lot)}
        disabled={!canClick}
        className={`
          ${styles.lotButton}
          ${styles[lot.status]} 
          ${isSelected ? styles.selected : ''}
        `}
        title={`ล็อค ${lot.lotNumber} : ${lot.price} บาท`}
      >
        <span className={styles.lotNumber}>{lot.lotNumber}</span>
        <span className={styles.lotPrice}>{lot.price}฿</span>
      </button>
    );
  };

  return (
    <div className={styles.container}>
      {/* ส่วนหัวถนน */}
      <div style={{ textAlign: 'center', marginBottom: '10px', color: '#888' }}>
        ⬇ ทางเข้าตลาด (จุดเริ่มต้น) ⬇
      </div>

      <div className={styles.roadContainer}>
        {/* เลนซ้าย */}
        <div className={styles.lane}>
          <div className={styles.laneHeader}>ฝั่งซ้าย</div>
          {leftLaneLots.map(renderLotBtn)}
        </div>

        {/* เลนขวา */}
        <div className={styles.lane}>
          <div className={styles.laneHeader}>ฝั่งขวา</div>
          {rightLaneLots.map(renderLotBtn)}
        </div>
      </div>
      
       {/* ส่วนท้ายถนน */}
       <div style={{ textAlign: 'center', marginTop: '10px', color: '#888' }}>
        ⬆ สุดระยะถนนคนเดิน (~450m) ⬆
      </div>
    </div>
  );
};