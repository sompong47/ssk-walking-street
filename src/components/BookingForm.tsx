import { useState, useEffect } from 'react';
import type { ILot } from '@/lib/models/Lot';
import styles from './BookingForm.module.css';

interface BookingFormProps {
  selectedLot: ILot | null;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

export function BookingForm({ selectedLot, onSubmit, isLoading }: BookingFormProps) {
  // State เก็บข้อมูลฟอร์ม (ตามที่คุณต้องการ)
  const [formData, setFormData] = useState({
    vendorName: '',
    vendorPhone: '',
    vendorEmail: '',
    businessType: '',
    businessDescription: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState<any>({});

  // Reset ฟอร์มเมื่อเปลี่ยนล็อค
  useEffect(() => {
    if (selectedLot) {
        setErrors({});
    }
  }, [selectedLot]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: any = {};
    if (!formData.vendorName.trim()) newErrors.vendorName = 'กรุณาระบุชื่อผู้ค้า';
    if (!formData.vendorPhone.trim()) newErrors.vendorPhone = 'กรุณาระบุเบอร์โทร';
    if (!/^\d{10}$/.test(formData.vendorPhone.replace(/[^\d]/g, ''))) newErrors.vendorPhone = 'เบอร์โทรศัพท์ไม่ถูกต้อง (ต้องมี 10 หลัก)';
    if (!formData.vendorEmail.trim()) newErrors.vendorEmail = 'กรุณาระบุอีเมล';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.vendorEmail)) newErrors.vendorEmail = 'รูปแบบอีเมลไม่ถูกต้อง';
    if (!formData.businessType.trim()) newErrors.businessType = 'กรุณาระบุประเภทสินค้า';
    if (new Date(formData.startDate) >= new Date(formData.endDate)) newErrors.endDate = 'วันสิ้นสุดต้องหลังจากวันเริ่มต้น';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // ป้องกัน Refresh หน้า
    if (!selectedLot) return alert('กรุณาเลือกล็อคก่อน');
    if (!validate()) return;
    
    onSubmit(formData);
  };

  return (
    <div className={styles.card}>
      <h3 className={styles.header}>
        {selectedLot ? `🛒 จองล็อค #${selectedLot.lotNumber}` : '👈 กรุณาเลือกล็อค'}
      </h3>

      {selectedLot && (
        <div className={styles.lotInfo}>
          <div className={styles.infoRow}>
            <strong>หมายเลข:</strong> <span>{selectedLot.lotNumber}</span>
          </div>
          <div className={styles.infoRow}>
             <strong>ขนาด:</strong> <span>{selectedLot.size}</span>
          </div>
          <div className={styles.infoRow}>
             <strong>ราคา:</strong> <span className={styles.price}>{selectedLot.price} บาท/เดือน</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* กลุ่มข้อมูลผู้จอง */}
        <div className={styles.sectionTitle}>ข้อมูลผู้ค้า</div>
        <div className={styles.formGroup}>
            <label>ชื่อ-นามสกุล / ชื่อร้าน</label>
            <input
                name="vendorName"
                value={formData.vendorName}
                onChange={handleChange}
                placeholder="ระบุชื่อร้านค้า"
                className={errors.vendorName ? styles.inputError : ''}
            />
            {errors.vendorName && <span className={styles.errorMsg}>{errors.vendorName}</span>}
        </div>

        <div className={styles.row}>
            <div className={styles.formGroup}>
                <label>เบอร์โทรศัพท์</label>
                <input
                    name="vendorPhone"
                    value={formData.vendorPhone}
                    onChange={handleChange}
                    placeholder="08xxxxxxxx"
                    maxLength={10}
                    className={errors.vendorPhone ? styles.inputError : ''}
                />
                {errors.vendorPhone && <span className={styles.errorMsg}>{errors.vendorPhone}</span>}
            </div>
            <div className={styles.formGroup}>
                <label>อีเมล</label>
                <input
                    name="vendorEmail"
                    value={formData.vendorEmail}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className={errors.vendorEmail ? styles.inputError : ''}
                />
                 {errors.vendorEmail && <span className={styles.errorMsg}>{errors.vendorEmail}</span>}
            </div>
        </div>

        {/* กลุ่มข้อมูลสินค้า */}
        <div className={styles.sectionTitle}>รายละเอียดการขาย</div>
        <div className={styles.formGroup}>
            <label>ประเภทสินค้า</label>
            <input
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                placeholder="เช่น อาหาร, เสื้อผ้า"
                className={errors.businessType ? styles.inputError : ''}
            />
            {errors.businessType && <span className={styles.errorMsg}>{errors.businessType}</span>}
        </div>

        <div className={styles.formGroup}>
            <label>รายละเอียดเพิ่มเติม (ถ้ามี)</label>
            <textarea
                name="businessDescription"
                value={formData.businessDescription}
                onChange={handleChange}
                rows={3}
            />
        </div>

        {/* กลุ่มวันเวลา */}
        <div className={styles.row}>
            <div className={styles.formGroup}>
                <label>วันเริ่มขาย</label>
                <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
            </div>
            <div className={styles.formGroup}>
                <label>ถึงวันที่</label>
                <input 
                    type="date" 
                    name="endDate" 
                    value={formData.endDate} 
                    onChange={handleChange} 
                    className={errors.endDate ? styles.inputError : ''}
                />
                {errors.endDate && <span className={styles.errorMsg}>{errors.endDate}</span>}
            </div>
        </div>

        <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={!selectedLot || isLoading}
        >
            {isLoading ? '⏳ กำลังบันทึก...' : '✅ ยืนยันการจอง'}
        </button>
      </form>
    </div>
  );
}