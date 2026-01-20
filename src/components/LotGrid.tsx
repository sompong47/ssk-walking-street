import { ILot } from '@/lib/models/Lot';
import styles from './LotGrid.module.css';
import { useAuth } from '@/context/AuthContext'; // 👈 1. นำเข้า useAuth

interface LotGridProps {
  lots: ILot[];
  selectedLot: ILot | null;
  onSelectLot: (lot: ILot) => void;
  isSystemOpen: boolean;
  selectedDay: 'saturday' | 'sunday';
}

export const LotGrid = ({ lots, selectedLot, onSelectLot, isSystemOpen, selectedDay }: LotGridProps) => {
  
  // 👈 2. ดึงค่า isLoggedIn และฟังก์ชันเปิด Modal มาใช้
  const { isLoggedIn, setShowLoginModal } = useAuth();

  const filteredLots = lots.filter(lot => {
    if (selectedDay === 'saturday') return lot.zoneType === 'standard';
    return true;
  });

  // แยกข้อมูล 4 แถว
  const rowALots = filteredLots.filter(l => l.section === 'rowA');
  const rowBLots = filteredLots.filter(l => l.section === 'rowB');
  const rowCLots = filteredLots.filter(l => l.section === 'rowC');
  const rowDLots = filteredLots.filter(l => l.section === 'rowD');

  const renderLotBox = (lot: ILot) => {
    // เช็คสถานะให้ครอบคลุม
    const isUnavailable = lot.status !== 'available'; 
    
    const isSelected = selectedLot?._id === lot._id;
    
    // กำหนด Class ตามสถานะ
    let statusClass = styles.available; 
    if (isUnavailable) statusClass = styles.reserved;
    if (isSelected) statusClass = styles.selected;

    // แสดงข้อความตามสถานะจริง
    const getStatusLabel = () => {
        if (lot.status === 'reserved') return 'จองแล้ว';
        if (lot.status === 'maintenance') return 'ปิด';
        return '';
    };

    return (
      <div 
        key={lot._id.toString()}
        className={`${styles.lotBox} ${statusClass}`}
        // 👈 3. แก้ไข onClick: เช็ค Login ก่อนจอง
        onClick={() => {
            // ต้องว่าง และ ระบบเปิดอยู่ ถึงจะกดได้
            if (!isUnavailable && isSystemOpen) {
                if (!isLoggedIn) {
                    // ถ้ายังไม่ล็อกอิน -> เปิด Popup
                    setShowLoginModal(true);
                } else {
                    // ถ้าล็อกอินแล้ว -> เลือกจองได้ตามปกติ
                    onSelectLot(lot);
                }
            }
        }}
      >
        <span className={styles.lotNumber}>{lot.lotNumber}</span>
        
        {/* ถ้าว่าง: แสดงราคา */}
        {!isUnavailable && <span className={styles.lotPrice}>{lot.price}฿</span>}
        
        {/* ถ้าไม่ว่าง: แสดงสถานะ */}
        {isUnavailable && (
            <span className={styles.lotStatus} style={{fontSize: '10px'}}>
                {getStatusLabel()}
            </span>
        )}
      </div>
    );
  };

  const Walkway = () => (
    <div className={styles.walkway}>
      <div className={styles.roadLine}></div>
    </div>
  );

  return (
    <div className={styles.mapWrapper}>
      <div className={styles.headerLabel}>⬇️ ทางเข้าตลาด (จุดเริ่มต้น) ⬇️</div>

      <div className={styles.mainGridContainer}>
        {/* 1. ร้าน A */}
        <div className={styles.stallColumn}>
            {rowALots.length > 0 ? rowALots.map(renderLotBox) : <div className={styles.empty}>ว่าง</div>}
        </div>
        
        {/* 2. ถนนซ้าย */}
        <Walkway />
        
        {/* 3. ร้าน B */}
        <div className={styles.stallColumn}>{rowBLots.map(renderLotBox)}</div>
        
        {/* 4. ช่องว่างกลาง */}
        <div className={styles.centerGap}></div>
        
        {/* 5. ร้าน C */}
        <div className={styles.stallColumn}>{rowCLots.map(renderLotBox)}</div>
        
        {/* 6. ถนนขวา */}
        <Walkway />
        
        {/* 7. ร้าน D */}
        <div className={styles.stallColumn}>{rowDLots.map(renderLotBox)}</div>
      </div>

      <div className={styles.footerLabel}>
        {selectedDay === 'saturday' ? '⛔ สุดระยะวันเสาร์' : '🏁 สุดระยะวันอาทิตย์'}
      </div>
    </div>
  );
};