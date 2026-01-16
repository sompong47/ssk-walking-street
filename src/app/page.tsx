'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Stats } from '@/components/Stats';
import styles from './home.module.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  MapPin, FileText, CheckSquare, CreditCard, 
  ArrowRight, Check, Sparkles, Star, DollarSign
} from 'lucide-react';

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
  const [activeStep, setActiveStep] = useState(0);
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
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

  const steps = [
    {
      number: 1,
      title: 'เลือกล็อค',
      description: 'ดูแผนพื้นที่ทั้งหมดและเลือกล็อคที่ต้องการ',
      icon: <MapPin className={styles.stepIconSvg} />,
      details: [
        'ดูแผนผังตลาดแบบ Interactive',
        'เลือกตำแหน่งที่ต้องการ',
        'ดูรายละเอียดล็อคแต่ละช่อง'
      ]
    },
    {
      number: 2,
      title: 'กรอกข้อมูล',
      description: 'กรอกข้อมูลส่วนตัวและข้อมูลธุรกิจของคุณ',
      icon: <FileText className={styles.stepIconSvg} />,
      details: [
        'ข้อมูลส่วนตัวและติดต่อ',
        'ประเภทสินค้าที่จะขาย',
        'เอกสารประกอบการขออนุญาต'
      ]
    },
    {
      number: 3,
      title: 'ชำระเงิน',
      description: 'ชำระค่าจองล็อคผ่านช่องทางต่างๆ ที่เปิดให้บริการ',
      icon: <CreditCard className={styles.stepIconSvg} />,
      details: [
        'โอนผ่านธนาคาร',
        'QR Code พร้อมเพย์',
        'บัตรเครดิต/เดบิต'
      ]
    },
    {
      number: 4,
      title: 'ยืนยันสำเร็จ',
      description: 'ได้รับการยืนยันและพร้อมใช้งานล็อคของคุณ',
      icon: <CheckSquare className={styles.stepIconSvg} />,
      details: [
        'รับเลขที่การจองทันที',
        'ดาวน์โหลดใบเสร็จ',
        'เริ่มขายได้ทันที'
      ]
    }
  ];

  const testimonials = [
    {
      name: 'คุณสมชาย ใจดี',
      business: 'ร้านอาหารไทย',
      text: 'ระบบจองใช้ง่ายมาก ไม่ต้องไปต่อแถวที่สำนักงาน ประหยัดเวลาได้เยอะ',
      rating: 5,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'คุณมาลี รักษ์ดี',
      business: 'ร้านเสื้อผ้า',
      text: 'สะดวกจริงๆ จองผ่านมือถือได้ ชำระเงินง่าย ได้ล็อคที่ต้องการอีก',
      rating: 5,
      color: 'from-purple-500 to-pink-500'
    },
    {
      name: 'คุณประยุทธ นักขาย',
      business: 'ร้านของที่ระลึก',
      text: 'ประทับใจการบริการ ตอบคำถามรวดเร็ว ระบบทำงานได้ดี',
      rating: 5,
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <Sparkles size={18} />
            <span>เปิดให้จองแล้ว - จำนวนจำกัด</span>
          </div>
          <h1 className={styles.heroTitle}>ตลาดถนนคนเดินศรีสะเกษ</h1>
          <p className={styles.heroSubtitle}>
            ระบบจองล็อคพื้นที่สะดวก รวดเร็ว และน่าเชื่อถือ
          </p>
          <div className={styles.heroButtons}>
            <Link href="/booking" className={styles.primaryBtn}>
              <span>จองล็อคเลย</span>
              <ArrowRight size={20} />
            </Link>
            <Link href="/terms" className={styles.secondaryBtn}>
              <span>ดูข้อมูลเพิ่มเติม</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {!loading && stats && (
        <section className={styles.statsSection}>
          <div className={styles.floatingBadge}>
            <Sparkles size={16} />
            <span>สถิติแบบเรียลไทม์</span>
          </div>
          <h2 className={styles.sectionTitle}>สถิติระบบจองล็อค</h2>
          <Stats stats={stats} />
        </section>
      )}

      {/* Steps Section */}
      <section className={styles.stepsSection}>
        <div className={styles.stepsHeader}>
          <div className={styles.floatingBadge}>
            <Star size={16} />
            <span>ง่ายแค่ 4 ขั้นตอน</span>
          </div>
          <h2 className={styles.sectionTitle}>วิธีการจอง</h2>
          <p className={styles.sectionSubtitle}>เริ่มต้นได้ใน 4 ขั้นตอนง่ายๆ</p>
        </div>

        <div className={styles.stepsTimeline}>
          <div className={styles.timelineLine}>
            <div 
              className={styles.timelineProgress}
              style={{ width: `${(activeStep / 3) * 100}%` }}
            />
          </div>
        </div>

        <div className={styles.stepsContainer}>
          {steps.map((step, index) => (
            <div 
              key={index}
              className={`${styles.stepCard} ${activeStep === index ? styles.stepActive : ''} ${activeStep > index ? styles.stepCompleted : ''}`}
              onMouseEnter={() => setActiveStep(index)}
            >
              {activeStep > index && (
                <div className={styles.completedBadge}>
                  <Check size={16} />
                </div>
              )}
              
              <div className={styles.stepNumber}>
                {activeStep > index ? <Check size={24} /> : step.number}
              </div>
              
              <div className={styles.stepIconWrapper}>
                {step.icon}
              </div>

              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDescription}>{step.description}</p>

              <div className={styles.stepDetails}>
                {step.details.map((detail, idx) => (
                  <div key={idx} className={styles.stepDetailItem}>
                    <Check size={16} className={styles.checkIcon} />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>

              {index < steps.length - 1 && (
                <div className={styles.stepConnector}>
                  <ArrowRight className={styles.connectorArrow} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={styles.stepProgress}>
          {steps.map((_, index) => (
            <div 
              key={index}
              className={`${styles.progressDot} ${activeStep === index ? styles.progressDotActive : ''}`}
              onClick={() => setActiveStep(index)}
            />
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonialsSection}>
        <div className={styles.floatingBadge}>
          <Star size={16} />
          <span>รีวิวจากลูกค้าจริง</span>
        </div>
        <h2 className={styles.sectionTitle}>ความคิดเห็นจากผู้ค้า</h2>
        <div className={styles.testimonialsGrid}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className={styles.testimonialCard}>
              <div className={styles.quoteIcon}>"</div>
              <div className={styles.testimonialRating}>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className={styles.star}>★</span>
                ))}
              </div>
              <p className={styles.testimonialText}>"{testimonial.text}"</p>
              <div className={styles.testimonialAuthor}>
                <div className={`${styles.authorAvatar} bg-gradient-to-br ${testimonial.color}`}>
                  {testimonial.name.charAt(2)}
                </div>
                <div>
                  <div className={styles.authorName}>{testimonial.name}</div>
                  <div className={styles.authorBusiness}>{testimonial.business}</div>
                </div>
              </div>
              <div className={styles.cardShine} />
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <section className={styles.footer}>
        <p>&copy; 2026 ตลาดถนนคนเดินศรีสะเกษ. สงวนลิขสิทธิ์ทั้งหมด</p>
        <div className={styles.footerLinks}>
          <Link href="/terms">เงื่อนไขการใช้บริการ</Link>
          <Link href="/privacy">นโยบายความเป็นส่วนตัว</Link>
          <Link href="/contact">ติดต่อเรา</Link>
        </div>
      </section>
    </div>
  );
}