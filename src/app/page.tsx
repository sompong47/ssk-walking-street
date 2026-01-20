'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

interface MarketInfo {
  name: string;
  nameEn: string;
  description: string;
  address: string;
  district: string;
  province: string;
  postalCode: string;
  phone: string;
  email: string;
  images: string[];
  openingHours: {
    day: string;
    hours: string;
  }[];
  note: string;
}

export default function MarketDetail() {
  const [currentImage, setCurrentImage] = useState(0);
  const [showFullImage, setShowFullImage] = useState(false);
  const [activeDay, setActiveDay] = useState<string | null>(null);

  const marketInfo: MarketInfo = {
    name: 'ตลาดถนนคนเดินศรีสะเกษ',
    nameEn: 'Sisaket Walking Street Market',
    description: 'ตลาดนัดกลางเมือง Street Food ศูนย์อาหารและร้านอาหาร ที่เต็มไปด้วยนักท่องเที่ยว ชาวพื้นที่ มีเฉพาะเมนูชั้นนำ จ่ายตรง ในราคาเป็นกันเอง มีให้เลือกเต็มไปหมด ร้านเยอะ เดินง่าย ราคาไม่แพง ช้อปปิ้งบรรจุภัณฑ์ โซนสตาเลีย',
    address: 'ถนนเลี่ยงเมือง',
    district: 'เมืองศรีสะเกษ',
    province: 'ศรีสะเกษ',
    postalCode: '33000',
    phone: '087-123-4567',
    email: 'info@ssk-market.com',
    images: [
        '/images/1.jpg',
        '/images/2.jpg',
        '/images/3.jpg',
        '/images/4.jpg',
        '/images/5.jpg'
    ],
    openingHours: [

      { day: 'วันเสาร์', hours: '14:00 น. - 22:00 น.' },
      { day: 'วันอาทิตย์', hours: '14:00 น. - 22:00 น.' }
    ],
    note: 'หมายเหตุเวลาทำการ: ทุกวัน เวลา 14:00 - 22:00 น.'
  };

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % marketInfo.images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + marketInfo.images.length) % marketInfo.images.length);
  };

  useEffect(() => {
    const imagesLength = marketInfo.images.length;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setCurrentImage((prev) => (prev - 1 + imagesLength) % imagesLength);
      }
      if (e.key === 'ArrowRight') {
        setCurrentImage((prev) => (prev + 1) % imagesLength);
      }
      if (e.key === 'Escape') setShowFullImage(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={styles.page}>
      {/* Hero Header with Background Image */}
      <div className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>{marketInfo.name}</h1>
          <p className={styles.heroSubtitle}>{marketInfo.nameEn}</p>
        </div>
      </div>

      {/* Main Content Container */}
      <div className={styles.container}>
        <div className={styles.mainContent}>
          {/* Left Sidebar */}
          <aside className={styles.sidebar}>
            {/* Search Box */}
            <div className={styles.searchBox}>
              <input 
                type="text" 
                placeholder="ปิดอยู่ในขณะนี้"
                className={styles.searchInput}
                disabled
              />
            </div>

            {/* Opening Hours Card */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>วันเวลาทำการ</h2>
              <div className={styles.scheduleList}>
                {marketInfo.openingHours.map((schedule, idx) => (
                  <div 
                    key={idx} 
                    className={styles.scheduleItem}
                    onMouseEnter={() => setActiveDay(schedule.day)}
                    onMouseLeave={() => setActiveDay(null)}
                    style={{
                      background: activeDay === schedule.day ? '#f0f4ff' : 'transparent'
                    }}
                  >
                    <span className={styles.scheduleDay}>{schedule.day}</span>
                    <span className={styles.scheduleHours}>{schedule.hours}</span>
                  </div>
                ))}
              </div>
              <div className={styles.scheduleNote}>
                {marketInfo.note}
              </div>
            </div>

            {/* Back Button */}
            <Link href="/contact" className={styles.backButton}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              ติดต่อเรา
            </Link>

            {/* Verified Badge */}
            <div className={styles.verifiedBadge}>
              <div className={styles.checkIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
              </div>
              <span>ข้อมูลนี้เป็นหน่วยงานของรัฐ :</span>
            </div>
          </aside>

          {/* Right Content Area */}
          <div className={styles.contentArea}>
            {/* Image Slider */}
            <div className={styles.imageSlider}>
              <div className={styles.imageWrapper}>
                <div 
                  className={styles.mainImage}
                  style={{ backgroundImage: `url(${marketInfo.images[currentImage]})` }}
                >
                  <div className={styles.imageOverlay}>
                    <div className={styles.overlayBadge}>
                      พื้นที่เต็มเล่นและซื้อปิ่งหลายสเตล
                    </div>
                    <div className={styles.overlayContent}>
                      <p className={styles.overlayText}>
                        เปิดทั้งร้านค้าทั่วๆ 100 ล็อค<br/>
                        <br/>
                        <br/>
                        <br/>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <button 
                  className={`${styles.navBtn} ${styles.navBtnLeft}`}
                  onClick={prevImage}
                  aria-label="Previous image"
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                <button 
                  className={`${styles.navBtn} ${styles.navBtnRight}`}
                  onClick={nextImage}
                  aria-label="Next image"
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {/* Image Counter */}
                <div className={styles.imageCounter}>
                  {currentImage + 1} / {marketInfo.images.length}
                </div>

                {/* Fullscreen Button */}
                <button 
                  className={styles.fullscreenBtn}
                  onClick={() => setShowFullImage(true)}
                  aria-label="View fullscreen"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

              </div>
            </div>

            {/* Market Title & Location */}
            <div className={styles.marketInfo}>
              <h1 className={styles.marketTitle}>{marketInfo.name}</h1>
              <div className={styles.location}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
                </svg>
                <span>
                  <strong>ตำบล:</strong> {marketInfo.address} <strong>อำเภอ:</strong> {marketInfo.district} <strong>จังหวัด:</strong> {marketInfo.province} {marketInfo.postalCode}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={styles.actionButtons}>
              <button className={styles.actionBtn}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                </svg>
                แชร์
              </button>
              <button className={styles.actionBtn}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
                </svg>
                บันทึก
              </button>
              <button className={styles.actionBtn}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                ส่งอีเมล
              </button>
              <button className={styles.actionBtn}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 3a2.83 2.83 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                </svg>
                แจ้งปัญหา
              </button>
              <Link href="/booking" className={`${styles.actionBtn} ${styles.bookingBtn}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                </svg>
                จองล็อคเลย
              </Link>
            </div>

            {/* Description */}
            <div className={styles.descriptionCard}>
              <p className={styles.description}>
                {marketInfo.description}
              </p>
            </div>

            {/* Contact Info */}
            <div className={styles.contactCard}>
              <h3 className={styles.contactTitle}>ข้อมูลติดต่อ</h3>
              <div className={styles.contactGrid}>
                <div className={styles.contactItem}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.27 11.36 11.36 0 003.48.56 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.3 1.02l-2.15 2.2z"/>
                  </svg>
                  <div>
                    <label>โทรศัพท์</label>
                    <a href={`tel:${marketInfo.phone}`}>{marketInfo.phone}</a>
                  </div>
                </div>

                <div className={styles.contactItem}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  <div>
                    <label>อีเมล</label>
                    <a href={`mailto:${marketInfo.email}`}>{marketInfo.email}</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className={styles.mapCard}>
              <h3 className={styles.mapTitle}>แผนที่</h3>
              <div className={styles.mapPlaceholder}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
                </svg>
                <p>คลิกเพื่อดูแผนที่</p>
                <a 
                  href="https://www.google.com/maps/place/%E0%B8%96%E0%B8%99%E0%B8%99%E0%B8%84%E0%B8%99%E0%B9%80%E0%B8%94%E0%B8%B4%E0%B8%99%E0%B8%A8%E0%B8%A3%E0%B8%B5%E0%B8%AA%E0%B8%B0%E0%B9%80%E0%B8%81%E0%B8%A8/@15.1056532,104.3169124,1141m/data=!3m1!1e3!4m6!3m5!1s0x3116e3ebe7b36de5:0xe8ed5406a96edfb8!8m2!3d15.1056075!4d104.3169022!16s%2Fg%2F11sb4zwz0r?entry=ttu&g_ep=EgoyMDI2MDExMy4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.mapBtn}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  นำทาง
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Image Modal */}
      {showFullImage && (
        <div className={styles.modal} onClick={() => setShowFullImage(false)}>
          <button
            className={styles.closeBtn}
            onClick={() => setShowFullImage(false)}
            aria-label="Close"
          >
            ×
          </button>

          <div className={styles.modalContent}>
            <img 
              src={marketInfo.images[currentImage]} 
              alt={`${marketInfo.name} - Image ${currentImage + 1}`}
              className={styles.modalImage}
            />

            {/* Bottom Navigation */}
            <div className={styles.bottomNav}>
              <button 
                className={`${styles.navBtn} ${styles.modalNavBtn}`}
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                aria-label="Previous image"
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              <span className={styles.imageCounter}>
                {currentImage + 1} / {marketInfo.images.length}
              </span>

              <button 
                className={`${styles.navBtn} ${styles.modalNavBtn}`}
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                aria-label="Next image"
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}