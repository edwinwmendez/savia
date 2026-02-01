'use client';

import { useState, useEffect, useCallback } from 'react';
import type { InstitutionData } from '@/types';
import {
  fetchInstitutions,
  createInstitution,
  updateInstitution,
  toggleInstitutionStatus,
  type InstitutionFilters,
} from '@/lib/institutions';

export function useInstitutions() {
  const [institutions, setInstitutions] = useState<InstitutionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<InstitutionFilters>({});

  const loadInstitutions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchInstitutions(filters);
      setInstitutions(data);
    } catch (err) {
      console.error('[useInstitutions] Error:', err);
      setError('Error al cargar instituciones');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadInstitutions();
  }, [loadInstitutions]);

  async function create(
    data: Omit<InstitutionData, 'id' | 'createdAt' | 'updatedAt' | 'agentCount'>,
  ) {
    const id = await createInstitution(data);
    await loadInstitutions();
    return id;
  }

  async function update(
    id: string,
    data: Partial<Omit<InstitutionData, 'id' | 'createdAt' | 'updatedAt'>>,
  ) {
    await updateInstitution(id, data);
    await loadInstitutions();
  }

  async function toggleStatus(id: string, isActive: boolean) {
    await toggleInstitutionStatus(id, isActive);
    await loadInstitutions();
  }

  // Stats by type
  const stats = {
    pnp: institutions.filter((i) => i.type === 'pnp').length,
    serenazgo: institutions.filter((i) => i.type === 'serenazgo').length,
    bomberos: institutions.filter((i) => i.type === 'bomberos').length,
    salud: institutions.filter((i) => i.type === 'salud').length,
  };

  return {
    institutions,
    loading,
    error,
    filters,
    setFilters,
    stats,
    create,
    update,
    toggleStatus,
    refresh: loadInstitutions,
  };
}
