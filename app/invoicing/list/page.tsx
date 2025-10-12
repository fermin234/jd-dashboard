"use client"

import { useState } from "react"
import { Eye, Printer, CheckCircle, XCircle, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useInvoices } from "@/hooks/use-invoices"
import type { InvoiceWithItems } from "@/lib/types"
import Link from "next/link"

export default function InvoicesListPage() {
  const { invoices, loading, getInvoiceById } = useInvoices()
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceWithItems | null>(null)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const { toast } = useToast()

  const handlePrintInvoice = () => {
    window.print()
  }

  const viewInvoiceDetails = async (invoiceId: string) => {
    try {
      const invoice = await getInvoiceById(invoiceId)
      setSelectedInvoice(invoice)
      setIsViewOpen(true)
    } catch (err: any) {
      toast({
        title: "Error",
        description: "No se pudo cargar la factura",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500"><CheckCircle className="mr-1 h-3 w-3" />Completada</Badge>
      case 'pending':
        return <Badge variant="secondary">Pendiente</Badge>
      case 'cancelled':
        return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" />Cancelada</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Facturas</h1>
          <p className="text-muted-foreground">Historial completo de todas las facturas</p>
        </div>
        <Link href="/invoicing/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Factura
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Todas las Facturas</CardTitle>
            <div className="text-sm text-muted-foreground">
              {invoices.length} {invoices.length === 1 ? 'factura' : 'facturas'}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Cargando facturas...</div>
          ) : invoices.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">No hay facturas</h3>
              <p className="text-muted-foreground mb-4">Crea tu primera factura para comenzar</p>
              <Link href="/invoicing/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Primera Factura
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-mono text-sm">{invoice.invoiceNumber}</TableCell>
                    <TableCell>{invoice.customerName || '-'}</TableCell>
                    <TableCell className="font-semibold">${invoice.total.toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(invoice.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => viewInvoiceDetails(invoice.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Vista Previa de Factura</DialogTitle>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-4">
              {/* Vista previa con el mismo formato de impresión */}
              <div className="border-2 border-border rounded-lg p-8 bg-white">
                {/* Encabezado de la Empresa */}
                <div className="text-center mb-8 border-b-2 border-black pb-4">
                  <h1 className="text-3xl font-bold">Juanita Deco</h1>
                  <p className="text-sm mt-1">Artículos de Decoración</p>
                </div>

                {/* Información de la Factura */}
                <div className="grid grid-cols-2 gap-8 mb-6">
                  <div>
                    <h2 className="font-bold text-lg mb-2">FACTURA</h2>
                    <p className="text-sm"><strong>Número:</strong> {selectedInvoice.invoiceNumber}</p>
                    <p className="text-sm"><strong>Fecha:</strong> {new Date(selectedInvoice.createdAt).toLocaleString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</p>
                    <div className="mt-2">
                      <strong className="text-sm">Estado: </strong>
                      {getStatusBadge(selectedInvoice.status)}
                    </div>
                  </div>
                  
                  {(selectedInvoice.customerName || selectedInvoice.customerPhone || selectedInvoice.customerEmail) && (
                    <div className="text-right">
                      <h3 className="font-bold mb-2">CLIENTE</h3>
                      {selectedInvoice.customerName && (
                        <p className="text-sm"><strong>Nombre:</strong> {selectedInvoice.customerName}</p>
                      )}
                      {selectedInvoice.customerPhone && (
                        <p className="text-sm"><strong>Teléfono:</strong> {selectedInvoice.customerPhone}</p>
                      )}
                      {selectedInvoice.customerEmail && (
                        <p className="text-sm"><strong>Email:</strong> {selectedInvoice.customerEmail}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Tabla de Productos */}
                <table className="w-full mb-6 border-collapse">
                  <thead>
                    <tr className="border-b-2 border-black">
                      <th className="text-left py-2 px-2">Producto</th>
                      <th className="text-center py-2 px-2">Cantidad</th>
                      <th className="text-right py-2 px-2">Precio Unit.</th>
                      <th className="text-right py-2 px-2">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.items.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="py-2 px-2">{item.product?.name || 'Producto'}</td>
                        <td className="text-center py-2 px-2">{item.quantity}</td>
                        <td className="text-right py-2 px-2">${item.unitPrice.toFixed(2)}</td>
                        <td className="text-right py-2 px-2 font-semibold">${item.subtotal.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Totales */}
                <div className="flex justify-end mb-6">
                  <div className="w-64">
                    <div className="flex justify-between py-1 text-sm">
                      <span>Subtotal:</span>
                      <span>${selectedInvoice.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-1 text-sm">
                      <span>IVA (16%):</span>
                      <span>${selectedInvoice.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-t-2 border-black font-bold text-lg">
                      <span>TOTAL:</span>
                      <span>${selectedInvoice.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Notas */}
                {selectedInvoice.notes && (
                  <div className="mb-6 p-3 bg-gray-50 border border-gray-300">
                    <p className="text-sm"><strong>Notas:</strong> {selectedInvoice.notes}</p>
                  </div>
                )}

                {/* Pie de Página */}
                <div className="text-center text-sm border-t pt-4 mt-8">
                  <p>¡Gracias por su compra!</p>
                  <p className="text-xs mt-2 text-gray-600">Esta factura fue generada electrónicamente</p>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsViewOpen(false)}>
                  Cerrar
                </Button>
                <Button onClick={handlePrintInvoice}>
                  <Printer className="mr-2 h-4 w-4" />
                  Imprimir
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Factura para Imprimir (oculta en pantalla, visible en impresión) */}
      {selectedInvoice && (
        <div className="print-invoice-list hidden print:block fixed inset-0 bg-white z-50">
          <div className="max-w-4xl mx-auto p-8">
            {/* Encabezado de la Empresa */}
            <div className="text-center mb-8 border-b-2 border-black pb-4">
              <h1 className="text-3xl font-bold">Juanita Deco</h1>
              <p className="text-sm mt-1">Artículos de Decoración</p>
            </div>

            {/* Información de la Factura */}
            <div className="grid grid-cols-2 gap-8 mb-6">
              <div>
                <h2 className="font-bold text-lg mb-2">FACTURA</h2>
                <p className="text-sm"><strong>Número:</strong> {selectedInvoice.invoiceNumber}</p>
                <p className="text-sm"><strong>Fecha:</strong> {new Date(selectedInvoice.createdAt).toLocaleString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</p>
              </div>
              
              {(selectedInvoice.customerName || selectedInvoice.customerPhone || selectedInvoice.customerEmail) && (
                <div className="text-right">
                  <h3 className="font-bold mb-2">CLIENTE</h3>
                  {selectedInvoice.customerName && (
                    <p className="text-sm"><strong>Nombre:</strong> {selectedInvoice.customerName}</p>
                  )}
                  {selectedInvoice.customerPhone && (
                    <p className="text-sm"><strong>Teléfono:</strong> {selectedInvoice.customerPhone}</p>
                  )}
                  {selectedInvoice.customerEmail && (
                    <p className="text-sm"><strong>Email:</strong> {selectedInvoice.customerEmail}</p>
                  )}
                </div>
              )}
            </div>

            {/* Tabla de Productos */}
            <table className="w-full mb-6 border-collapse">
              <thead>
                <tr className="border-b-2 border-black">
                  <th className="text-left py-2 px-2">Producto</th>
                  <th className="text-center py-2 px-2">Cantidad</th>
                  <th className="text-right py-2 px-2">Precio Unit.</th>
                  <th className="text-right py-2 px-2">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {selectedInvoice.items.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-2 px-2">{item.product?.name || 'Producto'}</td>
                    <td className="text-center py-2 px-2">{item.quantity}</td>
                    <td className="text-right py-2 px-2">${item.unitPrice.toFixed(2)}</td>
                    <td className="text-right py-2 px-2 font-semibold">${item.subtotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totales */}
            <div className="flex justify-end mb-6">
              <div className="w-64">
                <div className="flex justify-between py-1 text-sm">
                  <span>Subtotal:</span>
                  <span>${selectedInvoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 text-sm">
                  <span>IVA (16%):</span>
                  <span>${selectedInvoice.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 border-t-2 border-black font-bold text-lg">
                  <span>TOTAL:</span>
                  <span>${selectedInvoice.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Notas */}
            {selectedInvoice.notes && (
              <div className="mb-6 p-3 bg-gray-50 border border-gray-300">
                <p className="text-sm"><strong>Notas:</strong> {selectedInvoice.notes}</p>
              </div>
            )}

            {/* Pie de Página */}
            <div className="text-center text-sm border-t pt-4 mt-8">
              <p>¡Gracias por su compra!</p>
              <p className="text-xs mt-2 text-gray-600">Esta factura fue generada electrónicamente</p>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-invoice-list,
          .print-invoice-list * {
            visibility: visible;
          }
          .print-invoice-list {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            display: block !important;
          }
          @page {
            margin: 1cm;
          }
        }
      `}</style>
    </div>
  )
}

