import type { Metadata, Viewport } from 'next';
import { ReactNode } from 'react';
import Script from 'next/script';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext'; // 👈 นำเข้า Context
import LoginModal from '@/components/LoginModal';     // 👈 นำเข้า Popup Login
import SiteHeader from '@/components/SiteHeader';     // 👈 นำเข้า Header ที่เพิ่งสร้าง

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
        {/* ครอบ AuthProvider เพื่อให้ทุกหน้าเช็คสถานะล็อกอินได้ */}
        <AuthProvider>
          
          {/* ส่วนหัวเว็บ (แยกเป็น Component แล้ว) */}
          <SiteHeader />

          {/* เนื้อหาหลัก */}
          <main>
            {children}
          </main>

          {/* Popup Login (ซ่อนอยู่ จะโชว์เมื่อกดปุ่มหรือถูกเรียก) */}
          <LoginModal />

        </AuthProvider>
      </body>
    </html>
  );
}