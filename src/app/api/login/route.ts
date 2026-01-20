import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // 🔐 เช็ค Username / Password (เปลี่ยนตรงนี้ได้ตามใจชอบ)
    if (username === 'admin' && password === '1234') {
      
      // ถ้าถูก: สร้าง Cookie ชื่อ admin_token
      // (อายุ 1 วัน = 24 * 60 * 60 * 1000)
      const oneDay = 24 * 60 * 60 * 1000;
      
      cookies().set('admin_token', 'true', { 
        expires: Date.now() + oneDay,
        httpOnly: true, // ปลอดภัย JavaScript เข้าถึงไม่ได้
        path: '/',
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: 'รหัสผ่านไม่ถูกต้อง' }, { status: 401 });

  } catch (error) {
    return NextResponse.json({ success: false, message: 'เกิดข้อผิดพลาด' }, { status: 500 });
  }
}

// แถม: API สำหรับ Logout
export async function DELETE() {
  cookies().delete('admin_token');
  return NextResponse.json({ success: true });
}