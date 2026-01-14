import mongoose, { Schema, model, models } from 'mongoose';

export interface IBooking {
  _id?: string;
  lotId: mongoose.Types.ObjectId; // 🟢 แก้เป็น ObjectId
  vendorName: string;
  vendorPhone: string;
  vendorEmail: string;
  businessType: string;
  businessDescription?: string;   // 🟢 เพิ่มฟิลด์นี้ (มาจากฟอร์ม)
  startDate: Date;
  endDate: Date;
  paymentStatus: 'pending' | 'completed' | 'failed';
  notes?: string;                 // เก็บไว้เผื่อใช้ในอนาคต (Admin note)
  createdAt?: Date;
  updatedAt?: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    lotId: { 
      type: Schema.Types.ObjectId, // 🟢 ใช้ ObjectId เพื่อลิงก์กับตาราง Lot
      ref: 'Lot', 
      required: true,
      index: true
    },
    vendorName: { type: String, required: true },
    vendorPhone: { type: String, required: true },
    vendorEmail: { type: String, required: true, lowercase: true },
    businessType: { type: String, required: true },
    businessDescription: { type: String }, // 🟢 เพิ่มให้ตรงกับ Interface
    startDate: { type: Date, required: true },
    endDate: { type: Date, default: null },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
      index: true
    },
    notes: { type: String, default: null },
  },
  { timestamps: true }
);

export const Booking = models.Booking || model<IBooking>('Booking', BookingSchema);