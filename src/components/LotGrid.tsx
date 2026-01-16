import { ILot } from '@/lib/models/Lot';
import styles from './LotGrid.module.css';

interface LotGridProps {
  lots: ILot[];
  selectedLot: ILot | null;
  onSelectLot: (lot: ILot) => void;
  isSystemOpen: boolean;
  selectedDay: 'saturday' | 'sunday';
}

export const LotGrid = ({ lots, selectedLot, onSelectLot, isSystemOpen, selectedDay }: LotGridProps) => {
  
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
    const isReserved = lot.status === 'reserved';
    const isSelected = selectedLot?._id === lot._id;
    let statusClass = styles.available; 
    if (isReserved) statusClass = styles.reserved;
    if (isSelected) statusClass = styles.selected;

    return (
      <div 
        key={lot._id}
        className={`${styles.lotBox} ${statusClass}`}
        onClick={() => !isReserved && isSystemOpen && onSelectLot(lot)}
      >
        <span className={styles.lotNumber}>{lot.lotNumber}</span>
        {/* เพิ่มราคาเล็กๆ ไว้ข้างล่างเลขล็อค */}
        {!isReserved && <span className={styles.lotPrice}>{lot.price}฿</span>}
        {isReserved && <span className={styles.lotStatus}>จองแล้ว</span>}
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
        
        {/* 4. ช่องว่างกลาง (ตัวแก้บั๊ก!) */}
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