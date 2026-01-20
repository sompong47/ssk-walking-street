import { connectDB } from '@/lib/mongodb';
import { Booking } from '@/lib/models/Booking';
import { Lot } from '@/lib/models/Lot';
import { NextRequest, NextResponse } from 'next/server';

// 1. ดึงข้อมูลการจองรายตัว (ใช้ตอนเข้าหน้าจ่ายเงิน หรือดูรายละเอียด)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const booking = await Booking.findById(params.id).populate('lotId');
    
    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: booking,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// 2. อัปเดตข้อมูล (เช่น แนบสลิป, เปลี่ยนสถานะ, หรือยกเลิก)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const data = await request.json();
    
    // อัปเดตข้อมูล Booking
    const booking = await Booking.findByIdAndUpdate(
      params.id,
      data,
      { new: true, runValidators: true }
    ).populate('lotId');
    
    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    // 🔥 เพิ่ม Logic พิเศษ: ถ้ายกเลิกการจอง ให้คืนพื้นที่ (Lot) เป็นว่างทันที
    if (data.status === 'cancelled') {
        await Lot.findByIdAndUpdate(booking.lotId._id, { status: 'available' });
    }
    
    // 🔥 ถ้าอนุมัติการจอง (confirmed) ให้ปรับสถานะพื้นที่เป็นไม่ว่าง (reserved) เผื่อไว้
    if (data.status === 'confirmed') {
        await Lot.findByIdAndUpdate(booking.lotId._id, { status: 'reserved' });
    }

    return NextResponse.json({
      success: true,
      data: booking,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// 3. ลบข้อมูลถาวร (Hard Delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    // หาและลบทิ้งเลย
    const booking = await Booking.findByIdAndDelete(params.id);
    
    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }
    
    // เมื่อลบ Booking แล้ว ต้องปรับสถานะ Lot ให้ว่างด้วย
    if (booking.lotId) {
        await Lot.findByIdAndUpdate(booking.lotId, { status: 'available' });
    }
    
    return NextResponse.json({
      success: true,
      data: booking,
      message: 'Booking deleted and lot freed'
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}