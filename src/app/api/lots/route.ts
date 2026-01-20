import { connectDB } from '@/lib/mongodb';
import { Lot } from '@/lib/models/Lot';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB();
    // ดึงข้อมูลทั้งหมด และเรียงตามโซนและเลขที่
    const lots = await Lot.find({}).sort({ section: 1, lotNumber: 1 });
    
    return NextResponse.json({
      success: true,
      data: { lots }, // ส่งออกไปในชื่อ lots
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}