'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation'; // ✅ เพิ่ม usePathname
import styles from './admin.module.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname(); // ✅ ดึง URL ปัจจุบันมาเช็ค

  // ฟังก์ชันออกจากระบบ
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/login', { method: 'DELETE' });
      router.push('/admin/login');
      router.refresh(); 
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  // 🔥 เช็ค: ถ้าเป็นหน้า Login ให้แสดงแค่เนื้อหา (children) ไม่เอา Sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // ถ้าเป็นหน้าอื่นๆ ใน Admin ให้แสดง Sidebar ตามปกติ
  return (
    <div className={styles.adminContainer}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>⚙️ Admin</h2>
          <p>ตลาดคนเดินศรีสะเกษ</p>
        </div>

        <nav className={styles.nav}>
          <Link href="/admin" className={`${styles.navItem} ${pathname === '/admin' ? styles.active : ''}`}>
            <span className={styles.navIcon}>■</span> ภาพรวม
          </Link>
          <Link href="/admin/bookings" className={`${styles.navItem} ${pathname.includes('/bookings') ? styles.active : ''}`}>
            <span className={styles.navIcon}>≡</span> จัดการการจอง
          </Link>
          <Link href="/admin/lots" className={`${styles.navItem} ${pathname.includes('/lots') ? styles.active : ''}`}>
            <span className={styles.navIcon}>⊞</span> จัดการพื้นที่/ราคา
          </Link>
          <Link href="/admin/report" className={`${styles.navItem} ${pathname.includes('/report') ? styles.active : ''}`}>
            <span className={styles.navIcon}>🖨️</span> ตีพิมพ์ข้อมูลล็อค
          </Link>
          <Link href="/admin/messages" className={`${styles.navItem} ${pathname.includes('/messages') ? styles.active : ''}`}>
            <span className={styles.navIcon}>📬</span> รายงาน/ข้อความ
          </Link>
        </nav>

        <div className={styles.bottomMenu} style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            

            <button 
                onClick={handleLogout} 
                className={styles.navItemLogout}
                style={{
                    width: '100%', 
                    background: 'none', 
                    border: 'none', 
                    textAlign: 'left', 
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    padding: '10px 15px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}
            >
                <span className={styles.navIcon}>×</span> ออกจากระบบ
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}