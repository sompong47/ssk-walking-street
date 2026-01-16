import mongoose, { Schema, Document } from 'mongoose';

export interface ILot extends Document {
  lotNumber: string;
  // 🟢 แก้: เปลี่ยน section เป็น 4 แถว
  section: 'rowA' | 'rowB' | 'rowC' | 'rowD';
  location: string;
  size: string;
  price: number;
  status: 'available' | 'reserved' | 'maintenance';
  zoneType: 'standard' | 'extended';
}

const LotSchema = new Schema<ILot>({
  lotNumber: { type: String, required: true },
  // 🟢 แก้: อัปเดต enum ให้ตรงกับ interface
  section: { 
    type: String, 
    enum: ['rowA', 'rowB', 'rowC', 'rowD'], 
    required: true 
  },
  location: { type: String, required: true },
  size: { type: String, required: true },
  price: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['available', 'reserved', 'maintenance'], 
    default: 'available' 
  },
  zoneType: { type: String, enum: ['standard', 'extended'], required: true }, 
});

export const Lot = mongoose.models.Lot || mongoose.model<ILot>('Lot', LotSchema);