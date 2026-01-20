import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema(
  {
    name: { type: String, required: true },       // ชื่อจริง
    phone: { type: String, required: true, unique: true }, // เบอร์โทร (ใช้เป็น ID ล็อกอิน)
    password: { type: String, required: true },   // รหัสผ่าน
    role: { type: String, default: 'user' },      // user หรือ admin
  },
  { timestamps: true }
);

export const User = models.User || model('User', UserSchema);