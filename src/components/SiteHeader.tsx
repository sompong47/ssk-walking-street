'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from '@/app/ThemeToggle'; // ตรวจสอบ path ให้ถูกนะครับ (อาจจะอยู่ที่ src/components/ThemeToggle)

export default function SiteHeader() {
  const { user, role, isLoggedIn, logout, setShowLoginModal } = useAuth();

  return (
    <header className="site-header">
      <div className="nav-inner">
        <Link href="/" className="logo">ตลาดถนนคนเดินศรีสะเกษ</Link>
        <nav className="nav">
          <Link href="/">หน้าหลัก</Link>
          
          {/* เมนูสำหรับทุกคน */}
          <Link href="/contact">ติดต่อเรา</Link>

          {/* 🟢 กรณี: แอดมิน */}
          {isLoggedIn && role === 'admin' && (
             <>
                <Link 
                  href="/admin" 
                  style={{ color: '#e74c3c', fontWeight: 'bold', border: '1px solid #e74c3c', padding: '4px 8px', borderRadius: '4px' }}
                >
                  ⚙️ ระบบหลังบ้าน
                </Link>
                <button onClick={logout} className="logout-btn-header">ออกจากระบบ</button>
             </>
          )}

          {/* 🔵 กรณี: สมาชิกทั่วไป */}
          {isLoggedIn && role === 'user' && (
             <>
                <Link href="/booking">จองล็อค</Link>
                <Link href="/my-bookings">การจองของฉัน</Link>
                <Link href="/payment">ประวัติการชำระ</Link>
                <div className="user-profile">
                    👤 {user?.name}
                    <button onClick={logout} className="logout-text"> (ออก)</button>
                </div>
             </>
          )}

          {/* ⚪ กรณี: ยังไม่ล็อกอิน */}
          {!isLoggedIn && (
             <button 
                onClick={() => setShowLoginModal(true)}
                className="login-btn-header"
             >
                เข้าสู่ระบบ / สมัครสมาชิก
             </button>
          )}

          {/* ปุ่มเปลี่ยนธีม (ถ้ามี) */}
          <ThemeToggle />
        </nav>
      </div>

      {/* เพิ่ม CSS เฉพาะส่วนนี้แบบ inline หรือไปใส่ใน globals.css ก็ได้ */}
      <style jsx>{`
        .logout-btn-header {
          background: none; border: 1px solid #666; color: #666;
          padding: 4px 8px; border-radius: 4px; cursor: pointer;
        }
        .login-btn-header {
          background: #2563eb; color: white; border: none;
          padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 500;
        }
        .user-profile {
          display: flex; align-items: center; gap: 5px; color: #333; font-weight: bold;
        }
        .logout-text {
          background: none; border: none; color: #e74c3c; cursor: pointer; font-size: 0.9rem; text-decoration: underline;
        }
      `}</style>
    </header>
  );
}