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
      setCategories(data)
    } catch (err: any) {
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

