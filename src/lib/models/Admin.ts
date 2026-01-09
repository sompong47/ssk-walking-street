import { Schema, model, models } from 'mongoose';

export interface IAdmin {
  _id?: string;
  username: string;
  email: string;
  password: string;
  role: 'super_admin' | 'admin' | 'manager';
  name: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    username: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true,
      index: true
    },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['super_admin', 'admin', 'manager'],
      default: 'admin'
    },
    name: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date, default: null },
  },
  { timestamps: true }
);

export const Admin = models.Admin || model<IAdmin>('Admin', AdminSchema);
