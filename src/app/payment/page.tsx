'use client';

import { useState, useEffect } from 'react';
import styles from './payment.module.css';

interface Payment {
  _id: string;
  bookingId: {
    _id: string;
    lotId: {
      lotNumber: string;
      section: string;
    };
    vendorName: string;
  };
  amount: number;
  status: 'pending' | 'success' | 'failed';
  paymentMethod: string;
  transactionId?: string;
  receiptUrl?: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
}

export default function PaymentPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [showModal, setShowModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  useEffect(() => {
    fetchPayments();
  }, [filter]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const query = filter !== 'all' ? `?status=${filter}` : '';
      const response = await fetch(`/api/payments${query}`);
      const data = await response.json();
      if (data.success) {
        setPayments(data.data);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (paymentId: string) => {
    // Redirect to payment gateway or show payment modal
    alert(`เปิดหน้าชำระเงินสำหรับ ID: ${paymentId}`);
  };

  const handleDownloadReceipt = (payment: Payment) => {
    if (payment.receiptUrl) {
      window.open(payment.receiptUrl, '_blank');
    } else {
      alert('กำลังสร้างใบเสร็จ...');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return '#27ae60';
      case 'pending':
        return '#f39c12';
      case 'failed':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success':
        return 'ชำระแล้ว';
      case 'pending':
        return 'รอชำระ';
      case 'failed':
        return 'ล้มเหลว';
      default:
        return status;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'credit card':
        return '💳';
      case 'bank transfer':
        return '🏦';
      case 'promptpay':
        return '📱';
      case 'cash':
        return '💵';
      default:
        return '💰';
    }
  };

  const filteredPayments = payments
    .filter(payment => 
      payment.bookingId?.vendorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionId?.includes(searchTerm) ||
      payment._id.includes(searchTerm)
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return b.amount - a.amount;
      }
    });

  const stats = {
    total: payments.reduce((sum, p) => sum + p.amount, 0),
    success: payments.filter(p => p.status === 'success').reduce((sum, p) => sum + p.amount, 0),
    pending: payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
    count: {
      all: payments.length,
      success: payments.filter(p => p.status === 'success').length,
      pending: payments.filter(p => p.status === 'pending').length,
      failed: payments.filter(p => p.status === 'failed').length,
    }
  };

  return (
    <div className={styles.container}>
      {/* Header with Stats */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>ประวัติการชำระเงิน</h1>
          <p>ดูสถานะการชำระเงินและรายการทั้งหมด</p>
        </div>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/>
              </svg>
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>ยอดรวมทั้งหมด</span>
              <span className={styles.statValue}>{stats.total.toLocaleString()} ฿</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #27ae60 0%, #229954 100%)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
              </svg>
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>ชำระแล้ว</span>
              <span className={styles.statValue}>{stats.success.toLocaleString()} ฿</span>
              <span className={styles.statCount}>({stats.count.success} รายการ)</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z"/>
              </svg>
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>รอชำระ</span>
              <span className={styles.statValue}>{stats.pending.toLocaleString()} ฿</span>
              <span className={styles.statCount}>({stats.count.pending} รายการ)</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M14.59 8L12 10.59 9.41 8 8 9.41 10.59 12 8 14.59 9.41 16 12 13.41 14.59 16 16 14.59 13.41 12 16 9.41 14.59 8zM12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              </svg>
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>รายการทั้งหมด</span>
              <span className={styles.statValue}>{stats.count.all}</span>
              <span className={styles.statCount}>รายการ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="ค้นหาด้วยชื่อ, Transaction ID, หรือ Payment ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterSort}>
          <div className={styles.filters}>
            <button 
              className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
              onClick={() => setFilter('all')}
            >
              ทั้งหมด ({stats.count.all})
            </button>
            <button 
              className={`${styles.filterBtn} ${filter === 'pending' ? styles.active : ''}`}
              onClick={() => setFilter('pending')}
            >
              รอชำระ ({stats.count.pending})
            </button>
            <button 
              className={`${styles.filterBtn} ${filter === 'success' ? styles.active : ''}`}
              onClick={() => setFilter('success')}
            >
              สำเร็จ ({stats.count.success})
            </button>
            <button 
              className={`${styles.filterBtn} ${filter === 'failed' ? styles.active : ''}`}
              onClick={() => setFilter('failed')}
            >
              ล้มเหลว ({stats.count.failed})
            </button>
          </div>

          <div className={styles.sortSection}>
            <label>เรียงตาม:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}
              className={styles.sortSelect}
            >
              <option value="date">วันที่ล่าสุด</option>
              <option value="amount">จำนวนเงิน</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payment List */}
      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>กำลังโหลด...</p>
        </div>
      ) : filteredPayments.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>💳</div>
          <h3>ไม่พบรายการชำระเงิน</h3>
          <p>ยังไม่มีประวัติการชำระเงินในระบบ</p>
        </div>
      ) : (
        <div className={styles.paymentsList}>
          {filteredPayments.map((payment) => (
            <div key={payment._id} className={styles.paymentCard}>
              <div className={styles.cardHeader}>
                <div className={styles.headerLeft}>
                  <div className={styles.paymentInfo}>
                    <h3>
                      {getPaymentMethodIcon(payment.paymentMethod)} {payment.paymentMethod}
                    </h3>
                    {payment.bookingId && (
                      <span className={styles.lotInfo}>
                        ล็อค #{payment.bookingId.lotId.lotNumber} - {payment.bookingId.lotId.section}
                      </span>
                    )}
                  </div>
                </div>
                <div className={styles.headerRight}>
                  <span 
                    className={styles.statusBadge}
                    style={{ background: getStatusColor(payment.status) }}
                  >
                    {getStatusText(payment.status)}
                  </span>
                  <span className={styles.paymentId}>ID: {payment._id.slice(-8)}</span>
                </div>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.amountSection}>
                  <div className={styles.amount}>
                    <span className={styles.amountLabel}>จำนวนเงิน</span>
                    <span className={styles.amountValue}>{payment.amount.toLocaleString()} บาท</span>
                  </div>
                  {payment.dueDate && payment.status === 'pending' && (
                    <div className={styles.dueDate}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z"/>
                      </svg>
                      ครบกำหนด: {new Date(payment.dueDate).toLocaleDateString('th-TH')}
                    </div>
                  )}
                </div>

                <div className={styles.detailsGrid}>
                  {payment.bookingId && (
                    <div className={styles.detail}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                      <div>
                        <label>ผู้จอง</label>
                        <span>{payment.bookingId.vendorName}</span>
                      </div>
                    </div>
                  )}

                  {payment.transactionId && (
                    <div className={styles.detail}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                      </svg>
                      <div>
                        <label>Transaction ID</label>
                        <span className={styles.transactionId}>{payment.transactionId}</span>
                      </div>
                    </div>
                  )}

                  <div className={styles.detail}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
                    </svg>
                    <div>
                      <label>วันที่ชำระ</label>
                      <span>{new Date(payment.createdAt).toLocaleString('th-TH')}</span>
                    </div>
                  </div>

                  {payment.status === 'success' && (
                    <div className={styles.detail}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                      </svg>
                      <div>
                        <label>อัปเดตล่าสุด</label>
                        <span>{new Date(payment.updatedAt).toLocaleString('th-TH')}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.cardActions}>
                <button 
                  className={styles.viewBtn}
                  onClick={() => {
                    setSelectedPayment(payment);
                    setShowModal(true);
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  </svg>
                  รายละเอียด
                </button>

                {payment.status === 'pending' && (
                  <button 
                    className={styles.payBtn}
                    onClick={() => handlePayment(payment._id)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                    </svg>
                    ชำระเงิน
                  </button>
                )}

                {payment.status === 'success' && (
                  <button 
                    className={styles.receiptBtn}
                    onClick={() => handleDownloadReceipt(payment)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2v9.67z"/>
                    </svg>
                    ดาวน์โหลดใบเสร็จ
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {showModal && selectedPayment && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>รายละเอียดการชำระเงิน</h2>
              <button 
                className={styles.closeBtn}
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.modalRow}>
                <label>Payment ID:</label>
                <span>{selectedPayment._id}</span>
              </div>
              <div className={styles.modalRow}>
                <label>จำนวนเงิน:</label>
                <span className={styles.modalAmount}>{selectedPayment.amount.toLocaleString()} บาท</span>
              </div>
              <div className={styles.modalRow}>
                <label>วิธีชำระเงิน:</label>
                <span>{getPaymentMethodIcon(selectedPayment.paymentMethod)} {selectedPayment.paymentMethod}</span>
              </div>
              <div className={styles.modalRow}>
                <label>สถานะ:</label>
                <span 
                  className={styles.statusBadge}
                  style={{ background: getStatusColor(selectedPayment.status) }}
                >
                  {getStatusText(selectedPayment.status)}
                </span>
              </div>
              {selectedPayment.transactionId && (
                <div className={styles.modalRow}>
                  <label>Transaction ID:</label>
                  <span className={styles.transactionId}>{selectedPayment.transactionId}</span>
                </div>
              )}
              <div className={styles.modalRow}>
                <label>วันที่ทำรายการ:</label>
                <span>{new Date(selectedPayment.createdAt).toLocaleString('th-TH')}</span>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button 
                className={styles.modalCloseBtn}
                onClick={() => setShowModal(false)}
              >
                ปิด
              </button>
              {selectedPayment.status === 'success' && (
                <button 
                  className={styles.modalDownloadBtn}
                  onClick={() => handleDownloadReceipt(selectedPayment)}
                >
                  ดาวน์โหลดใบเสร็จ
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}