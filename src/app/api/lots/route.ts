import { connectDB } from '@/lib/mongodb';
import { Lot } from '@/lib/models/Lot';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // 1. เชื่อมต่อ DB
    await connectDB();
    
    // 2. เช็คว่ามี Query Params อะไรบ้าง
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    
    // 3. สร้าง Query Object
    let query: any = {};
    if (status) {
      query.status = status;
    }
    
    const skip = (page - 1) * limit;

    // 4. ดึงข้อมูล
    const lots = await Lot.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ lotNumber: 1 })
      .lean(); // แนะนำ: ใส่ .lean() เพื่อให้อ่านข้อมูลเร็วขึ้นและแปลงเป็น JSON ง่าย
    
    const total = await Lot.countDocuments(query);
    
    return NextResponse.json({
      success: true,
      data: {
        lots,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    });

  } catch (error: any) {
    // *** สำคัญ: Log Error ลง Terminal เพื่อให้เรารู้สาเหตุ ***
    console.error("GET /api/lots Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch lots',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const data = await request.json();
    
    const existingLot = await Lot.findOne({ lotNumber: data.lotNumber });
    if (existingLot) {
      return NextResponse.json(
        { success: false, error: 'Lot number already exists' },
        { status: 400 }
      );
    }
    
    const lot = new Lot(data);
    await lot.save();
    
    return NextResponse.json(
      { success: true, data: lot },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/lots Error:", error); // Log Error
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}