'use client';

import { useState, useEffect, useCallback } from 'react';
import type { UserRole } from '@/types';
import {
  fetchUsers,
  updateUser,
  toggleUserStatus,
  createUserViaFunction,
  type UserFilters,
  type UserWithId,
  type CreateUserInput,
} from '@/lib/users';

type TabKey = 'all' | 'agent' | 'citizen' | 'admin';

export function useUsers() {
  const [users, setUsers] = useState<UserWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<UserFilters>({});
  const [activeTab, setActiveTab] = useState<TabKey>('all');

  const effectiveFilters: UserFilters = {
    ...filters,
    role: activeTab === 'all' ? filters.role : (activeTab as UserRole),
  };

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUsers(effectiveFilters);
      setUsers(data);
    } catch (err) {
      console.error('[useUsers] Error:', err);
      setError('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, activeTab]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  async function create(data: CreateUserInput) {
    const result = await createUserViaFunction(data);
    await loadUsers();
    return result.uid;
  }

  async function update(
    id: string,
    data: Partial<Omit<UserWithId, 'id' | 'createdAt' | 'updatedAt'>>,
  ) {
    await updateUser(id, data);
    await loadUsers();
  }

  async function toggleStatus(id: string, isActive: boolean) {
    await toggleUserStatus(id, isActive);
    await loadUsers();
  }

  // Count by role (computed from full user list when tab is 'all')
  const counts = {
    all: users.length,
    agent: users.filter((u) => u.role === 'agent').length,
    citizen: users.filter((u) => u.role === 'citizen').length,
    admin: users.filter((u) => u.role === 'admin').length,
  };

  return {
    users,
    loading,
    error,
    filters,
    setFilters,
    activeTab,
    setActiveTab,
    counts,
    create,
    update,
    toggleStatus,
    refresh: loadUsers,
  };
}
