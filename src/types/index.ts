export type InvoiceStatus = 'draft' | 'pending' | 'paid'

export interface Address {
  street: string
  city: string
  postCode: string
  country: string
}

export interface InvoiceItem {
  id: string
  name: string
  quantity: number
  price: number
  total: number
}

export interface Invoice {
  id: string
  createdAt: string
  paymentDue: string
  description: string
  paymentTerms: number
  clientName: string
  clientEmail: string
  status: InvoiceStatus
  senderAddress: Address
  clientAddress: Address
  items: InvoiceItem[]
  total: number
}

export interface InvoiceFormData {
  senderAddress: Address
  clientName: string
  clientEmail: string
  clientAddress: Address
  createdAt: string
  paymentTerms: number
  description: string
  items: InvoiceItemFormData[]
}

export interface InvoiceItemFormData {
  id: string
  name: string
  quantity: number
  price: number
}

export type FilterStatus = InvoiceStatus | 'all'
