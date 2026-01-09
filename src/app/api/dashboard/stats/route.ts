import { connectDB } from '@/lib/mongodb';
import { Lot } from '@/lib/models/Lot';
import { Booking } from '@/lib/models/Booking';
import { Payment } from '@/lib/models/Payment';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const totalLots = await Lot.countDocuments();
    const availableLots = await Lot.countDocuments({ status: 'available' });
    const bookedLots = await Lot.countDocuments({ status: 'booked' });
    const reservedLots = await Lot.countDocuments({ status: 'reserved' });
    
    const totalBookings = await Booking.countDocuments();
    const completedPayments = await Payment.countDocuments({ status: 'success' });
    const pendingPayments = await Payment.countDocuments({ status: 'pending' });
    
    const payments = await Payment.find({ status: 'success' });
    const totalRevenue = payments.reduce((sum: number, p: any) => sum + p.amount, 0);
    
    const recentBookings = await Booking.find()
      .populate('lotId')
      .sort({ createdAt: -1 })
      .limit(5);
    
    return NextResponse.json({
      success: true,
      data: {
        totalLots,
        availableLots,
        bookedLots,
        reservedLots,
        totalRevenue,
        totalBookings,
        completedPayments,
        pendingPayments,
        recentBookings,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ============================================
// POST handler for search
// ============================================
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'vendor';
    
    let results: any = [];
    
    if (type === 'vendor' && q) {
      results = await Booking.find({
        $or: [
          { vendorName: { $regex: q, $options: 'i' } },
          { vendorEmail: { $regex: q, $options: 'i' } },
          { vendorPhone: { $regex: q, $options: 'i' } }
        ]
      }).populate('lotId').limit(10);
    } else if (type === 'lot' && q) {
      results = await Lot.find({
        lotNumber: parseInt(q) || -1
      });
    }
    
    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
