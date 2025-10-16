import { useState, useEffect } from 'react'
import { productsService } from '@/lib/services'
import { Product, CreateProductDto, UpdateProductDto } from '@/lib/types'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await productsService.getAll()
      
      // Validar que data sea un array
      if (!Array.isArray(data)) {
        console.warn('La respuesta de productos no es un array:', data)
        setProducts([])
        // No establecer error si es undefined/null (podría ser carga inicial)
        if (data !== undefined && data !== null) {
          setError('Error al cargar los productos: respuesta inválida del servidor')
        }
        return
      }
      
      // Convertir el precio de string a number si es necesario
      const productsWithParsedPrice = data.map(product => ({
        ...product,
        price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
        galery: product.galery || [], // Asegurar que sea un array
        category: product.category || null, // Asegurar que sea null si no existe
      }))
      setProducts(productsWithParsedPrice)
    } catch (err: any) {
      console.error('Error al cargar productos:', err)
      setProducts([])
      setError(err.message || 'Error al cargar los productos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const createProduct = async (data: CreateProductDto) => {
    try {
      const newProduct = await productsService.create(data)
      const productWithParsedPrice = {
        ...newProduct,
        price: typeof newProduct.price === 'string' ? parseFloat(newProduct.price) : newProduct.price,
        galery: newProduct.galery || [],
        category: newProduct.category || null,
      }
      setProducts([...products, productWithParsedPrice])
      return productWithParsedPrice
    } catch (err: any) {
      setError(err.message || 'Error al crear el producto')
      throw err
    }
  }

  const updateProduct = async (id: string, data: UpdateProductDto) => {
    try {
      const updatedProduct = await productsService.update(id, data)
      const productWithParsedPrice = {
        ...updatedProduct,
        price: typeof updatedProduct.price === 'string' ? parseFloat(updatedProduct.price) : updatedProduct.price,
        galery: updatedProduct.galery || [],
        category: updatedProduct.category || null,
      }
      setProducts(products.map(p => p.id === id ? productWithParsedPrice : p))
      return productWithParsedPrice
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el producto')
      throw err
    }
  }

  const updateStock = async (id: string, quantity: number) => {
    try {
      const updatedProduct = await productsService.updateStock(id, { quantity })
      const productWithParsedPrice = {
        ...updatedProduct,
        price: typeof updatedProduct.price === 'string' ? parseFloat(updatedProduct.price) : updatedProduct.price,
        galery: updatedProduct.galery || [],
        category: updatedProduct.category || null,
      }
      setProducts(products.map(p => p.id === id ? productWithParsedPrice : p))
      return productWithParsedPrice
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el stock')
      throw err
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      await productsService.delete(id)
      setProducts(products.filter(p => p.id !== id))
    } catch (err: any) {
      setError(err.message || 'Error al eliminar el producto')
      throw err
    }
  }

  const getProductByBarcode = async (code: string) => {
    try {
      const product = await productsService.getByBarcode(code)
      return {
        ...product,
        price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
        galery: product.galery || [],
        category: product.category || null,
      }
    } catch (err: any) {
      setError(err.message || 'Error al buscar el producto')
      throw err
    }
  }

  return {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    updateStock,
    deleteProduct,
    getProductByBarcode,
  }
}
