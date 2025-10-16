import { apiClient } from '../api-client'
import { Product, CreateProductDto, UpdateProductDto, UpdateStockDto } from '../types'

export const productsService = {
  // Obtener todos los productos
  getAll: async (): Promise<Product[]> => {
    try {
      return await apiClient.get<Product[]>('/products')
    } catch (error) {
      console.error('Error al obtener productos:', error)
      throw new Error('No se pudieron cargar los productos')
    }
  },

  // Obtener un producto por ID
  getById: async (id: string): Promise<Product> => {
    try {
      return await apiClient.get<Product>(`/products/${id}`)
    } catch (error) {
      console.error(`Error al obtener producto ${id}:`, error)
      throw new Error('No se pudo cargar el producto')
    }
  },

  // Obtener producto por código de barras (SCANNER)
  getByBarcode: async (code: string): Promise<Product> => {
    try {
      return await apiClient.get<Product>(`/products/barcode?code=${code}`)
    } catch (error) {
      console.error(`Error al obtener producto con código ${code}:`, error)
      throw new Error('No se pudo encontrar el producto escaneado')
    }
  },

  // Crear un nuevo producto
  create: async (data: CreateProductDto): Promise<Product> => {
    try {
      return await apiClient.post<Product>('/products', data)
    } catch (error) {
      console.error('Error al crear producto:', error)
      throw new Error('No se pudo crear el producto')
    }
  },

  // Actualizar un producto
  update: async (id: string, data: UpdateProductDto): Promise<Product> => {
    try {
      return await apiClient.patch<Product>(`/products/${id}`, data)
    } catch (error) {
      console.error(`Error al actualizar producto ${id}:`, error)
      throw new Error('No se pudo actualizar el producto')
    }
  },

  // Actualizar stock de un producto
  updateStock: async (id: string, data: UpdateStockDto): Promise<Product> => {
    try {
      return await apiClient.patch<Product>(`/products/${id}/stock`, data)
    } catch (error) {
      console.error(`Error al actualizar stock del producto ${id}:`, error)
      throw new Error('No se pudo actualizar el stock del producto')
    }
  },

  // Eliminar un producto
  delete: async (id: string): Promise<void> => {
    try {
      return await apiClient.delete<void>(`/products/${id}`)
    } catch (error) {
      console.error(`Error al eliminar producto ${id}:`, error)
      throw new Error('No se pudo eliminar el producto')
    }
  },
}
