'use client';

import { useState } from 'react';
import styles from './contact.module.css';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setTimeout(() => setSubmitted(false), 3000);
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาด กรุณาลองใหม่');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>ติดต่อเรา</h1>
        <p>มีคำถามหรือต้องการความช่วยเหลือ? เราพร้อมให้บริการ</p>
      </div>

      <div className={styles.content}>
        <div className={styles.formSection}>
          <h2>ส่งข้อความถึงเรา</h2>

          {submitted && (
            <div className={styles.successMessage}>
              ✓ ขอบคุณที่ติดต่อเรา เราจะตอบกลับในเร็วที่สุด
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label>ชื่อ</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="กรุณากรอกชื่อของคุณ"
              />
            </div>

            <div className={styles.formGroup}>
              <label>อีเมล</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="กรุณากรอกอีเมลของคุณ"
              />
            </div>

            <div className={styles.formGroup}>
              <label>เบอร์โทรศัพท์</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="กรุณากรอกเบอร์โทร"
              />
            </div>

            <div className={styles.formGroup}>
              <label>หัวเรื่อง</label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              >
                <option value="">-- เลือกหัวเรื่อง --</option>
                <option value="booking">ปัญหาการจอง</option>
                <option value="payment">ปัญหาการชำระเงิน</option>
                <option value="general">คำถามทั่วไป</option>
                <option value="complaint">ร้องเรียน</option>
                <option value="other">อื่นๆ</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>ข้อความ</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="กรุณากรอกข้อความของคุณ"
                rows={6}
              ></textarea>
            </div>

            <button 
              type="submit" 
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? 'กำลังส่ง...' : 'ส่งข้อความ'}
            </button>
          </form>
        </div>

        <div className={styles.infoSection}>
          <h2>ข้อมูลติดต่อ</h2>

          <div className={styles.infoCard}>
            <h3>📞 โทรศัพท์</h3>
            <p>087-123-4567</p>
            <small>วันจันทร์ - ศุกร์ 9:00 - 18:00</small>
          </div>

          <div className={styles.infoCard}>
            <h3>📧 อีเมล</h3>
            <p>info@ssk-walking-street.com</p>
            <small>เราจะตอบกลับภายใน 24 ชั่วโมง</small>
          </div>

          <div className={styles.infoCard}>
            <h3>📍 สถานที่ตั้ง</h3>
            <p>ถนนเดินศรีสะเกษ</p>
            <p>อำเภอศรีสะเกษ จังหวัดศรีสะเกษ 33000</p>
            <small>เปิดวันจันทร์ - อาทิตย์ 6:00 - 20:00</small>
          </div>

          <div className={styles.infoCard}>
            <h3>🕐 เวลาทำการ</h3>
            <p>จันทร์ - ศุกร์: 9:00 - 18:00</p>
            <p>เสาร์ - อาทิตย์: 10:00 - 17:00</p>
            <p>ปิดวันธรรมชาติ</p>
          </div>

          <div className={styles.socialLinks}>
            <h3>ติดตามเรา</h3>
            <div className={styles.links}>
              <a href="#" className={styles.socialLink}>Facebook</a>
              <a href="#" className={styles.socialLink}>Line</a>
              <a href="#" className={styles.socialLink}>Instagram</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
