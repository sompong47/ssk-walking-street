import { ILot } from './models/Lot';
import { IBooking } from './models/Booking';
import { IPayment } from './models/Payment';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sort?: string;
}

export interface FilterParams {
  status?: string;
  startDate?: Date;
  endDate?: Date;
  paymentStatus?: string;
}

export interface LotDetailWithBooking extends ILot {
  booking?: IBooking & { payment?: IPayment };
}

export interface DashboardStats {
  totalLots: number;
  availableLots: number;
  bookedLots: number;
  reservedLots: number;
  totalRevenue: number;
  totalBookings: number;
  completedPayments: number;
  pendingPayments: number;
  recentBookings: (IBooking & { lot: ILot })[];
}
