import mongoose, { Schema, model, models } from 'mongoose';

export interface IBooking {
  _id?: string;
  lotId: mongoose.Types.ObjectId; 
  vendorName: string;
  vendorPhone: string;
  vendorEmail: string;
  businessType: string;
  businessDescription?: string;   
  startDate: Date;
  endDate: Date;
  
  // 🟢 1. ปรับ Payment Status ให้รองรับการแจ้งโอน
  // pending = ยังไม่จ่าย
  // paid = ลูกค้าแนบสลิปแล้ว (รอแอดมินตรวจ)
  // verified = แอดมินตรวจแล้วว่าเงินเข้าจริง
  // failed = ไม่ผ่าน/ยกเลิก
  paymentStatus: 'pending' | 'paid' | 'verified' | 'failed';
  
  // 🟢 2. เพิ่มช่องเก็บ URL ของรูปสลิป
  slipUrl?: string; 
  
  // 🟢 3. เพิ่มสถานะการจอง (แยกกับการจ่ายเงิน)
  // pending = จองไว้เฉยๆ, confirmed = ได้ล็อคชัวร์, cancelled = ยกเลิก
  status: 'pending' | 'confirmed' | 'cancelled';

  // 🟢 4. (แนะนำ) เก็บยอดเงินที่ต้องจ่ายไว้ด้วย กันราคาเปลี่ยนทีหลัง
  totalAmount?: number;

  notes?: string;               
  createdAt?: Date;
  updatedAt?: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    lotId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Lot', 
      required: true,
      index: true
    },
    vendorName: { type: String, required: true },
    vendorPhone: { type: String, required: true },
    vendorEmail: { type: String, required: true, lowercase: true },
    businessType: { type: String, required: true },
    businessDescription: { type: String }, 
    startDate: { type: Date, required: true },
    endDate: { type: Date, default: null },
    
    // 🟢 ส่วนการเงินที่แก้ไข
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'verified', 'failed'],
      default: 'pending',
      index: true
    },
    
    // 🟢 เก็บ Path ของไฟล์รูป
    slipUrl: { type: String },

    // 🟢 เก็บยอดเงินรวม
    totalAmount: { type: Number },

    // 🟢 สถานะหลักของการจอง
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    },

    notes: { type: String, default: null },
  },
  { timestamps: true }
);

export const Booking = models.Booking || model<IBooking>('Booking', BookingSchema);