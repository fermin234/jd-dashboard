"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useInvoices } from "@/hooks/use-invoices"
import { productsService } from "@/lib/services"
import type { Product } from "@/lib/types"
import { useRouter } from "next/navigation"

interface CartItem {
  product: Product
  quantity: number
}

export default function NewInvoicePage() {
  const { createInvoice, completeInvoice } = useInvoices()
  const [cart, setCart] = useState<CartItem[]>([])
  const [barcode, setBarcode] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [notes, setNotes] = useState("")
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

      toast({
        title: "Éxito",
        description: "Factura creada y completada correctamente",
      })

      setCart([])
      setCustomerName("")
      setCustomerPhone("")
      setCustomerEmail("")
      setNotes("")
      barcodeInputRef.current?.focus()
      
      // Redirigir a la lista de facturas después de 1 segundo
      setTimeout(() => {
        router.push('/invoicing/list')
      }, 1000)
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
    </div>
  )
}

