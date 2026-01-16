import Link from 'next/link';
import styles from './admin.module.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.adminContainer}>
      {/* Sidebar เมนูทางซ้าย */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>👮‍♂️ Admin</h2>
          <p>ตลาดคนเดินศรีสะเกษ</p>
        </div>
        <nav className={styles.nav}>
          <Link href="/admin" className={styles.navItem}>📊 ภาพรวม (Dashboard)</Link>
          <Link href="/admin/bookings" className={styles.navItem}>📝 จัดการการจอง</Link>
          <Link href="/admin/lots" className={styles.navItem}>🏪 จัดการพื้นที่/ราคา</Link>
          <Link href="/" className={styles.navItemLogout}>🏠 กลับหน้าหลัก</Link>
        </nav>
      </aside>

      {/* เนื้อหาหลัก */}
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}