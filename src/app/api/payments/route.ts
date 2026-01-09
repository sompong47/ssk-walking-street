import { connectDB } from '@/lib/mongodb';
import { Payment } from '@/lib/models/Payment';
import { Booking } from '@/lib/models/Booking';
import { Lot } from '@/lib/models/Lot';
import { generateTransactionId } from '@/lib/utils/helpers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    let query: any = {};
    if (status) {
      query.status = status;
    }
    
    const skip = (page - 1) * limit;
    const payments = await Payment.find(query)
      .populate({
        path: 'bookingId',
        populate: { path: 'lotId' }
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    const total = await Payment.countDocuments(query);
    
    return NextResponse.json({
      success: true,
      data: {
        payments,
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
    
    const booking = await Booking.findById(data.bookingId);
    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }
    
    const payment = new Payment({
      ...data,
      transactionId: data.transactionId || generateTransactionId(),
      paidDate: data.status === 'success' ? new Date() : null,
    });
    
    await payment.save();
    
    if (data.status === 'success') {
      await Booking.findByIdAndUpdate(data.bookingId, {
        paymentStatus: 'completed'
      });
      
      await Lot.findByIdAndUpdate(booking.lotId, {
        status: 'booked',
        vendor: booking.vendorName,
        vendorPhone: booking.vendorPhone,
      });
    }
    
    return NextResponse.json(
      { success: true, data: payment },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
