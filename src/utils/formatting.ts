export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  });
}

export function formatTime(timeStr: string): string {
  const date = new Date(timeStr);
  return date.toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

export function formatDateTime(dateStr: string): string {
  return `${formatDate(dateStr)}, ${formatTime(dateStr)}`;
}

export function getRelativeTime(dateStr: string): string {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const daysDifference = Math.round((new Date(dateStr).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysDifference === 0) {
    const hoursDifference = Math.round((new Date(dateStr).getTime() - new Date().getTime()) / (1000 * 60 * 60));
    if (hoursDifference === 0) {
      const minutesDifference = Math.round((new Date(dateStr).getTime() - new Date().getTime()) / (1000 * 60));
      if (minutesDifference === 0) return 'just now';
      return rtf.format(minutesDifference, 'minute');
    }
    return rtf.format(hoursDifference, 'hour');
  }
  
  return rtf.format(daysDifference, 'day');
}

export function formatOrderNumber(num: number): string {
  return `#${num.toString().padStart(4, '0')}`;
}

export function getOrderStatusColor(status: string): string {
  switch (status.toUpperCase()) {
    case 'PENDING': return 'text-amber-500 bg-amber-100';
    case 'PREPARING': return 'text-blue-500 bg-blue-100';
    case 'READY': return 'text-purple-500 bg-purple-100';
    case 'SERVED': return 'text-green-500 bg-green-100';
    case 'COMPLETED': return 'text-emerald-600 bg-emerald-100';
    case 'CANCELLED': return 'text-red-500 bg-red-100';
    default: return 'text-gray-500 bg-gray-100';
  }
}

export function getTableStatusColor(status: string): string {
  switch (status.toUpperCase()) {
    case 'AVAILABLE': return 'text-green-600 bg-green-100 border-green-200';
    case 'OCCUPIED': return 'text-blue-600 bg-blue-100 border-blue-200';
    case 'RESERVED': return 'text-amber-600 bg-amber-100 border-amber-200';
    case 'DIRTY': return 'text-red-600 bg-red-100 border-red-200';
    case 'MAINTENANCE': return 'text-gray-600 bg-gray-100 border-gray-200';
    default: return 'text-gray-500 bg-gray-100 border-gray-200';
  }
}

export function getReservationStatusColor(status: string): string {
  switch (status.toUpperCase()) {
    case 'CONFIRMED': return 'text-green-600 bg-green-100';
    case 'PENDING': return 'text-amber-500 bg-amber-100';
    case 'SEATED': return 'text-blue-500 bg-blue-100';
    case 'CANCELLED': return 'text-red-500 bg-red-100';
    case 'NO_SHOW': return 'text-gray-500 bg-gray-100';
    default: return 'text-gray-500 bg-gray-100';
  }
}

export function getPaymentStatusColor(status: string): string {
  switch (status.toUpperCase()) {
    case 'PAID': return 'text-green-600 bg-green-100';
    case 'UNPAID': return 'text-amber-500 bg-amber-100';
    case 'PARTIAL': return 'text-blue-500 bg-blue-100';
    case 'REFUNDED': return 'text-gray-500 bg-gray-100';
    default: return 'text-gray-500 bg-gray-100';
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function generateId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;
}
