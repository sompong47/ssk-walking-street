'use client';

import { useState, useEffect } from 'react';
import styles from './messages.module.css';

interface ContactMsg {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactMsg[]>([]);
  const [loading, setLoading] = useState(true);

  // ดึงข้อมูล
  const fetchMessages = async () => {
    const res = await fetch('/api/contact');
    const data = await res.json();
    if (data.success) setMessages(data.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // ฟังก์ชันเปลี่ยนสถานะ (เช่น กดว่าติดต่อแล้ว)
  const updateStatus = async (id: string, newStatus: string) => {
    await fetch(`/api/contact/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    fetchMessages(); // โหลดใหม่ให้สถานะเปลี่ยน
  };

  // ฟังก์ชันลบ
  const handleDelete = async (id: string) => {
    if (!confirm('ต้องการลบข้อความนี้?')) return;
    await fetch(`/api/contact/${id}`, { method: 'DELETE' });
    fetchMessages();
  };

  if (loading) return <div style={{padding: 40, textAlign:'center'}}>กำลังโหลดข้อความ...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>📬 กล่องข้อความจากลูกค้า</h1>
        <button className={styles.backBtn} onClick={() => window.location.href = '/admin'}>
            ← กลับ Dashboard
        </button>
      </div>

      <div className={styles.grid}>
        {messages.map((msg) => (
          <div key={msg._id} className={`${styles.card} ${msg.status === 'unread' ? styles.unread : ''}`}>
            
            <div className={styles.cardHeader}>
               <div className={styles.sender}>
                 <strong>{msg.name}</strong> 
                 <span className={styles.date}>{new Date(msg.createdAt).toLocaleString('th-TH')}</span>
               </div>
               <div className={styles.statusBadge} data-status={msg.status}>
                 {msg.status === 'unread' ? '🔴 ยังไม่อ่าน' : msg.status === 'replied' ? '✅ ติดต่อแล้ว' : '👀 อ่านแล้ว'}
               </div>
            </div>

            <div className={styles.subject}>หัวข้อ: {msg.subject}</div>
            <p className={styles.message}>"{msg.message}"</p>

            <div className={styles.contactInfo}>
               <span>📞 {msg.phone}</span>
               <span>📧 {msg.email}</span>
            </div>

            <div className={styles.actions}>
               {/* ปุ่มเปลี่ยนสถานะ */}
               {msg.status !== 'replied' && (
                 <button 
                    className={styles.replyBtn} 
                    onClick={() => updateStatus(msg._id, 'replied')}
                 >
                    📞 กดเมื่อติดต่อกลับแล้ว
                 </button>
               )}
               
               {msg.status === 'unread' && (
                 <button 
                    className={styles.readBtn} 
                    onClick={() => updateStatus(msg._id, 'read')}
                 >
                    รับทราบ
                 </button>
               )}

               <button className={styles.deleteBtn} onClick={() => handleDelete(msg._id)}>
                 🗑️ ลบ
               </button>
            </div>
          </div>
        ))}

        {messages.length === 0 && <p className={styles.empty}>ไม่มีข้อความใหม่</p>}
      </div>
    </div>
  );
}