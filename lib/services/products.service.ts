import { apiClient } from '../api-client'
import { Product, CreateProductDto, UpdateProductDto, UpdateStockDto } from '../types'

export const productsService = {
  // Obtener todos los productos
  getAll: async (): Promise<Product[]> => {
    return apiClient.get<Product[]>('/products')
  },

  // Obtener un producto por ID
  getById: async (id: string): Promise<Product> => {
    return apiClient.get<Product>(`/products/${id}`)
  },

  // Obtener producto por código de barras (SCANNER)
  getByBarcode: async (code: string): Promise<Product> => {
    return apiClient.get<Product>(`/products/barcode?code=${code}`)
  },

  // Crear un nuevo producto
  create: async (data: CreateProductDto): Promise<Product> => {
    return apiClient.post<Product>('/products', data)
  },

  // Actualizar un producto
  update: async (id: string, data: UpdateProductDto): Promise<Product> => {
    return apiClient.patch<Product>(`/products/${id}`, data)
  },

  // Actualizar stock de un producto
  updateStock: async (id: string, data: UpdateStockDto): Promise<Product> => {
    return apiClient.patch<Product>(`/products/${id}/stock`, data)
  },

  // Eliminar un producto
  delete: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/products/${id}`)
  },
}
