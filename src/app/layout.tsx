import type { Metadata, Viewport } from 'next';
import { ReactNode } from 'react';
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
      </head>
      <body>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}