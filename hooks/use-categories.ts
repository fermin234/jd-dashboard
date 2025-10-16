import { useState, useEffect } from 'react'
import { categoriesService } from '@/lib/services'
import { Category, CreateCategoryDto } from '@/lib/types'

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await categoriesService.getAll()
      
      // Validar que data sea un array
      if (!Array.isArray(data)) {
        console.warn('La respuesta de categorías no es un array:', data)
        setCategories([])
        // No establecer error si es undefined/null (podría ser carga inicial)
        if (data !== undefined && data !== null) {
          setError('Error al cargar las categorías: respuesta inválida del servidor')
        }
        return
      }
      
      setCategories(data)
    } catch (err: any) {
      console.error('Error al cargar categorías:', err)
      setCategories([])
      setError(err.message || 'Error al cargar las categorías')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const createCategory = async (data: CreateCategoryDto) => {
    try {
      const newCategory = await categoriesService.create(data)
      setCategories([...categories, newCategory])
      return newCategory
    } catch (err: any) {
      setError(err.message || 'Error al crear la categoría')
      throw err
    }
  }

  const updateCategory = async (id: string, data: Partial<CreateCategoryDto>) => {
    try {
      const updatedCategory = await categoriesService.update(id, data)
      setCategories(categories.map(c => c.id === id ? updatedCategory : c))
      return updatedCategory
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la categoría')
      throw err
    }
  }

  const deleteCategory = async (id: string) => {
    try {
      await categoriesService.delete(id)
      setCategories(categories.filter(c => c.id !== id))
    } catch (err: any) {
      setError(err.message || 'Error al eliminar la categoría')
      throw err
    }
  }

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  }
}

