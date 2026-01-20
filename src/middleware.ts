import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // ดูว่า path ที่คนกำลังจะเข้าคืออะไร
  const path = request.nextUrl.pathname;

  // ถ้าพยายามเข้าหน้า /admin...
  if (path.startsWith('/admin')) {
    
    // ข้อยกเว้น: ถ้าเข้าหน้า Login อยู่แล้ว ไม่ต้องเช็ค (เดี๋ยววนลูป)
    if (path === '/admin/login') {
      return NextResponse.next();
    }

    // ตรวจหา Cookie ที่ชื่อ 'admin_token'
    const token = request.cookies.get('admin_token')?.value;

    // ถ้าไม่มี Token -> ดีดไปหน้า Login
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

// กำหนดว่า Middleware นี้จะทำงานเฉพาะ Path ไหนบ้าง
export const config = {
  matcher: '/admin/:path*', // บังคับใช้กับทุกอย่างที่ขึ้นต้นด้วย /admin
};