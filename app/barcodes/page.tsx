"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useProducts } from "@/hooks/use-products"
import type { Product } from "@/lib/types"

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
                  className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-6"
                >
                  <svg viewBox="0 0 200 80" className="w-full" xmlns="http://www.w3.org/2000/svg">
                    <rect x="10" y="10" width="2" height="50" fill="black" />
                    <rect x="15" y="10" width="4" height="50" fill="black" />
                    <rect x="22" y="10" width="2" height="50" fill="black" />
                    <rect x="27" y="10" width="6" height="50" fill="black" />
                    <rect x="36" y="10" width="2" height="50" fill="black" />
                    <rect x="41" y="10" width="4" height="50" fill="black" />
                    <rect x="48" y="10" width="2" height="50" fill="black" />
                    <rect x="53" y="10" width="6" height="50" fill="black" />
                    <rect x="62" y="10" width="2" height="50" fill="black" />
                    <rect x="67" y="10" width="4" height="50" fill="black" />
                    <rect x="74" y="10" width="2" height="50" fill="black" />
                    <rect x="79" y="10" width="6" height="50" fill="black" />
                    <rect x="88" y="10" width="2" height="50" fill="black" />
                    <rect x="93" y="10" width="4" height="50" fill="black" />
                    <rect x="100" y="10" width="2" height="50" fill="black" />
                    <rect x="105" y="10" width="6" height="50" fill="black" />
                    <rect x="114" y="10" width="2" height="50" fill="black" />
                    <rect x="119" y="10" width="4" height="50" fill="black" />
                    <rect x="126" y="10" width="2" height="50" fill="black" />
                    <rect x="131" y="10" width="6" height="50" fill="black" />
                    <rect x="140" y="10" width="2" height="50" fill="black" />
                    <rect x="145" y="10" width="4" height="50" fill="black" />
                    <rect x="152" y="10" width="2" height="50" fill="black" />
                    <rect x="157" y="10" width="6" height="50" fill="black" />
                    <rect x="166" y="10" width="2" height="50" fill="black" />
                    <rect x="171" y="10" width="4" height="50" fill="black" />
                    <rect x="178" y="10" width="2" height="50" fill="black" />
                    <rect x="183" y="10" width="6" height="50" fill="black" />
                    <text x="100" y="72" textAnchor="middle" fontSize="12" fontFamily="monospace">
                      {selectedProduct.barcode}
                    </text>
                  </svg>
                  <p className="mt-4 text-center text-sm font-medium">{selectedProduct.name}</p>
                  <p className="text-center text-lg font-bold">${selectedProduct.price.toFixed(2)}</p>
                </div>
                <p className="text-center text-xs text-muted-foreground">
                  Haz clic en "Imprimir" para imprimir este código de barras
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

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area,
          .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>

      {selectedProduct && (
        <div className="print-area hidden">
          <div className="flex flex-col items-center justify-center p-8">
            <svg viewBox="0 0 200 80" width="400" height="160" xmlns="http://www.w3.org/2000/svg">
              <rect x="10" y="10" width="2" height="50" fill="black" />
              <rect x="15" y="10" width="4" height="50" fill="black" />
              <rect x="22" y="10" width="2" height="50" fill="black" />
              <rect x="27" y="10" width="6" height="50" fill="black" />
              <rect x="36" y="10" width="2" height="50" fill="black" />
              <rect x="41" y="10" width="4" height="50" fill="black" />
              <rect x="48" y="10" width="2" height="50" fill="black" />
              <rect x="53" y="10" width="6" height="50" fill="black" />
              <rect x="62" y="10" width="2" height="50" fill="black" />
              <rect x="67" y="10" width="4" height="50" fill="black" />
              <rect x="74" y="10" width="2" height="50" fill="black" />
              <rect x="79" y="10" width="6" height="50" fill="black" />
              <rect x="88" y="10" width="2" height="50" fill="black" />
              <rect x="93" y="10" width="4" height="50" fill="black" />
              <rect x="100" y="10" width="2" height="50" fill="black" />
              <rect x="105" y="10" width="6" height="50" fill="black" />
              <rect x="114" y="10" width="2" height="50" fill="black" />
              <rect x="119" y="10" width="4" height="50" fill="black" />
              <rect x="126" y="10" width="2" height="50" fill="black" />
              <rect x="131" y="10" width="6" height="50" fill="black" />
              <rect x="140" y="10" width="2" height="50" fill="black" />
              <rect x="145" y="10" width="4" height="50" fill="black" />
              <rect x="152" y="10" width="2" height="50" fill="black" />
              <rect x="157" y="10" width="6" height="50" fill="black" />
              <rect x="166" y="10" width="2" height="50" fill="black" />
              <rect x="171" y="10" width="4" height="50" fill="black" />
              <rect x="178" y="10" width="2" height="50" fill="black" />
              <rect x="183" y="10" width="6" height="50" fill="black" />
              <text x="100" y="72" textAnchor="middle" fontSize="12" fontFamily="monospace">
                {selectedProduct.barcode}
              </text>
            </svg>
            <p className="mt-4 text-center text-xl font-medium">{selectedProduct.name}</p>
            <p className="text-center text-2xl font-bold">${selectedProduct.price.toFixed(2)}</p>
          </div>
        </div>
      )}
    </div>
  )
}
