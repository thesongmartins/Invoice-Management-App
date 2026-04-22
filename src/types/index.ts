export type InvoiceStatus = "draft" | "pending" | "paid";

export interface InvoiceState {
  invoices: Invoice[];
  filterStatus: FilterStatus[];
  isLoading: boolean;
}

export interface StatusBadgeProps {
  status: InvoiceStatus;
}

export type Action =
  | { type: "SET_INVOICES"; payload: Invoice[] }
  | { type: "ADD_INVOICE"; payload: Invoice }
  | { type: "UPDATE_INVOICE"; payload: Invoice }
  | { type: "DELETE_INVOICE"; payload: string }
  | { type: "MARK_PAID"; payload: string }
  | { type: "SEND_INVOICE"; payload: string }
  | { type: "SET_FILTER"; payload: FilterStatus[] }
  | { type: "SET_LOADING"; payload: boolean };

export interface Address {
  street: string;
  city: string;
  postCode: string;
  country: string;
}

export interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export type Theme = "light" | "dark";
export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

export interface Invoice {
  id: string;
  createdAt: string;
  paymentDue: string;
  description: string;
  paymentTerms: number;
  clientName: string;
  clientEmail: string;
  status: InvoiceStatus;
  senderAddress: Address;
  clientAddress: Address;
  items: InvoiceItem[];
  total: number;
}

export interface InvoiceFormData {
  senderAddress: Address;
  clientName: string;
  clientEmail: string;
  clientAddress: Address;
  createdAt: string;
  paymentTerms: number;
  description: string;
  items: InvoiceItemFormData[];
}

export interface InvoiceItemFormData {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export type FilterStatus = InvoiceStatus | "all";

export interface SelectOption {
  value: number | string;
  label: string;
}

export interface CustomSelectProps {
  id: string;
  label: string;
  value: number | string;
  onChange: (value: number) => void;
  options: SelectOption[];
  error?: string;
}

export interface DatePickerProps {
  id: string;
  label: string;
  value: string; // "YYYY-MM-DD"
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export interface DeleteModalProps {
  invoiceId: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export interface FilterDropdownProps {
  selected: FilterStatus[];
  onChange: (statuses: FilterStatus[]) => void;
}
