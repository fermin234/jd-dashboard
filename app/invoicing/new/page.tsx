"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Plus, Trash2, Printer, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useInvoices } from "@/hooks/use-invoices"
import { productsService } from "@/lib/services"
import type { Product, InvoiceWithItems } from "@/lib/types"
import { useRouter } from "next/navigation"

interface CartItem {
  product: Product
  quantity: number
}

export default function NewInvoicePage() {
  const { createInvoice, completeInvoice, getInvoiceById } = useInvoices()
  const [cart, setCart] = useState<CartItem[]>([])
  const [barcode, setBarcode] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [notes, setNotes] = useState("")
  const [completedInvoice, setCompletedInvoice] = useState<InvoiceWithItems | null>(null)
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false)
  const barcodeInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    barcodeInputRef.current?.focus()
  }, [])

  const handleScanProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!barcode.trim()) return

    try {
      const productData = await productsService.getByBarcode(barcode.trim())
      
      // Convertir el precio de string a number si es necesario
      const product = {
        ...productData,
        price: typeof productData.price === 'string' ? parseFloat(productData.price) : productData.price
      }

      const existingItem = cart.find((item) => item.product.id === product.id)
      if (existingItem) {
        setCart(cart.map((item) => (item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)))
      } else {
        setCart([...cart, { product, quantity: 1 }])
      }

      toast({
        title: "Producto agregado",
        description: `${product.name} agregado al carrito`,
      })
      setBarcode("")
      barcodeInputRef.current?.focus()
    } catch (err: any) {
      toast({
        title: "Error",
        description: "Producto no encontrado",
        variant: "destructive",
      })
      setBarcode("")
    }
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(cart.filter((item) => item.product.id !== productId))
    } else {
      setCart(cart.map((item) => (item.product.id === productId ? { ...item, quantity } : item)))
    }
  }

  const removeItem = (productId: string) => {
    setCart(cart.filter((item) => item.product.id !== productId))
  }

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  }

  const calculateTax = () => {
    return calculateSubtotal() * 0.16 // 16% IVA
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax()
  }

  const handleCreateInvoice = async () => {
    if (cart.length === 0) {
      toast({
        title: "Error",
        description: "El carrito está vacío",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)

    try {
      const invoice = await createInvoice({
        items: cart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        customerName: customerName || undefined,
        customerPhone: customerPhone || undefined,
        customerEmail: customerEmail || undefined,
        notes: notes || undefined,
      })

      // Completar la factura automáticamente (descuenta stock)
      await completeInvoice(invoice.id)

      // Obtener los detalles completos de la factura
      const invoiceDetails = await getInvoiceById(invoice.id)

      toast({
        title: "Éxito",
        description: "Factura creada correctamente. Preparando impresión...",
      })

      // Mostrar la factura para impresión
      setCompletedInvoice(invoiceDetails)
      
      // Esperar un momento para que se renderice el contenido
      setTimeout(() => {
        window.print()
        
        // Limpiar después de cerrar el dialog de impresión
        setTimeout(() => {
          setCompletedInvoice(null)
          setCart([])
          setCustomerName("")
          setCustomerPhone("")
          setCustomerEmail("")
          setNotes("")
          barcodeInputRef.current?.focus()
        }, 500)
      }, 300)
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "No se pudo crear la factura",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }


  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Nueva Factura</h1>
        <p className="text-muted-foreground">Escanea productos y crea una nueva factura</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Escanear Productos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleScanProduct} className="flex gap-2">
              <Input
                ref={barcodeInputRef}
                placeholder="Escanear código de barras..."
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">
                <Plus className="h-4 w-4" />
              </Button>
            </form>

            <div className="space-y-2">
              {cart.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-8">
                  Escanea productos para agregarlos a la factura
                </p>
              ) : (
                <>
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center justify-between rounded-lg border border-border p-3"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">${item.product.price.toFixed(2)} c/u</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.product.id, Number.parseInt(e.target.value))}
                          className="w-20"
                        />
                        <Button variant="ghost" size="icon" onClick={() => removeItem(item.product.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  <div className="mt-4 space-y-2 border-t border-border pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="customer-name">Cliente (opcional)</Label>
                      <Input
                        id="customer-name"
                        placeholder="Nombre del cliente"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="customer-phone">Teléfono</Label>
                        <Input
                          id="customer-phone"
                          placeholder="555-1234"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customer-email">Email</Label>
                        <Input
                          id="customer-email"
                          type="email"
                          placeholder="cliente@email.com"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notas</Label>
                      <Input
                        id="notes"
                        placeholder="Notas adicionales..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-border pt-4">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>${calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>IVA (16%):</span>
                      <span>${calculateTax().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setCart([])}>
                      Cancelar
                    </Button>
                    <Button className="flex-1" onClick={handleCreateInvoice} disabled={submitting}>
                      {submitting ? "Procesando..." : "Completar Factura"}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Factura para Imprimir */}
      {completedInvoice && (
        <div className="print-invoice hidden print:block fixed inset-0 bg-white z-50">
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
                <p className="text-sm"><strong>Número:</strong> {completedInvoice.invoiceNumber}</p>
                <p className="text-sm"><strong>Fecha:</strong> {new Date(completedInvoice.createdAt).toLocaleString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</p>
              </div>
              
              {(completedInvoice.customerName || completedInvoice.customerPhone || completedInvoice.customerEmail) && (
                <div className="text-right">
                  <h3 className="font-bold mb-2">CLIENTE</h3>
                  {completedInvoice.customerName && (
                    <p className="text-sm"><strong>Nombre:</strong> {completedInvoice.customerName}</p>
                  )}
                  {completedInvoice.customerPhone && (
                    <p className="text-sm"><strong>Teléfono:</strong> {completedInvoice.customerPhone}</p>
                  )}
                  {completedInvoice.customerEmail && (
                    <p className="text-sm"><strong>Email:</strong> {completedInvoice.customerEmail}</p>
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
                {completedInvoice.items.map((item, index) => (
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
                  <span>${completedInvoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 text-sm">
                  <span>IVA (16%):</span>
                  <span>${completedInvoice.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 border-t-2 border-black font-bold text-lg">
                  <span>TOTAL:</span>
                  <span>${completedInvoice.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Notas */}
            {completedInvoice.notes && (
              <div className="mb-6 p-3 bg-gray-50 border border-gray-300">
                <p className="text-sm"><strong>Notas:</strong> {completedInvoice.notes}</p>
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
          .print-invoice,
          .print-invoice * {
            visibility: visible;
          }
          .print-invoice {
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

