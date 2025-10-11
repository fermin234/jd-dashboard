import { useState, useEffect } from 'react'
import { invoicesService } from '@/lib/services'
import { Invoice, InvoiceWithItems, CreateInvoiceDto, UpdateInvoiceDto, InvoiceStats } from '@/lib/types'

export function useInvoices() {
  const [invoices, setInvoices] = useState<InvoiceWithItems[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchInvoices = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await invoicesService.getAll()
      // Convertir precios de string a number si es necesario
      const invoicesWithParsedPrices = data.map(invoice => ({
        ...invoice,
        subtotal: typeof invoice.subtotal === 'string' ? parseFloat(invoice.subtotal) : invoice.subtotal,
        tax: typeof invoice.tax === 'string' ? parseFloat(invoice.tax) : invoice.tax,
        total: typeof invoice.total === 'string' ? parseFloat(invoice.total) : invoice.total,
        items: invoice.items?.map(item => ({
          ...item,
          unitPrice: typeof item.unitPrice === 'string' ? parseFloat(item.unitPrice) : item.unitPrice,
          subtotal: typeof item.subtotal === 'string' ? parseFloat(item.subtotal) : item.subtotal,
          product: item.product ? {
            ...item.product,
            price: typeof item.product.price === 'string' ? parseFloat(item.product.price) : item.product.price
          } : undefined
        })) || []
      }))
      setInvoices(invoicesWithParsedPrices)
    } catch (err: any) {
      setError(err.message || 'Error al cargar las facturas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInvoices()
  }, [])

  const getInvoiceById = async (id: string): Promise<InvoiceWithItems> => {
    try {
      const invoice = await invoicesService.getById(id)
      return {
        ...invoice,
        subtotal: typeof invoice.subtotal === 'string' ? parseFloat(invoice.subtotal) : invoice.subtotal,
        tax: typeof invoice.tax === 'string' ? parseFloat(invoice.tax) : invoice.tax,
        total: typeof invoice.total === 'string' ? parseFloat(invoice.total) : invoice.total,
        items: invoice.items?.map(item => ({
          ...item,
          unitPrice: typeof item.unitPrice === 'string' ? parseFloat(item.unitPrice) : item.unitPrice,
          subtotal: typeof item.subtotal === 'string' ? parseFloat(item.subtotal) : item.subtotal,
          product: item.product ? {
            ...item.product,
            price: typeof item.product.price === 'string' ? parseFloat(item.product.price) : item.product.price
          } : undefined
        })) || []
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar la factura')
      throw err
    }
  }

  const getStats = async (): Promise<InvoiceStats> => {
    try {
      const stats = await invoicesService.getStats()
      return stats
    } catch (err: any) {
      setError(err.message || 'Error al cargar las estadísticas')
      throw err
    }
  }

  const createInvoice = async (data: CreateInvoiceDto) => {
    try {
      const newInvoice = await invoicesService.create(data)
      await fetchInvoices() // Recargar para obtener los items completos
      return newInvoice
    } catch (err: any) {
      setError(err.message || 'Error al crear la factura')
      throw err
    }
  }

  const updateInvoice = async (id: string, data: UpdateInvoiceDto) => {
    try {
      const updatedInvoice = await invoicesService.update(id, data)
      const invoiceWithParsedPrices = {
        ...updatedInvoice,
        subtotal: typeof updatedInvoice.subtotal === 'string' ? parseFloat(updatedInvoice.subtotal) : updatedInvoice.subtotal,
        tax: typeof updatedInvoice.tax === 'string' ? parseFloat(updatedInvoice.tax) : updatedInvoice.tax,
        total: typeof updatedInvoice.total === 'string' ? parseFloat(updatedInvoice.total) : updatedInvoice.total,
      }
      setInvoices(invoices.map(i => i.id === id ? { ...i, ...invoiceWithParsedPrices } : i))
      return invoiceWithParsedPrices
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la factura')
      throw err
    }
  }

  const completeInvoice = async (id: string) => {
    try {
      const completedInvoice = await invoicesService.complete(id)
      const invoiceWithParsedPrices = {
        ...completedInvoice,
        subtotal: typeof completedInvoice.subtotal === 'string' ? parseFloat(completedInvoice.subtotal) : completedInvoice.subtotal,
        tax: typeof completedInvoice.tax === 'string' ? parseFloat(completedInvoice.tax) : completedInvoice.tax,
        total: typeof completedInvoice.total === 'string' ? parseFloat(completedInvoice.total) : completedInvoice.total,
      }
      setInvoices(invoices.map(i => i.id === id ? { ...i, ...invoiceWithParsedPrices } : i))
      return invoiceWithParsedPrices
    } catch (err: any) {
      setError(err.message || 'Error al completar la factura')
      throw err
    }
  }

  const cancelInvoice = async (id: string) => {
    try {
      const cancelledInvoice = await invoicesService.cancel(id)
      const invoiceWithParsedPrices = {
        ...cancelledInvoice,
        subtotal: typeof cancelledInvoice.subtotal === 'string' ? parseFloat(cancelledInvoice.subtotal) : cancelledInvoice.subtotal,
        tax: typeof cancelledInvoice.tax === 'string' ? parseFloat(cancelledInvoice.tax) : cancelledInvoice.tax,
        total: typeof cancelledInvoice.total === 'string' ? parseFloat(cancelledInvoice.total) : cancelledInvoice.total,
      }
      setInvoices(invoices.map(i => i.id === id ? { ...i, ...invoiceWithParsedPrices } : i))
      return invoiceWithParsedPrices
    } catch (err: any) {
      setError(err.message || 'Error al cancelar la factura')
      throw err
    }
  }

  const deleteInvoice = async (id: string) => {
    try {
      await invoicesService.delete(id)
      setInvoices(invoices.filter(i => i.id !== id))
    } catch (err: any) {
      setError(err.message || 'Error al eliminar la factura')
      throw err
    }
  }

  return {
    invoices,
    loading,
    error,
    fetchInvoices,
    getInvoiceById,
    getStats,
    createInvoice,
    updateInvoice,
    completeInvoice,
    cancelInvoice,
    deleteInvoice,
  }
}
