/**
 * EJEMPLOS DE USO DE LA API
 * 
 * Este archivo contiene ejemplos de cómo usar los servicios y hooks
 * para consumir tu API de NestJS
 */

// ========================================
// EJEMPLO 1: Usar hooks en componentes
// ========================================

import { useProducts } from '@/hooks/use-products'
import { useInvoices } from '@/hooks/use-invoices'

function ProductsPage() {
  const { products, loading, error, createProduct, updateProduct, deleteProduct } = useProducts()

  if (loading) return <div>Cargando productos...</div>
  if (error) return <div>Error: {error}</div>

  const handleCreateProduct = async () => {
    try {
      await createProduct({
        name: 'Producto Nuevo',
        barcode: '1234567890',
        description: 'Descripción del producto',
        price: 100,
        stock: 50,
        category: 'General',
      })
      // El hook automáticamente actualiza la lista de productos
    } catch (error) {
      console.error('Error al crear producto:', error)
    }
  }

  return (
    <div>
      <button onClick={handleCreateProduct}>Crear Producto</button>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>Precio: ${product.price}</p>
          <p>Stock: {product.stock}</p>
          <button onClick={() => deleteProduct(product.id)}>Eliminar</button>
        </div>
      ))}
    </div>
  )
}

// ========================================
// EJEMPLO 2: Usar servicios directamente
// ========================================

import { productsService, invoicesService } from '@/lib/services'
import { apiClient } from '@/lib/api-client'

async function fetchDataExample() {
  // Obtener todos los productos
  const products = await productsService.getAll()
  
  // Obtener un producto por código de barras
  const product = await productsService.getByBarcode('1234567890')
  
  // Crear un nuevo producto
  const newProduct = await productsService.create({
    name: 'Producto Nuevo',
    barcode: '1234567890',
    description: 'Descripción',
    price: 100,
    stock: 50,
    category: 'General',
  })
  
  // Actualizar un producto
  const updatedProduct = await productsService.update('product-id', {
    price: 150,
    stock: 30,
  })
  
  // Obtener todas las facturas
  const invoices = await invoicesService.getAll()
  
  // Obtener una factura con sus items
  const invoice = await invoicesService.getById('invoice-id')
}

// ========================================
// EJEMPLO 3: Llamadas personalizadas con apiClient
// ========================================

async function customApiCalls() {
  // Si necesitas hacer llamadas a endpoints que no están en los servicios
  
  // GET
  const data = await apiClient.get('/custom-endpoint')
  
  // POST
  const response = await apiClient.post('/custom-endpoint', {
    key: 'value'
  })
  
  // PUT
  await apiClient.put('/custom-endpoint/123', {
    key: 'new value'
  })
  
  // PATCH
  await apiClient.patch('/custom-endpoint/123', {
    key: 'updated value'
  })
  
  // DELETE
  await apiClient.delete('/custom-endpoint/123')
}

// ========================================
// EJEMPLO 4: Uso con React Query (opcional)
// ========================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

function ProductsWithReactQuery() {
  const queryClient = useQueryClient()
  
  // Fetch products
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: productsService.getAll,
  })
  
  // Create product mutation
  const createMutation = useMutation({
    mutationFn: productsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
  
  const handleCreate = () => {
    createMutation.mutate({
      name: 'Producto',
      barcode: '123',
      description: 'Desc',
      price: 100,
      stock: 50,
      category: 'General',
    })
  }
  
  return <div>{/* UI */}</div>
}

// ========================================
// CONFIGURACIÓN
// ========================================

/**
 * VARIABLES DE ENTORNO NECESARIAS (.env.local):
 * 
 * NEXT_PUBLIC_API_URL=http://localhost:3001
 * 
 * Asegúrate de que tu API de NestJS esté corriendo en el puerto especificado
 * y que tenga CORS habilitado para permitir solicitudes desde Next.js
 */

/**
 * CONFIGURAR CORS EN NESTJS:
 * 
 * En tu main.ts de NestJS, agrega:
 * 
 * app.enableCors({
 *   origin: 'http://localhost:3000', // URL de tu app Next.js
 *   credentials: true,
 * })
 */

