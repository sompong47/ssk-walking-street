'use client';

import React, { useState } from 'react';
import type { ILot } from '@/lib/models/Lot';

const colors = {
  primary: '#2c3e50',
  secondary: '#3498db',
  success: '#27ae60',
  warning: '#f39c12',
  danger: '#e74c3c',
  light: '#ecf0f1',
  dark: '#2c3e50',
};

interface BookingFormProps {
  selectedLot: ILot | null;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

export function BookingForm({ selectedLot, onSubmit, isLoading }: BookingFormProps) {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: any = {};
    
    if (!formData.vendorName.trim()) newErrors.vendorName = 'ต้องระบุชื่อผู้ค้า';
    if (!formData.vendorPhone.trim()) newErrors.vendorPhone = 'ต้องระบุเบอร์โทร';
    if (!/^\d{10}$/.test(formData.vendorPhone.replace(/[^\d]/g, ''))) {
      newErrors.vendorPhone = 'เบอร์โทรไม่ถูกต้อง';
    }
    if (!formData.vendorEmail.trim()) newErrors.vendorEmail = 'ต้องระบุอีเมล';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.vendorEmail)) {
      newErrors.vendorEmail = 'อีเมลไม่ถูกต้อง';
    }
    if (!formData.businessType.trim()) newErrors.businessType = 'ต้องระบุประเภทสินค้า';
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = 'วันสิ้นสุดต้องหลังจากวันเริ่มต้น';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!selectedLot) {
      alert('กรุณาเลือกล็อค');
      return;
    }
    
    if (!validate()) {
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <div style={{
      backgroundColor: '#fff',
      border: `2px solid ${colors.secondary}`,
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    }}>
      <h3 style={{ marginTop: 0, color: colors.primary, marginBottom: '15px' }}>
        {selectedLot ? `จองล็อค #${selectedLot.lotNumber}` : 'เลือกล็อคก่อน'}
      </h3>

      {selectedLot && (
        <div style={{
          backgroundColor: colors.light,
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '15px',
          fontSize: '13px',
          borderLeft: `4px solid ${colors.secondary}`,
        }}>
          <div><strong>ล็อค #{selectedLot.lotNumber}</strong></div>
          <div>ขนาด: {selectedLot.size}m²</div>
          <div>ราคา: {selectedLot.price} บาท/เดือน</div>
        </div>
      )}

      {['vendorName', 'vendorPhone', 'vendorEmail', 'businessType', 'businessDescription'].map((field) => (
        <div key={field} style={{ marginBottom: '12px' }}>
          <label style={{
            display: 'block',
            marginBottom: '4px',
            color: colors.primary,
            fontWeight: 'bold',
            fontSize: '13px',
          }}>
            {field === 'vendorName' && 'ชื่อผู้ค้า'}
            {field === 'vendorPhone' && 'เบอร์โทร'}
            {field === 'vendorEmail' && 'อีเมล'}
            {field === 'businessType' && 'ประเภทสินค้า'}
            {field === 'businessDescription' && 'คำอธิบายธุรกิจ'}
          </label>
          <input
            type={field === 'vendorEmail' ? 'email' : 'text'}
            name={field}
            value={(formData as any)[field]}
            onChange={handleChange}
            placeholder={field === 'businessType' ? 'เช่น เสื้อผ้า, อาหาร, ของใช้' : ''}
            style={{
              width: '100%',
              padding: '10px',
              border: `1px solid ${errors[field] ? colors.danger : colors.light}`,
              borderRadius: '4px',
              fontSize: '13px',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
              backgroundColor: errors[field] ? 'rgba(231, 76, 60, 0.05)' : '#fff',
            }}
          />
          {errors[field] && (
            <div style={{ color: colors.danger, fontSize: '12px', marginTop: '4px' }}>
              {errors[field]}
            </div>
          )}
        </div>
      ))}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '15px' }}>
        {['startDate', 'endDate'].map((field) => (
          <div key={field}>
            <label style={{
              display: 'block',
              marginBottom: '4px',
              color: colors.primary,
              fontWeight: 'bold',
              fontSize: '13px',
            }}>
              {field === 'startDate' ? 'วันเริ่มจอง' : 'วันสิ้นสุด'}
            </label>
            <input
              type="date"
              name={field}
              value={(formData as any)[field]}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px',
                border: `1px solid ${errors[field] ? colors.danger : colors.light}`,
                borderRadius: '4px',
                fontSize: '13px',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
              }}
            />
            {errors[field] && (
              <div style={{ color: colors.danger, fontSize: '12px', marginTop: '4px' }}>
                {errors[field]}
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!selectedLot || isLoading}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: selectedLot ? colors.secondary : colors.light,
          color: selectedLot ? '#fff' : colors.dark,
          border: 'none',
          borderRadius: '4px',
          fontSize: '15px',
          fontWeight: 'bold',
          cursor: selectedLot && !isLoading ? 'pointer' : 'not-allowed',
          opacity: selectedLot && !isLoading ? 1 : 0.6,
          transition: 'all 0.3s ease',
        }}
      >
        {isLoading ? 'กำลังประมวลผล...' : 'จองล็อค'}
      </button>
    </div>
  );
}