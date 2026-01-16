import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, message: 'ไม่พบไฟล์' }, { status: 400 });
    }

    // แปลงไฟล์เป็น Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // ตั้งชื่อไฟล์ใหม่ (กันชื่อซ้ำ) เช่น slip-123456789.jpg
    const filename = `slip-${Date.now()}${path.extname(file.name)}`;
    
    // ระบุปลายทางที่จะบันทึก (ไปที่ public/uploads)
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    const filePath = path.join(uploadDir, filename);

    // บันทึกไฟล์
    await writeFile(filePath, buffer);

    // ส่ง URL กลับไปให้หน้าเว็บ
    const fileUrl = `/uploads/${filename}`;
    
    return NextResponse.json({ success: true, url: fileUrl });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'อัปโหลดล้มเหลว' }, { status: 500 });
  }
}