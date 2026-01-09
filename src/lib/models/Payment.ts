import { Schema, model, models } from 'mongoose';

export interface IPayment {
  _id?: string;
  bookingId: string;
  amount: number;
  paymentMethod: 'credit_card' | 'bank_transfer' | 'cash' | 'qr_code';
  transactionId: string;
  status: 'pending' | 'success' | 'failed';
  paidDate?: Date;
  bankName?: string;
  accountName?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    bookingId: { 
      type: 'String',
      ref: 'Booking', 
      required: true,
      index: true
    },
    amount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'bank_transfer', 'cash', 'qr_code'],
      required: true
    },
    transactionId: { 
      type: String, 
      unique: true,
      sparse: true 
    },
    status: {
      type: String,
      enum: ['pending', 'success', 'failed'],
      default: 'pending',
      index: true
    },
    paidDate: { type: Date, default: null },
    bankName: { type: String, default: null },
    accountName: { type: String, default: null },
  },
  { timestamps: true }
);

export const Payment = models.Payment || model<IPayment>('Payment', PaymentSchema);
