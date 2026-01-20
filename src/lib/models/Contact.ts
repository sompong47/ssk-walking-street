import mongoose, { Schema, model, models } from 'mongoose';

const ContactSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['unread', 'read', 'replied'], 
      default: 'unread' 
    }, // unread=ยังไม่ดู, read=ดูแล้ว, replied=ติดต่อกลับแล้ว
  },
  { timestamps: true }
);

export const Contact = models.Contact || model('Contact', ContactSchema);