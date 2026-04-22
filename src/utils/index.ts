import {
  Invoice,
  InvoiceFormData,
  InvoiceItem,
  InvoiceItemFormData,
  InvoiceStatus,
} from "../types";

export function generateId(): string {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const letter1 = letters[Math.floor(Math.random() * 26)];
  const letter2 = letters[Math.floor(Math.random() * 26)];
  const number = String(Math.floor(1000 + Math.random() * 9000));
  return `${letter1}${letter2}${number}`;
}

export function formatDate(dateString: string): string {
  if (!dateString) return "—";
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export const OPTIONS: { value: InvoiceStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
];

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function addDays(dateString: string, days: number): string {
  if (!dateString) return "";
  const date = new Date(dateString + "T00:00:00");
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}

export function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

export function calculateItemTotal(quantity: number, price: number): number {
  return Number((quantity * price).toFixed(2));
}

export function calculateInvoiceTotal(items: InvoiceItem[]): number {
  return Number(items.reduce((sum, item) => sum + item.total, 0).toFixed(2));
}

export function formDataToItem(formItem: InvoiceItemFormData): InvoiceItem {
  const total = calculateItemTotal(formItem.quantity, formItem.price);
  return {
    id: formItem.id,
    name: formItem.name,
    quantity: formItem.quantity,
    price: formItem.price,
    total,
  };
}

export function formDataToInvoice(
  formData: InvoiceFormData,
  status: InvoiceStatus,
  existingId?: string,
): Invoice {
  const items = formData.items.map(formDataToItem);
  const total = calculateInvoiceTotal(items);
  const paymentDue = addDays(formData.createdAt, formData.paymentTerms);

  return {
    id: existingId || generateId(),
    createdAt: formData.createdAt,
    paymentDue,
    description: formData.description,
    paymentTerms: formData.paymentTerms,
    clientName: formData.clientName,
    clientEmail: formData.clientEmail,
    status,
    senderAddress: formData.senderAddress,
    clientAddress: formData.clientAddress,
    items,
    total,
  };
}

export function invoiceToFormData(invoice: Invoice): InvoiceFormData {
  return {
    senderAddress: { ...invoice.senderAddress },
    clientName: invoice.clientName,
    clientEmail: invoice.clientEmail,
    clientAddress: { ...invoice.clientAddress },
    createdAt: invoice.createdAt,
    paymentTerms: invoice.paymentTerms,
    description: invoice.description,
    items: invoice.items.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    })),
  };
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function getStatusLabel(status: InvoiceStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}
