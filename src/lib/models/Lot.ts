import { Schema, model, models } from 'mongoose';

export interface ILot {
  _id: string;
  lotNumber: string;
  section: string;
  status: 'available' | 'reserved' | 'booked';
  price: number;
  size: number;
  width?: number;
  length?: number;
  location: string;
  vendor?: string;
  vendorPhone?: string;
  description?: string;
  amenities?: string[];
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const LotSchema = new Schema<ILot>(
  {
    lotNumber: { 
      type: String, 
      required: true, 
      unique: true,
      index: true
    },
    section: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: ['available', 'reserved', 'booked'],
      default: 'available',
      index: true
    },
    price: { type: Number, required: true },
    size: { type: Number, required: true },
    width: { type: Number, default: 0 },
    length: { type: Number, default: 0 },
    location: { type: String, required: true },
    vendor: { type: String, default: null },
    vendorPhone: { type: String, default: null },
    description: { type: String, default: null },
    amenities: [{ type: String }],
    imageUrl: { type: String, default: null },
  },
  { timestamps: true }
);

export const Lot = models.Lot || model<ILot>('Lot', LotSchema);
