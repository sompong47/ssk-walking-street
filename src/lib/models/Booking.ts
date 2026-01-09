import { Schema, model, models } from 'mongoose';

export interface IBooking {
  _id?: string;
  lotId: string;
  vendorName: string;
  vendorPhone: string;
  vendorEmail: string;
  businessType: string;
  startDate: Date;
  endDate?: Date;
  paymentStatus: 'pending' | 'completed' | 'failed';
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    lotId: { 
      type: 'String',
      ref: 'Lot', 
      required: true,
      index: true
    },
    vendorName: { type: String, required: true },
    vendorPhone: { type: String, required: true },
    vendorEmail: { type: String, required: true, lowercase: true },
    businessType: { type: String, required: true },
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
