export const MARKET_CONFIG = {
  STREET_LENGTH: 450, // เมตร
  LANE_COUNT: 2,
  LOT_WIDTH: 2.4, // เมตร
  LOT_LENGTH: 3.5, // เมตร
  DEFAULT_PRICE: 500, // บาท/เดือน
  DEFAULT_CURRENCY: 'THB',
};

export const LOT_STATUS = {
  AVAILABLE: 'available',
  BOOKED: 'booked',
  RESERVED: 'reserved',
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  BANK_TRANSFER: 'bank_transfer',
  CASH: 'cash',
  QR_CODE: 'qr_code',
} as const;