"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useProducts } from "@/hooks/use-products"
import type { Product } from "@/lib/types"
import Barcode from "react-barcode"

export default function BarcodesPage() {
  const { products, loading } = useProducts()
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const barcodeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (products) {
      setFilteredProducts(products)
    }
  }, [products])

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    if (!term.trim()) {
      setFilteredProducts(products)
      return
    }

    const filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(term.toLowerCase()) ||
        p.barcode.toLowerCase().includes(term.toLowerCase()) ||
        (p.category?.name && p.category.name.toLowerCase().includes(term.toLowerCase()))
    )
    setFilteredProducts(filtered)
  }

  const handlePrintBarcode = (product: Product) => {
    setSelectedProduct(product)
    setTimeout(() => {
      window.print()
    }, 100)
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Códigos de Barra</h1>
        <p className="text-muted-foreground">Imprime códigos de barra para tus productos</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar producto..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Cargando productos...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead className="text-right">Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        No hay productos disponibles
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-mono">{product.barcode}</TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category?.name || "-"}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => handlePrintBarcode(product)}>
                            <Printer className="mr-2 h-4 w-4" />
                            Imprimir
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vista Previa</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedProduct ? (
              <div className="space-y-4">
                <div
                  ref={barcodeRef}
                  className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-4 overflow-hidden"
                >
                  <div className="w-full flex justify-center overflow-hidden">
                    <Barcode 
                      value={selectedProduct.barcode} 
                      format="CODE128"
                      width={1}
                      height={50}
                      displayValue={true}
                      fontSize={12}
                      margin={5}
                    />
                  </div>
                  <p className="mt-4 text-center text-sm font-medium break-words w-full px-2">{selectedProduct.name}</p>
                  <p className="text-center text-lg font-bold">${selectedProduct.price.toFixed(2)}</p>
                </div>
                <p className="text-center text-xs text-muted-foreground">
                  Este código de barras es único y escaneable
                </p>
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center text-center text-sm text-muted-foreground">
                Selecciona un producto para ver la vista previa del código de barras
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Código de barras para imprimir */}
      {selectedProduct && (
        <div className="print-barcode-area fixed inset-0 bg-white hidden print:flex items-center justify-center">
          <div className="text-center">
            <Barcode 
              value={selectedProduct.barcode} 
              format="CODE128"
              width={3}
              height={100}
              displayValue={true}
              fontSize={20}
              margin={20}
              background="#ffffff"
            />
            <p className="mt-6 text-2xl font-medium">{selectedProduct.name}</p>
            <p className="mt-2 text-3xl font-bold">${selectedProduct.price.toFixed(2)}</p>
          </div>
        </div>
      )}

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-barcode-area,
          .print-barcode-area * {
            visibility: visible;
          }
          .print-barcode-area {
            display: flex !important;
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
          }
          @page {
            margin: 0.5cm;
            size: portrait;
          }
        }
      `}</style>
    </div>
  )
}
