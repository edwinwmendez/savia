'use client';

import { useState, useEffect, useCallback } from 'react';
import type { CategoryData } from '@/types';
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  updateCategoryOrder,
} from '@/lib/categories';

export function useCategories() {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      console.error('[useCategories] Error:', err);
      setError('Error al cargar categorias');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  async function create(
    data: Omit<CategoryData, 'id' | 'createdAt' | 'updatedAt'>,
  ) {
    const id = await createCategory(data);
    await loadCategories();
    return id;
  }

  async function update(
    id: string,
    data: Partial<Omit<CategoryData, 'id' | 'createdAt' | 'updatedAt'>>,
  ) {
    await updateCategory(id, data);
    await loadCategories();
  }

  async function remove(id: string) {
    await deleteCategory(id);
    await loadCategories();
  }

  async function reorder(orderedIds: string[]) {
    await updateCategoryOrder(orderedIds);
    await loadCategories();
  }

  function moveUp(index: number) {
    if (index <= 0) return;
    const newList = [...categories];
    [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
    setCategories(newList);
    return newList;
  }

  function moveDown(index: number) {
    if (index >= categories.length - 1) return;
    const newList = [...categories];
    [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
    setCategories(newList);
    return newList;
  }

  const stats = {
    total: categories.length,
    active: categories.filter((c) => c.isActive).length,
    inactive: categories.filter((c) => !c.isActive).length,
  };

  return {
    categories,
    loading,
    error,
    stats,
    create,
    update,
    remove,
    reorder,
    moveUp,
    moveDown,
    refresh: loadCategories,
  };
}
