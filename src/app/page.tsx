'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Stats } from '@/components/Stats';
import styles from './home.module.css';
import { Smartphone, Zap, Lock, DollarSign, Clock, MapPin, FileText, CheckSquare, CreditCard, Phone } from 'lucide-react';

interface DashboardStats {
  totalLots: number;
  availableLots: number;
  bookedLots: number;
  reservedLots: number;
  totalRevenue: number;
  totalBookings: number;
  completedPayments: number;
  pendingPayments: number;
}

export default function Home() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard/stats');
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>ตลาดถนนคนเดินศรีสะเกษ</h1>
          <p className={styles.heroSubtitle}>
            ระบบจองล็อคพื้นที่สะดวก รวดเร็ว และน่าเชื่อถือ
          </p>
          <div className={styles.heroButtons}>
            <Link href="/booking" className={styles.primaryBtn}>
              ยืนยัน จองล็อค
            </Link>
            <Link href="/terms" className={styles.secondaryBtn}>
              ดูข้อมูลเพิ่มเติม
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {!loading && stats && (
        <section className={styles.statsSection}>
          <h2 className={styles.sectionTitle}>สถิติระบบจองล็อค</h2>
          <Stats stats={stats} />
        </section>
      )}

      {/* Features Section */}
<section className={styles.features}>
  <h2 className={styles.sectionTitle}>ทำไมต้องเลือกเรา</h2>
  <div className={styles.featureGrid}>
    <div className={styles.featureCard}>
      <div className={styles.featureIcon}>
        <Smartphone size={40} strokeWidth={1.5} />
      </div>
      <h3>ใช้ง่าย</h3>
      <p>ระบบจองออนไลน์ที่ใช้งานง่าย สามารถจองได้จากที่บ้าน</p>
    </div>
    <div className={styles.featureCard}>
      <div className={styles.featureIcon}>
        <Zap size={40} strokeWidth={1.5} />
      </div>
      <h3>รวดเร็ว</h3>
      <p>ได้รับการยืนยันทันทีหลังจากชำระเงินเรียบร้อย</p>
    </div>
    <div className={styles.featureCard}>
      <div className={styles.featureIcon}>
        <Lock size={40} strokeWidth={1.5} />
      </div>
      <h3>ปลอดภัย</h3>
      <p>ข้อมูลส่วนตัวของคุณได้รับการปกป้องอย่างเต็มที่</p>
    </div>
    <div className={styles.featureCard}>
      <div className={styles.featureIcon}>
        <DollarSign size={40} strokeWidth={1.5} />
      </div>
      <h3>ราคาเหมาะสม</h3>
      <p>ราคาสำหรับผู้ค้าทั่วไป โปร่งใสไม่มีค่าเพิ่มเติม</p>
    </div>
    <div className={styles.featureCard}>
      <div className={styles.featureIcon}>
        <Clock size={40} strokeWidth={1.5} />
      </div>
      <h3>ช่วยเหลือ 24/7</h3>
      <p>ทีมสนับสนุนพร้อมช่วยเหลือตลอดเวลา</p>
    </div>
    <div className={styles.featureCard}>
      <div className={styles.featureIcon}>
        <MapPin size={40} strokeWidth={1.5} />
      </div>
      <h3>สถานที่ดี</h3>
      <p>ตลาดอยู่ในตำแหน่งที่ดี เข้าออกสะดวก</p>
    </div>
  </div>
</section>

      {/* How It Works */}
      <section className={styles.howItWorks}>
        <h2 className={styles.sectionTitle}>วิธีการจอง</h2>
        <div className={styles.stepsContainer}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3>เลือกล็อค</h3>
            <p>ดูแผนพื้นที่ทั้งหมดและเลือกล็อคที่ต้องการ</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3>กรอกข้อมูล</h3>
            <p>กรอกข้อมูลส่วนตัวและข้อมูลธุรกิจของคุณ</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3>ชำระเงิน</h3>
            <p>ชำระค่าจองล็อคผ่านช่องทางต่างๆ ที่เปิดให้บริการ</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>4</div>
            <h3>ยืนยันสำเร็จ</h3>
            <p>ได้รับการยืนยันและพร้อมใช้งานล็อคของคุณ</p>
          </div>
        </div>
      </section>

      {/* Quick Links */}
<section className={styles.quickLinks}>
  <h2 className={styles.sectionTitle}>ลิงค์สำคัญ</h2>
  <div className={styles.linksGrid}>
    <Link href="/booking" className={styles.linkCard}>
      <span className={styles.linkIcon}>
        <FileText size={32} strokeWidth={1.5} />
      </span>
      <h3 className={styles.linkCardTitle}>จองล็อค</h3>
      <p className={styles.linkCardDescription}>เลือกและจองล็อคพื้นที่</p>
    </Link>
    <Link href="/my-bookings" className={styles.linkCard}>
      <span className={styles.linkIcon}>
        <CheckSquare size={32} strokeWidth={1.5} />
      </span>
      <h3 className={styles.linkCardTitle}>การจองของฉัน</h3>
      <p className={styles.linkCardDescription}>ดูและจัดการการจอง</p>
    </Link>
    <Link href="/payment" className={styles.linkCard}>
      <span className={styles.linkIcon}>
        <CreditCard size={32} strokeWidth={1.5} />
      </span>
      <h3 className={styles.linkCardTitle}>ประวัติการชำระ</h3>
      <p className={styles.linkCardDescription}>ดูประวัติการชำระเงิน</p>
    </Link>
    <Link href="/contact" className={styles.linkCard}>
      <span className={styles.linkIcon}>
        <Phone size={32} strokeWidth={1.5} />
      </span>
      <h3 className={styles.linkCardTitle}>ติดต่อเรา</h3>
      <p className={styles.linkCardDescription}>ส่งข้อความหรือเรียกหา</p>
    </Link>
  </div>
</section>

      {/* Footer */}
      <section className={styles.footer}>
        <p>&copy; 2026 ตลาดถนนเดินศรีสะเกษ. สงวนลิขสิทธิ์ทั้งหมด</p>
        <div className={styles.footerLinks}>
          <Link href="/terms">เงื่อนไขการใช้บริการ</Link>
          <Link href="/contact">ติดต่อเรา</Link>
        </div>
      </section>
    </div>
  );
}