'use client';

import { useState } from 'react';
import { Building2, Shield, Flame, Heart, Plus, Eye, Pencil, Power } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/SearchInput';
import { Select } from '@/components/ui/Select';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Pagination } from '@/components/ui/Pagination';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/dashboard/StatCard';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { InstitutionModal } from '@/components/instituciones/InstitutionModal';
import { useInstitutions } from '@/hooks/useInstitutions';
import { institutionTypeLabels, institutionTypeEmojis } from '@/lib/utils';
import type { InstitutionData, InstitutionType } from '@/types';

const PAGE_SIZE = 10;

const typeFilterOptions = [
  { value: 'pnp', label: 'PNP' },
  { value: 'serenazgo', label: 'Serenazgo' },
  { value: 'bomberos', label: 'Bomberos' },
  { value: 'salud', label: 'Salud' },
  { value: 'otro', label: 'Otro' },
];

const statusFilterOptions = [
  { value: 'true', label: 'Activas' },
  { value: 'false', label: 'Inactivas' },
];

export default function InstitutionsPage() {
  const {
    institutions,
    loading,
    error,
    filters,
    setFilters,
    stats,
    create,
    update,
    toggleStatus,
    refresh,
  } = useInstitutions();

  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingInstitution, setEditingInstitution] = useState<InstitutionData | null>(null);
  const [confirmToggle, setConfirmToggle] = useState<InstitutionData | null>(null);
  const [toggling, setToggling] = useState(false);

  // Pagination
  const paginatedData = institutions.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  function handleOpenCreate() {
    setEditingInstitution(null);
    setModalOpen(true);
  }

  function handleOpenEdit(inst: InstitutionData) {
    setEditingInstitution(inst);
    setModalOpen(true);
  }

  async function handleSave(
    data: Omit<InstitutionData, 'id' | 'createdAt' | 'updatedAt' | 'agentCount'>,
  ) {
    if (editingInstitution?.id) {
      await update(editingInstitution.id, data);
    } else {
      await create(data);
    }
  }

  async function handleToggleStatus() {
    if (!confirmToggle?.id) return;
    setToggling(true);
    try {
      await toggleStatus(confirmToggle.id, !confirmToggle.isActive);
    } finally {
      setToggling(false);
      setConfirmToggle(null);
    }
  }

  const columns: Column<InstitutionData>[] = [
    {
      key: 'name',
      header: 'Nombre',
      render: (inst) => (
        <div className="flex items-center gap-2">
          <span>{institutionTypeEmojis[inst.type]}</span>
          <span className="font-medium text-text-primary">{inst.name}</span>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Tipo',
      width: '120px',
      render: (inst) => (
        <Badge variant="primary">{institutionTypeLabels[inst.type]}</Badge>
      ),
    },
    {
      key: 'phone',
      header: 'Teléfono',
      width: '140px',
      render: (inst) => (
        <span className="text-text-secondary">{inst.phone || '—'}</span>
      ),
    },
    {
      key: 'address',
      header: 'Dirección',
      render: (inst) => (
        <span className="text-text-secondary max-w-[200px] truncate block">
          {inst.address || '—'}
        </span>
      ),
    },
    {
      key: 'isActive',
      header: 'Estado',
      width: '100px',
      render: (inst) => (
        <Badge variant={inst.isActive ? 'success' : 'default'}>
          {inst.isActive ? 'Activa' : 'Inactiva'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Acciones',
      width: '120px',
      render: (inst) => (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); handleOpenEdit(inst); }}
            className="p-1.5 rounded-md text-text-secondary hover:bg-bg hover:text-primary transition-colors"
            title="Editar"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setConfirmToggle(inst); }}
            className={`p-1.5 rounded-md transition-colors ${
              inst.isActive
                ? 'text-text-secondary hover:bg-error/10 hover:text-error'
                : 'text-text-secondary hover:bg-success/10 hover:text-success'
            }`}
            title={inst.isActive ? 'Desactivar' : 'Activar'}
          >
            <Power className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Header
        breadcrumb="Inicio / Instituciones"
        title="Gestión de Instituciones"
        actionButton={
          <Button onClick={handleOpenCreate}>
            <Plus className="w-4 h-4" />
            Nueva Institución
          </Button>
        }
      />

      <div className="p-8 flex flex-col gap-6">
        {error && (
          <div className="p-4 rounded-lg bg-error/10 border border-error/20 flex items-center justify-between">
            <p className="text-sm text-error">{error}</p>
            <button onClick={refresh} className="text-sm font-medium text-error hover:underline">
              Reintentar
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="PNP"
            value={stats.pnp}
            icon={Shield}
            iconBgClass="bg-primary/15"
            iconColorClass="text-primary"
            loading={loading}
          />
          <StatCard
            title="Serenazgo"
            value={stats.serenazgo}
            icon={Eye}
            iconBgClass="bg-info/15"
            iconColorClass="text-info"
            loading={loading}
          />
          <StatCard
            title="Bomberos"
            value={stats.bomberos}
            icon={Flame}
            iconBgClass="bg-error/15"
            iconColorClass="text-error"
            loading={loading}
          />
          <StatCard
            title="Salud"
            value={stats.salud}
            icon={Heart}
            iconBgClass="bg-success/15"
            iconColorClass="text-success"
            loading={loading}
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 flex-wrap">
          <SearchInput
            value={filters.search || ''}
            onChange={(v) => { setFilters({ ...filters, search: v }); setPage(1); }}
            placeholder="Buscar institución..."
            className="w-[280px]"
          />
          <Select
            options={typeFilterOptions}
            value={(filters.type as string) || ''}
            onChange={(v) => { setFilters({ ...filters, type: v as InstitutionType | '' }); setPage(1); }}
            placeholder="Todos los tipos"
            className="w-[180px]"
          />
          <Select
            options={statusFilterOptions}
            value={filters.isActive === null || filters.isActive === undefined ? '' : String(filters.isActive)}
            onChange={(v) => {
              setFilters({
                ...filters,
                isActive: v === '' ? null : v === 'true',
              });
              setPage(1);
            }}
            placeholder="Todos los estados"
            className="w-[180px]"
          />
          {(filters.search || filters.type || filters.isActive !== null && filters.isActive !== undefined) && (
            <button
              onClick={() => { setFilters({}); setPage(1); }}
              className="text-sm text-primary hover:underline"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {/* Table */}
        <DataTable
          columns={columns}
          data={paginatedData}
          loading={loading}
          rowKey={(inst) => inst.id || ''}
          emptyMessage="No se encontraron instituciones"
          onRowClick={handleOpenEdit}
        />

        {/* Pagination */}
        {institutions.length > PAGE_SIZE && (
          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            total={institutions.length}
            onPageChange={setPage}
          />
        )}
      </div>

      {/* Modal */}
      <InstitutionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        institution={editingInstitution}
      />

      {/* Confirm Toggle */}
      <ConfirmDialog
        open={!!confirmToggle}
        onCancel={() => setConfirmToggle(null)}
        onConfirm={handleToggleStatus}
        title={confirmToggle?.isActive ? 'Desactivar Institución' : 'Activar Institución'}
        message={
          confirmToggle?.isActive
            ? `¿Estás seguro de desactivar "${confirmToggle?.name}"? Los agentes asociados no recibirán nuevas alertas.`
            : `¿Estás seguro de activar "${confirmToggle?.name}"?`
        }
        variant={confirmToggle?.isActive ? 'danger' : 'info'}
        confirmLabel={confirmToggle?.isActive ? 'Desactivar' : 'Activar'}
        loading={toggling}
      />
    </>
  );
}
