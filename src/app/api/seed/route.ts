import { connectDB } from '@/lib/mongodb';
import { Lot } from '@/lib/models/Lot';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB();
    await Lot.deleteMany({});

    const lots = [];
    const rows = [
      { id: 'rowA', name: 'A', loc: 'แถว A (ริมซ้าย)', price: 100 },
      { id: 'rowB', name: 'B', loc: 'แถว B (กลางซ้าย)', price: 150 },
      { id: 'rowC', name: 'C', loc: 'แถว C (กลางขวา)', price: 150 },
      { id: 'rowD', name: 'D', loc: 'แถว D (ริมขวา)', price: 100 },
    ];

    // 🟢 ปรับใหม่: เอาแค่ 25 ล็อคต่อแถว (รวม 4 แถว = 100 ล็อค)
    const totalSlots = 25; 
    
    // แบ่งระยะ: ล็อคที่ 1-15 ขายวันเสาร์ได้, ล็อคที่ 16-25 ขายวันอาทิตย์
    const standardLimit = 15; 

    for (const row of rows) {
      for (let i = 1; i <= totalSlots; i++) {
        const isStandard = i <= standardLimit;
        lots.push({
          lotNumber: `${row.name}${i.toString().padStart(2, '0')}`, // เช่น A01, A02 (ลดเลข 0 ลงตัวนึงดูง่ายขึ้น)
          section: row.id,
          location: row.loc,
          size: '2x2 เมตร',
          price: row.price,
          status: Math.random() > 0.8 ? 'reserved' : 'available',
          zoneType: isStandard ? 'standard' : 'extended' 
        });
      }
    }

    await Lot.insertMany(lots);

    return NextResponse.json({ 
      success: true, 
      message: `✅ รีเซ็ตข้อมูลใหม่เหลือ 100 ล็อค (ดูง่ายสบายตา) เรียบร้อยแล้ว` 
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}