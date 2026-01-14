'use client';

import { useState } from 'react';
import styles from './contact.module.css';

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'กรุณากรอกชื่อ';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'กรุณากรอกอีเมล';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'รูปแบบอีเมลไม่ถูกต้อง';
    }

    if (formData.phone && !/^[0-9-+() ]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'รูปแบบเบอร์โทรไม่ถูกต้อง';
    }

    if (!formData.subject) {
      newErrors.subject = 'กรุณาเลือกหัวเรื่อง';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'กรุณากรอกข้อความ';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'ข้อความต้องมีอย่างน้อย 10 ตัวอักษร';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

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
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: '📞',
      title: 'โทรศัพท์',
      items: ['087-123-4567', '044-123-456'],
      subtitle: 'วันจันทร์ - ศุกร์ 9:00 - 18:00',
      color: '#667eea',
    },
    {
      icon: '📧',
      title: 'อีเมล',
      items: ['info@ssk-walking-street.com', 'support@ssk-walking-street.com'],
      subtitle: 'เราจะตอบกลับภายใน 24 ชั่วโมง',
      color: '#f093fb',
    },
    {
      icon: '📍',
      title: 'สถานที่ตั้ง',
      items: ['ถนนเดินศรีสะเกษ', 'อำเภอเมือง จ.ศรีสะเกษ 33000'],
      subtitle: 'เปิดทุกวัน 6:00 - 20:00 น.',
      color: '#4facfe',
    },
    {
      icon: '🕐',
      title: 'เวลาทำการ',
      items: ['จันทร์ - ศุกร์: 9:00 - 18:00', 'เสาร์ - อาทิตย์: 10:00 - 17:00'],
      subtitle: 'ปิดวันหยุดนักขัตฤกษ์',
      color: '#43e97b',
    },
  ];

  const faqs = [
    {
      question: 'ขั้นตอนการจองล็อคเป็นอย่างไร?',
      answer: 'เลือกล็อคที่ต้องการ > กรอกข้อมูล > ยืนยันการจอง > รอการติดต่อกลับ',
    },
    {
      question: 'สามารถจ่ายค่าเช่าเป็นรายเดือนได้หรือไม่?',
      answer: 'ได้ครับ เราเปิดให้จ่ายเป็นรายเดือน รายไตรมาส หรือรายปี',
    },
    {
      question: 'มีค่าประกันหรือไม่?',
      answer: 'มีค่าประกัน 1 เดือน คืนเมื่อสิ้นสุดสัญญาหากไม่มีความเสียหาย',
    },
  ];

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>ติดต่อเรา</h1>
          <p className={styles.heroSubtitle}>
            มีคำถามหรือต้องการความช่วยเหลือ? เรายินดีให้บริการ
          </p>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNumber}>24/7</span>
              <span className={styles.heroStatLabel}>ให้บริการ</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNumber}>100+</span>
              <span className={styles.heroStatLabel}>ล็อคให้เช่า</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNumber}>500+</span>
              <span className={styles.heroStatLabel}>ลูกค้าพึงพอใจ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info Cards */}
      <div className={styles.infoCards}>
        {contactInfo.map((info, index) => (
          <div key={index} className={styles.infoCard}>
            <div
              className={styles.infoCardIcon}
              style={{ background: `linear-gradient(135deg, ${info.color} 0%, ${info.color}dd 100%)` }}
            >
              <span>{info.icon}</span>
            </div>
            <h3 className={styles.infoCardTitle}>{info.title}</h3>
            {info.items.map((item, idx) => (
              <p key={idx} className={styles.infoCardItem}>
                {item}
              </p>
            ))}
            <small className={styles.infoCardSubtitle}>{info.subtitle}</small>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className={styles.content}>
        {/* Contact Form */}
        <div className={styles.formSection}>
          <div className={styles.formHeader}>
            <h2>ส่งข้อความถึงเรา</h2>
            <p>กรอกแบบฟอร์มด้านล่าง เราจะติดต่อกลับโดยเร็วที่สุด</p>
          </div>

          {submitted && (
            <div className={styles.successMessage}>
              <svg className={styles.successIcon} width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div>
                <strong>ส่งข้อความสำเร็จ!</strong>
                <p>ขอบคุณที่ติดต่อเรา เราจะตอบกลับในเร็วที่สุด</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>
                  ชื่อ-นามสกุล <span className={styles.required}>*</span>
                </label>
                <div className={styles.inputWrapper}>
                  <svg className={styles.inputIcon} width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 10a4 4 0 100-8 4 4 0 000 8zm0 2c-4.42 0-8 1.79-8 4v2h16v-2c0-2.21-3.58-4-8-4z" />
                  </svg>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="กรอกชื่อ-นามสกุล"
                    className={errors.name ? styles.inputError : ''}
                  />
                </div>
                {errors.name && <span className={styles.errorText}>{errors.name}</span>}
              </div>

              <div className={styles.formGroup}>
                <label>
                  อีเมล <span className={styles.required}>*</span>
                </label>
                <div className={styles.inputWrapper}>
                  <svg className={styles.inputIcon} width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.5 5A1.5 1.5 0 014 3.5h12A1.5 1.5 0 0117.5 5v10a1.5 1.5 0 01-1.5 1.5H4A1.5 1.5 0 012.5 15V5zm1 1.5v8h13v-8l-6.5 4-6.5-4z" />
                  </svg>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    className={errors.email ? styles.inputError : ''}
                  />
                </div>
                {errors.email && <span className={styles.errorText}>{errors.email}</span>}
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>เบอร์โทรศัพท์</label>
                <div className={styles.inputWrapper}>
                  <svg className={styles.inputIcon} width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.5a1 1 0 011 .8l.8 4A1 1 0 016.5 8H5a11 11 0 0011 11v-1.5a1 1 0 011.2-.8l4 .8a1 1 0 01.8 1V17a2 2 0 01-2 2h-1C8.3 19 1 11.7 1 3V2a1 1 0 011-1z" />
                  </svg>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="08x-xxx-xxxx"
                    className={errors.phone ? styles.inputError : ''}
                  />
                </div>
                {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
              </div>

              <div className={styles.formGroup}>
                <label>
                  หัวเรื่อง <span className={styles.required}>*</span>
                </label>
                <div className={styles.inputWrapper}>
                  <svg className={styles.inputIcon} width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z" />
                  </svg>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={errors.subject ? styles.inputError : ''}
                  >
                    <option value="">-- เลือกหัวเรื่อง --</option>
                    <option value="booking">📝 สอบถามเกี่ยวกับการจอง</option>
                    <option value="payment">💳 ปัญหาการชำระเงิน</option>
                    <option value="general">💬 คำถามทั่วไป</option>
                    <option value="complaint">⚠️ ร้องเรียน</option>
                    <option value="suggestion">💡 ข้อเสนอแนะ</option>
                    <option value="other">📌 อื่นๆ</option>
                  </select>
                </div>
                {errors.subject && <span className={styles.errorText}>{errors.subject}</span>}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>
                ข้อความ <span className={styles.required}>*</span>
              </label>
              <div className={styles.inputWrapper}>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="กรุณากรอกรายละเอียดข้อความของคุณ..."
                  rows={6}
                  className={errors.message ? styles.inputError : ''}
                />
              </div>
              {errors.message && <span className={styles.errorText}>{errors.message}</span>}
              <div className={styles.charCount}>
                {formData.message.length} / 1000 ตัวอักษร
              </div>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? (
                <>
                  <svg className={styles.spinner} width="20" height="20" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" />
                    <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                  </svg>
                  กำลังส่ง...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 5l8 5 8-5v10a1 1 0 01-1 1H3a1 1 0 01-1-1V5zm8 7L2 7v8h16V7l-8 5z" />
                  </svg>
                  ส่งข้อความ
                </>
              )}
            </button>
          </form>
        </div>

        {/* Sidebar Info */}
        <div className={styles.sidebar}>
          {/* Quick Links */}
          <div className={styles.sidebarCard}>
            <h3>ลิงก์ด่วน</h3>
            <div className={styles.quickLinks}>
              <a href="/" className={styles.quickLink}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 3.5L2 9v9h6v-6h4v6h6V9l-8-5.5z" />
                </svg>
                หน้าแรก
              </a>
              <a href="/booking" className={styles.quickLink}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 4h14v12H3V4zm2 2v8h10V6H5z" />
                </svg>
                จองล็อค
              </a>
              <a href="/my-bookings" className={styles.quickLink}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4 4h12v2H4V4zm0 4h12v8H4V8z" />
                </svg>
                การจองของฉัน
              </a>
            </div>
          </div>

          {/* FAQs */}
          <div className={styles.sidebarCard}>
            <h3>คำถามที่พบบ่อย</h3>
            <div className={styles.faqs}>
              {faqs.map((faq, index) => (
                <details key={index} className={styles.faqItem}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>

          {/* Social Media */}
          <div className={styles.sidebarCard}>
            <h3>ติดตามเรา</h3>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialLink} style={{ background: '#1877f2' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07" />
                </svg>
                Facebook
              </a>
              <a href="#" className={styles.socialLink} style={{ background: '#06c755' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                </svg>
                Line @SSK
              </a>
              <a href="#" className={styles.socialLink} style={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
                Instagram
              </a>
            </div>
          </div>

          {/* Map */}
          <div className={styles.mapCard}>
            <h3>แผนที่</h3>
            <div className={styles.mapPlaceholder}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"
                  fill="currentColor"
                />
              </svg>
              <p>ถนนเดินศรีสะเกษ</p>
              <button className={styles.mapBtn}>ดูแผนที่</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}