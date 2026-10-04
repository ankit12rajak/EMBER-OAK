import type { OrderItem } from '../types';

export const TAX_RATE = 0.05; // 5% GST
export const SERVICE_CHARGE_RATE = 0.10; // 10%

export function calcSubtotal(items: OrderItem[]): number {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

export function calcTax(subtotal: number): number {
  return subtotal * TAX_RATE;
}

export function calcServiceCharge(subtotal: number): number {
  return subtotal * SERVICE_CHARGE_RATE;
}

export function calcDiscount(subtotal: number, discountPercent: number): number {
  return subtotal * (discountPercent / 100);
}

export function calcTotal(subtotal: number, tax: number, serviceCharge: number, discount: number): number {
  return subtotal + tax + serviceCharge - discount;
}

export interface BillSummary {
  items: { name: string; quantity: number; price: number; total: number }[];
  subtotal: number;
  tax: number;
  serviceCharge: number;
  discount: number;
  total: number;
  roundedTotal: number;
}

export function generateBillSummary(items: OrderItem[], discountPercent: number = 0): BillSummary {
  const subtotal = calcSubtotal(items);
  const tax = calcTax(subtotal);
  const serviceCharge = calcServiceCharge(subtotal);
  const discount = calcDiscount(subtotal, discountPercent);
  const total = calcTotal(subtotal, tax, serviceCharge, discount);

  return {
    items: items.map(item => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity
    })),
    subtotal,
    tax,
    serviceCharge,
    discount,
    total,
    roundedTotal: Math.round(total)
  };
}
