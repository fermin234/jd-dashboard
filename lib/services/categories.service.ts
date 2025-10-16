import { apiClient } from '../api-client'
import { Category, CreateCategoryDto } from '../types'

export const categoriesService = {
  // Obtener todas las categorías
  getAll: async (): Promise<Category[]> => {
    try {
      return await apiClient.get<Category[]>('/categories')
    } catch (error) {
      console.error('Error al obtener categorías:', error)
      throw new Error('No se pudieron cargar las categorías')
    }
  },

  // Obtener una categoría por ID
  getById: async (id: string): Promise<Category> => {
    try {
      return await apiClient.get<Category>(`/categories/${id}`)
    } catch (error) {
      console.error(`Error al obtener categoría ${id}:`, error)
      throw new Error('No se pudo cargar la categoría')
    }
  },

  // Crear una nueva categoría
  create: async (data: CreateCategoryDto): Promise<Category> => {
    try {
      return await apiClient.post<Category>('/categories', data)
    } catch (error) {
      console.error('Error al crear categoría:', error)
      throw new Error('No se pudo crear la categoría')
    }
  },

  // Actualizar una categoría
  update: async (id: string, data: Partial<CreateCategoryDto>): Promise<Category> => {
    try {
      return await apiClient.patch<Category>(`/categories/${id}`, data)
    } catch (error) {
      console.error(`Error al actualizar categoría ${id}:`, error)
      throw new Error('No se pudo actualizar la categoría')
    }
  },

  // Eliminar una categoría
  delete: async (id: string): Promise<void> => {
    try {
      return await apiClient.delete<void>(`/categories/${id}`)
    } catch (error) {
      console.error(`Error al eliminar categoría ${id}:`, error)
      throw new Error('No se pudo eliminar la categoría')
    }
  },
}

