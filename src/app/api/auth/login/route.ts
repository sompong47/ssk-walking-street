import { connectDB } from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    await connectDB();
    const { phone, password } = await request.json();

    // 1. ค้นหา User ใน Database (ไม่สนว่าเป็นใคร ค้นมาก่อน)
    const user = await User.findOne({ phone, password }); // *ในการใช้งานจริงควร Hash Password นะครับ แต่ตอนนี้ทำแบบง่ายไปก่อน

    if (!user) {
      return NextResponse.json({ success: false, message: 'เบอร์โทรหรือรหัสผ่านไม่ถูกต้อง' }, { status: 401 });
    }

    // 2. สร้าง User Token (สำหรับแสดงชื่อหน้าเว็บ)
    const userData = JSON.stringify({ 
        id: user._id, 
        name: user.name, 
        phone: user.phone, 
        role: user.role // ส่ง Role ไปบอกหน้าเว็บด้วย
    });
    
    // ตั้งค่า Cookie พื้นฐาน
    cookies().set('user_token', userData, { httpOnly: true, path: '/' });

    // 3. 🔥 จุดสำคัญ: ถ้าเป็น Admin ให้แจกบัตรผ่านเข้าหลังบ้าน (admin_token)
    if (user.role === 'admin') {
        // สร้าง Cookie สำหรับผ่าน Middleware ของ Admin
        cookies().set('admin_token', 'secret_admin_pass', { 
            httpOnly: true, 
            path: '/',
            maxAge: 60 * 60 * 24 // 1 วัน
        });
    } else {
        // ถ้าไม่ใช่ Admin ให้ลบ admin_token ทิ้ง (กันคนเคยเป็นแอดมินแล้วโดนปลด)
        cookies().delete('admin_token');
    }

    return NextResponse.json({ 
        success: true, 
        role: user.role, 
        user: { name: user.name, phone: user.phone } 
    });

  } catch (error) {
    return NextResponse.json({ success: false, message: 'เกิดข้อผิดพลาด' }, { status: 500 });
  }
}

// ตอน Logout ก็ลบให้หมด
export async function DELETE() {
    cookies().delete('user_token');
    cookies().delete('admin_token');
    return NextResponse.json({ success: true });
}