"use client"

import { Package, FileText, TrendingUp, DollarSign, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useDashboard } from "@/hooks/use-dashboard"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  const { stats, loading, error } = useDashboard()

  if (error) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Bienvenido al sistema de gestión de tu tienda</p>
        </div>
        <div className="text-center text-red-500 py-8">
          <AlertCircle className="h-12 w-12 mx-auto mb-4" />
          <p>Error al cargar las estadísticas: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Bienvenido al sistema de gestión de Juanita Deco</p>
      </div>

      {/* Sección: Ingresos y Ventas */}
      <div className="mb-8">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Ingresos y Ventas
          </h2>
          <p className="text-sm text-muted-foreground">Información sobre tus ingresos</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                    ${stats?.totalRevenue.toFixed(2) || '0.00'}
                  </div>
                  <p className="text-xs text-muted-foreground">Ingresos acumulados</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border-blue-200 dark:border-blue-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Ventas Hoy</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                    ${stats?.todaySales.toFixed(2) || '0.00'}
                  </div>
                  <p className="text-xs text-muted-foreground">Total vendido hoy</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sección: Facturas */}
      <div className="mb-8">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Facturas
          </h2>
          <p className="text-sm text-muted-foreground">Estadísticas de facturación</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total de Facturas</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.totalInvoices || 0}</div>
                  <p className="text-xs text-muted-foreground">Todas las facturas</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Facturas Hoy</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.todayInvoices || 0}</div>
                  <p className="text-xs text-muted-foreground">Facturas generadas hoy</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sección: Productos e Inventario */}
      <div className="mb-8">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Package className="h-5 w-5" />
            Productos e Inventario
          </h2>
          <p className="text-sm text-muted-foreground">Estado de tu inventario</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total de Productos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.totalProducts || 0}</div>
                  <p className="text-xs text-muted-foreground">Productos en inventario</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950 border-red-200 dark:border-red-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                    {stats?.lowStockProducts || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">Productos con stock bajo</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
