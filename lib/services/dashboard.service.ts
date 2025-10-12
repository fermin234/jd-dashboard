import { apiClient } from '../api-client'

export interface DashboardStats {
  totalProducts: number
  totalInvoices: number
  todayInvoices: number
  todaySales: number
  totalRevenue: number
  lowStockProducts: number
}

export const dashboardService = {
  // Obtener estadísticas generales del dashboard
  getStats: async (): Promise<DashboardStats> => {
    try {
      const stats = await apiClient.get<DashboardStats>('/statistics')
      
      // Convertir valores numéricos si vienen como strings
      return {
        totalProducts: Number(stats.totalProducts),
        totalInvoices: Number(stats.totalInvoices),
        todayInvoices: Number(stats.todayInvoices),
        todaySales: typeof stats.todaySales === 'string' ? parseFloat(stats.todaySales) : Number(stats.todaySales),
        totalRevenue: typeof stats.totalRevenue === 'string' ? parseFloat(stats.totalRevenue) : Number(stats.totalRevenue),
        lowStockProducts: Number(stats.lowStockProducts),
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      throw error
    }
  },
}
