import { connectDB } from '@/lib/mongodb';
import { Booking } from '@/lib/models/Booking';
import { Lot } from '@/lib/models/Lot';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const paymentStatus = searchParams.get('paymentStatus');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    let query: any = {};
    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }
    
    const skip = (page - 1) * limit;
    const bookings = await Booking.find(query)
      .populate('lotId')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    const total = await Booking.countDocuments(query);
    
    return NextResponse.json({
      success: true,
      data: {
        bookings,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const data = await request.json();
    
    const lot = await Lot.findById(data.lotId);
    if (!lot || lot.status !== 'available') {
      return NextResponse.json(
        { success: false, error: 'Lot is not available' },
        { status: 400 }
      );
    }
    
    const booking = new Booking({
      ...data,
      paymentStatus: 'pending',
    });
    
    await booking.save();
    await Lot.findByIdAndUpdate(data.lotId, { status: 'reserved' });
    
    return NextResponse.json(
      { success: true, data: booking },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
