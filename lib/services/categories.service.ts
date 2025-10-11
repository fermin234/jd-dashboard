import { apiClient } from '../api-client'
import { Category, CreateCategoryDto } from '../types'

export const categoriesService = {
  // Obtener todas las categorías
  getAll: async (): Promise<Category[]> => {
    return apiClient.get<Category[]>('/categories')
  },

  // Obtener una categoría por ID
  getById: async (id: string): Promise<Category> => {
    return apiClient.get<Category>(`/categories/${id}`)
  },

  // Crear una nueva categoría
  create: async (data: CreateCategoryDto): Promise<Category> => {
    return apiClient.post<Category>('/categories', data)
  },

  // Actualizar una categoría
  update: async (id: string, data: Partial<CreateCategoryDto>): Promise<Category> => {
    return apiClient.patch<Category>(`/categories/${id}`, data)
  },

  // Eliminar una categoría
  delete: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/categories/${id}`)
  },
}

