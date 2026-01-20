import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, message: 'ไม่พบไฟล์' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // ตั้งชื่อไฟล์ใหม่ด้วยเวลาปัจจุบัน (กันชื่อซ้ำ)
    const filename = `slip-${Date.now()}${path.extname(file.name)}`;
    
    // กำหนด Path ไปที่ public/uploads
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    
    // สร้างโฟลเดอร์ uploads ถ้ายังไม่มี
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      // โฟลเดอร์มีอยู่แล้ว ไม่ต้องทำอะไร
    }

    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    return NextResponse.json({ success: true, url: `/uploads/${filename}` });

  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ success: false, message: 'อัปโหลดล้มเหลว' }, { status: 500 });
  }
}