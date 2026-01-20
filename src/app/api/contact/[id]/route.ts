import { connectDB } from '@/lib/mongodb';
import { Contact } from '@/lib/models/Contact';
import { NextResponse } from 'next/server';

// PATCH: แอดมินเปลี่ยนสถานะ (เช่น unread -> replied)
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const body = await request.json(); // ส่ง { status: 'replied' } มา
  
  await Contact.findByIdAndUpdate(params.id, body);
  return NextResponse.json({ success: true });
}

// DELETE: ลบข้อความขยะ
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await connectDB();
  await Contact.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}