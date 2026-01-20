import { connectDB } from '@/lib/mongodb';
import { Booking } from '@/lib/models/Booking';
import { Lot } from '@/lib/models/Lot';
import { NextResponse } from 'next/server';

// 1. GET: ดึงรายการจอง (รองรับ status และ phone)
export async function GET(request: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const phone = searchParams.get('phone'); // ✅ รับค่าเบอร์โทร
    
    const filter: any = {};

    // ถ้ามีส่ง status มาให้กรองตาม status
    if (status && status !== 'all') {
      filter.status = status;
    }

    // ✅ ถ้ามีส่ง phone มา ให้ค้นหาแบบ "มีส่วนประกอบ" (Regex)
    if (phone) {
        filter.vendorPhone = { $regex: phone, $options: 'i' };
    }

    const bookings = await Booking.find(filter)
      .populate('lotId')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: bookings });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'ดึงข้อมูลล้มเหลว' }, { status: 500 });
  }
}

// 2. POST: (ส่วนนี้เหมือนเดิม ไม่ต้องแก้ แต่ก๊อปไปวางทับให้ครบได้ครับ)
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { 
      lotId, vendorName, vendorPhone, vendorEmail, 
      businessType, businessDescription, startDate, endDate, totalPrice 
    } = body;

    if (!lotId || !vendorName || !vendorPhone || !startDate) {
        return NextResponse.json({ success: false, message: 'ข้อมูลไม่ครบ' }, { status: 400 });
    }

    const lot = await Lot.findById(lotId);
    if (!lot || lot.status !== 'available') {
      return NextResponse.json({ success: false, message: 'ล็อคไม่ว่าง' }, { status: 400 });
    }

    // คำนวณราคา (Backup เผื่อ frontend ไม่ส่งมา)
    const amount = totalPrice || lot.price; 

    const newBooking = await Booking.create({
      lotId,
      vendorName,
      vendorPhone,
      vendorEmail,
      businessType,
      businessDescription,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      totalAmount: amount,
      status: 'pending',
      paymentStatus: 'pending'
    });

    await Lot.findByIdAndUpdate(lotId, { status: 'booked' });

    return NextResponse.json({ success: true, data: newBooking });

  } catch (error: any) {
    console.error('Create Booking Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}