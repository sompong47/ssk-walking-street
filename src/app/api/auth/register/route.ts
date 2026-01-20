import { connectDB } from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    await connectDB();
    const { name, phone, password } = await request.json();

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return NextResponse.json({ success: false, message: 'เบอร์โทรนี้ลงทะเบียนไปแล้ว' }, { status: 400 });
    }

    // 🔥 สูตรลับ: ถ้าชื่อขึ้นต้นด้วย "Admin " หรือ "SuperUser" ให้เป็น admin (เอาไว้เทส)
    // หรือคุณจะแก้เงื่อนไขนี้ตามใจชอบ
    let role = 'user';
    if (name.toLowerCase().startsWith('admin')) {
        role = 'admin';
    }

    await User.create({ name, phone, password, role });

    return NextResponse.json({ success: true, message: 'สมัครสมาชิกสำเร็จ' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'เกิดข้อผิดพลาด' }, { status: 500 });
  }
}