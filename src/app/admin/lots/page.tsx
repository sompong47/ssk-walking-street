'use client';

import { useState, useEffect } from 'react';
import styles from './lots.module.css';

interface Lot {
  _id: string;
  lotNumber: string;
  section: string;
  price: number;
  status: 'available' | 'reserved' | 'maintenance';
}

export default function AdminLotsPage() {
  const [lots, setLots] = useState<Lot[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State สำหรับ Modal แก้ไข
  const [selectedLot, setSelectedLot] = useState<Lot | null>(null);
  const [editForm, setEditForm] = useState({ price: 0, status: '' });

  useEffect(() => {
    fetchLots();
  }, []);

  const fetchLots = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/lots?limit=1000');
      const data = await res.json();
      if (data.success && Array.isArray(data.data?.lots)) {
        setLots(data.data.lots);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // เปิด Modal เมื่อคลิกที่ล็อค
  const handleLotClick = (lot: Lot) => {
    setSelectedLot(lot);
    setEditForm({ price: lot.price, status: lot.status });
  };

  // บันทึกการแก้ไข
  const saveEdit = async () => {
    if (!selectedLot) return;
    try {
      const res = await fetch(`/api/lots/${selectedLot._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });

      if (res.ok) {
        // อัปเดตข้อมูลในหน้าจอทันทีโดยไม่ต้องโหลดใหม่ (Optimistic Update)
        setLots(prev => prev.map(l => 
          l._id === selectedLot._id 
            ? { ...l, price: editForm.price, status: editForm.status as any } 
            : l
        ));
        setSelectedLot(null); // ปิด Modal
      } else {
        alert('บันทึกไม่สำเร็จ');
      }
    } catch (error) {
      alert('เชื่อมต่อล้มเหลว');
    }
  };

  // แยกข้อมูลตามแถว (เพื่อวาดแผนที่)
  const rowA = lots.filter(l => l.section === 'rowA');
  const rowB = lots.filter(l => l.section === 'rowB');
  const rowC = lots.filter(l => l.section === 'rowC');
  const rowD = lots.filter(l => l.section === 'rowD');

  // ฟังก์ชันวาดกล่องล็อค
  const renderLot = (lot: Lot) => (
    <div 
      key={lot._id} 
      className={`${styles.lotBox} ${styles[lot.status]}`}
      onClick={() => handleLotClick(lot)}
    >
      <span className={styles.lotNum}>{lot.lotNumber}</span>
      <span className={styles.lotPrice}>{lot.price}฿</span>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
            <h1>จัดการพื้นที่ตลาด</h1>
            <p style={{fontSize: '14px', color: '#666'}}>คลิกที่ล็อคเพื่อแก้ไขราคา หรือปิดปรับปรุง</p>
        </div>
        <div className={styles.legend}>
            <span className={styles.dotGreen}></span> ว่าง
            <span className={styles.dotRed}></span> จองแล้ว
            <span className={styles.dotGray}></span> ปิดปรับปรุง
        </div>
      </div>

      {loading ? <p>กำลังโหลดแผนที่...</p> : (
        <div className={styles.mapWrapper}>
            <div className={styles.roadLabel}>⬇️ ทางเข้า ⬇️</div>
            
            <div className={styles.gridMap}>
                {/* แถว A */}
                <div className={styles.column}>{rowA.map(renderLot)}</div>
                
                {/* ถนนซ้าย */}
                <div className={styles.road}></div>
                
                {/* แถว B */}
                <div className={styles.column}>{rowB.map(renderLot)}</div>
                
                {/* ช่องว่างกลาง */}
                <div className={styles.gap}></div>
                
                {/* แถว C */}
                <div className={styles.column}>{rowC.map(renderLot)}</div>
                
                {/* ถนนขวา */}
                <div className={styles.road}></div>
                
                {/* แถว D */}
                <div className={styles.column}>{rowD.map(renderLot)}</div>
            </div>
        </div>
      )}

      {/* Modal แก้ไข (เด้งขึ้นมาเมื่อคลิก) */}
      {selectedLot && (
        <div className={styles.modalOverlay} onClick={() => setSelectedLot(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h3>แก้ไขล็อค {selectedLot.lotNumber}</h3>
            
            <div className={styles.formGroup}>
                <label>ราคา (บาท)</label>
                <input 
                    type="number" 
                    value={editForm.price}
                    onChange={e => setEditForm({...editForm, price: Number(e.target.value)})}
                    className={styles.input}
                />
            </div>

            <div className={styles.formGroup}>
                <label>สถานะ</label>
                <div className={styles.statusOptions}>
                    <button 
                        className={`${styles.statusBtn} ${editForm.status === 'available' ? styles.activeGreen : ''}`}
                        onClick={() => setEditForm({...editForm, status: 'available'})}
                    >
                        ✅ ว่าง (เปิดขาย)
                    </button>
                    <button 
                        className={`${styles.statusBtn} ${editForm.status === 'maintenance' ? styles.activeGray : ''}`}
                        onClick={() => setEditForm({...editForm, status: 'maintenance'})}
                    >
                        🔧 ปิดปรับปรุง
                    </button>
                    <button 
                        className={`${styles.statusBtn} ${editForm.status === 'reserved' ? styles.activeRed : ''}`}
                        onClick={() => setEditForm({...editForm, status: 'reserved'})}
                    >
                        🔴 จองแล้ว
                    </button>
                </div>
            </div>

            <div className={styles.modalActions}>
                <button onClick={() => setSelectedLot(null)} className={styles.cancelBtn}>ยกเลิก</button>
                <button onClick={saveEdit} className={styles.saveBtn}>บันทึกการเปลี่ยนแปลง</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}