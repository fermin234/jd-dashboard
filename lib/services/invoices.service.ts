import { apiClient } from '../api-client'
import { Invoice, InvoiceWithItems, CreateInvoiceDto, UpdateInvoiceDto, InvoiceStats } from '../types'

export const invoicesService = {
  // Obtener todas las facturas
  getAll: async (): Promise<InvoiceWithItems[]> => {
    return apiClient.get<InvoiceWithItems[]>('/invoices')
  },

  // Obtener una factura por ID con sus items
  getById: async (id: string): Promise<InvoiceWithItems> => {
    return apiClient.get<InvoiceWithItems>(`/invoices/${id}`)
  },

  // Obtener estadísticas de facturas
  getStats: async (): Promise<InvoiceStats> => {
    return apiClient.get<InvoiceStats>('/invoices/stats')
  },

  // Crear una nueva factura
  create: async (data: CreateInvoiceDto): Promise<Invoice> => {
    return apiClient.post<Invoice>('/invoices', data)
  },

  // Actualizar una factura
  update: async (id: string, data: UpdateInvoiceDto): Promise<Invoice> => {
    return apiClient.patch<Invoice>(`/invoices/${id}`, data)
  },

  // Completar una factura (descuenta el stock)
  complete: async (id: string): Promise<Invoice> => {
    return apiClient.post<Invoice>(`/invoices/${id}/complete`)
  },

  // Cancelar una factura
  cancel: async (id: string): Promise<Invoice> => {
    return apiClient.post<Invoice>(`/invoices/${id}/cancel`)
  },

  // Eliminar una factura
  delete: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/invoices/${id}`)
  },
}
