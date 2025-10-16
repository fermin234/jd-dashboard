// Category types
export interface Category {
  id: string
  name: string
  imageUrl: string | null
  products?: Product[] | [] // Puede ser array vacío
  createdAt: string
  updatedAt: string
}

export interface CreateCategoryDto {
  name: string
  imageUrl?: string
  products?: Product[]
}

// Product types
export interface Product {
  id: string
  name: string
  barcode: string
  description: string | null
  price: number | string // Puede venir como string del backend
  stock: number
  categoryId?: string | null
  imageUrl: string | null
  galery: string[] | null // Puede ser null del backend
  createdAt: string
  updatedAt: string
  category?: Category | null // Puede ser null del backend
}

export interface CreateProductDto {
  name: string
  description?: string
  price: number
  stock?: number
  categoryId?: string
  imageUrl?: string
  galery?: string[]
}

export interface UpdateProductDto {
  name?: string
  description?: string
  price?: number
  stock?: number
  categoryId?: string
  imageUrl?: string
  galery?: string[]
}

export interface UpdateStockDto {
  quantity: number
}

// Invoice types
export interface InvoiceItem {
  id: string
  invoiceId: string
  productId: string
  quantity: number
  unitPrice: number
  subtotal: number
  createdAt: string
  product?: Product
}

export interface Invoice {
  id: string
  invoiceNumber: string
  subtotal: number
  tax: number
  total: number
  status: 'pending' | 'completed' | 'cancelled'
  customerName: string | null
  customerPhone: string | null
  customerEmail: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
}

export interface InvoiceWithItems extends Invoice {
  items: InvoiceItem[]
}

export interface CreateInvoiceDto {
  items: {
    productId: string
    quantity: number
  }[]
  customerName?: string
  customerPhone?: string
  customerEmail?: string
  notes?: string
}

export interface UpdateInvoiceDto {
  status?: 'pending' | 'completed' | 'cancelled'
  customerName?: string
  customerPhone?: string
  customerEmail?: string
  notes?: string
}

export interface InvoiceStats {
  totalInvoices: number
  completedInvoices: number
  pendingInvoices: number
  cancelledInvoices: number
  totalRevenue: number
}
