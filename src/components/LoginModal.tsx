'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from './LoginModal.module.css'; // เดี๋ยวสร้าง CSS ต่อ

export default function LoginModal() {
  const { showLoginModal, setShowLoginModal, login } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({ name: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);

  if (!showLoginModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegister) {
        // --- สมัครสมาชิก ---
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(formData)
        });
        const data = await res.json();
        if (data.success) {
            alert('สมัครสมาชิกสำเร็จ! กรุณาล็อกอิน');
            setIsRegister(false); // กลับไปหน้าล็อกอิน
        } else {
            alert(data.message);
        }
      } else {
        // --- ล็อกอิน ---
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ phone: formData.phone, password: formData.password })
        });
        const data = await res.json();
        if (data.success) {
            login(data.user || { name: 'Admin', phone: 'admin' }, data.role);
            if(data.role === 'admin') window.location.href = '/admin'; // ถ้าเป็นแอดมินไปหลังบ้าน
        } else {
            alert(data.message);
        }
      }
    } catch (err) {
      alert('เกิดข้อผิดพลาด');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={() => setShowLoginModal(false)}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={() => setShowLoginModal(false)}>×</button>
        
        <h2>{isRegister ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}</h2>
        <p>{isRegister ? 'กรอกข้อมูลเพื่อจองล็อคตลาด' : 'ยินดีต้อนรับกลับมา'}</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {isRegister && (
             <input 
                placeholder="ชื่อ-นามสกุล" 
                className={styles.input} 
                required 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
             />
          )}
          <input 
            placeholder="เบอร์โทรศัพท์" 
            className={styles.input} 
            required 
            value={formData.phone}
            onChange={e => setFormData({...formData, phone: e.target.value})}
          />
          <input 
            type="password" 
            placeholder="รหัสผ่าน" 
            className={styles.input} 
            required 
            value={formData.password}
            onChange={e => setFormData({...formData, password: e.target.value})}
          />

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'กำลังโหลด...' : (isRegister ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ')}
          </button>
        </form>

        <div className={styles.footer}>
            {isRegister ? 'มีบัญชีแล้ว?' : 'ยังไม่มีบัญชี?'}
            <span onClick={() => setIsRegister(!isRegister)}>
                {isRegister ? ' เข้าสู่ระบบเลย' : ' สมัครสมาชิกใหม่'}
            </span>
        </div>
      </div>
    </div>
  );
}