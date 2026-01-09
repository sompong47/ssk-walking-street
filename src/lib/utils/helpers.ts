export function generateTransactionId(): string {
  return `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function formatCurrency(amount: number, currency: string = 'THB'): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateTime(date: Date | string): string {
  return new Date(date).toLocaleString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function calculateLotsPerRow(streetLength: number, lotWidth: number): number {
  return Math.floor(streetLength / lotWidth);
}

export function calculateTotalLots(streetLength: number, lotWidth: number, laneCount: number): number {
  const lotsPerLane = calculateLotsPerRow(streetLength, lotWidth);
  return lotsPerLane * laneCount;
}