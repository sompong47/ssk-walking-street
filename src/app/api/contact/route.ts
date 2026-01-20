import { connectDB } from '@/lib/mongodb';
import { Contact } from '@/lib/models/Contact';
import { NextResponse } from 'next/server';

// 1. GET: แอดมินดึงข้อความทั้งหมดไปดู
export async function GET() {
  await connectDB();
  const contacts = await Contact.find().sort({ createdAt: -1 }); // ใหม่สุดขึ้นก่อน
  return NextResponse.json({ success: true, data: contacts });
}

// 2. POST: ลูกค้าส่งข้อความ (จากหน้า Contact Us)
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    // บันทึกลงฐานข้อมูล
    const newContact = await Contact.create(body);

    return NextResponse.json({ success: true, data: newContact });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'ส่งข้อความไม่สำเร็จ' }, { status: 500 });
  }
}