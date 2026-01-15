import type { Metadata, Viewport } from 'next';
import { ReactNode } from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: 'ระบบจองล็อคตลาดถนนเดินศรีสะเกษ',
  description: 'เลือกและจองล็อคพื้นที่ตลาดถนนเดินศรีสะเกษอย่างสะดวก',
  keywords: ['market', 'booking', 'ตลาด', 'จอง', 'ศรีสะเกษ'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="th">
      <head>
        <meta charSet="utf-8" />
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: `
            (function() {
              try {
                var saved = localStorage.getItem('theme');
                if (saved === 'light' || saved === 'dark') {
                  document.documentElement.setAttribute('data-theme', saved);
                  return;
                }
                var prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
                document.documentElement.setAttribute('data-theme', prefersLight ? 'light' : 'dark');
              } catch (e) {}
            })();
          ` }}
        />
      </head>
      <body>
        <header className="site-header">
          <div className="nav-inner">
            <Link href="/" className="logo">ตลาดถนนคนเดินศรีสะเกษ</Link>
            <nav className="nav">
              <Link href="/">หน้าหลัก</Link>
              <Link href="/booking">จองล็อค</Link>
              <Link href="/my-bookings">การจองของฉัน</Link>
              <Link href="/payment">ประวัติการชำระ</Link>
              <Link href="/contact">ติดต่อเรา</Link>
              <ThemeToggle />
            </nav>
          </div>
        </header>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}