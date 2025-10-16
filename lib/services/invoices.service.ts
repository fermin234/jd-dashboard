import { apiClient } from '../api-client'
import { Invoice, InvoiceWithItems, CreateInvoiceDto, UpdateInvoiceDto, InvoiceStats } from '../types'

export const invoicesService = {
  // Obtener todas las facturas
  getAll: async (): Promise<InvoiceWithItems[]> => {
    try {
      return await apiClient.get<InvoiceWithItems[]>('/invoices')
    } catch (error) {
      console.error('Error al obtener facturas:', error)
      throw new Error('No se pudieron cargar las facturas')
    }
  },

  // Obtener una factura por ID con sus items
  getById: async (id: string): Promise<InvoiceWithItems> => {
    try {
      return await apiClient.get<InvoiceWithItems>(`/invoices/${id}`)
    } catch (error) {
      console.error(`Error al obtener factura ${id}:`, error)
      throw new Error('No se pudo cargar la factura')
    }
  },

  // Obtener estadísticas de facturas
  getStats: async (): Promise<InvoiceStats> => {
    try {
      return await apiClient.get<InvoiceStats>('/invoices/stats')
    } catch (error) {
      console.error('Error al obtener estadísticas de facturas:', error)
      throw new Error('No se pudieron cargar las estadísticas de facturas')
    }
  },

  // Crear una nueva factura
  create: async (data: CreateInvoiceDto): Promise<Invoice> => {
    try {
      return await apiClient.post<Invoice>('/invoices', data)
    } catch (error) {
      console.error('Error al crear factura:', error)
      throw new Error('No se pudo crear la factura')
    }
  },

  // Actualizar una factura
  update: async (id: string, data: UpdateInvoiceDto): Promise<Invoice> => {
    try {
      return await apiClient.patch<Invoice>(`/invoices/${id}`, data)
    } catch (error) {
      console.error(`Error al actualizar factura ${id}:`, error)
      throw new Error('No se pudo actualizar la factura')
    }
  },

  // Completar una factura (descuenta el stock)
  complete: async (id: string): Promise<Invoice> => {
    try {
      return await apiClient.post<Invoice>(`/invoices/${id}/complete`)
    } catch (error) {
      console.error(`Error al completar factura ${id}:`, error)
      throw new Error('No se pudo completar la factura')
    }
  },

  // Cancelar una factura
  cancel: async (id: string): Promise<Invoice> => {
    try {
      return await apiClient.post<Invoice>(`/invoices/${id}/cancel`)
    } catch (error) {
      console.error(`Error al cancelar factura ${id}:`, error)
      throw new Error('No se pudo cancelar la factura')
    }
  },

  // Eliminar una factura
  delete: async (id: string): Promise<void> => {
    try {
      return await apiClient.delete<void>(`/invoices/${id}`)
    } catch (error) {
      console.error(`Error al eliminar factura ${id}:`, error)
      throw new Error('No se pudo eliminar la factura')
    }
  },
}
