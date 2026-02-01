'use client';

import { useState, useEffect } from 'react';
import { UserPlus, Plus, Pencil, Power } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/SearchInput';
import { Select } from '@/components/ui/Select';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Pagination } from '@/components/ui/Pagination';
import { Badge } from '@/components/ui/Badge';
import { Tabs, type Tab } from '@/components/ui/Tabs';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { UserModal } from '@/components/usuarios/UserModal';
import { useUsers } from '@/hooks/useUsers';
import { roleLabels, roleColors } from '@/lib/utils';
import { fetchInstitutions } from '@/lib/institutions';
import type { InstitutionData, UserRole } from '@/types';
import type { UserWithId, CreateUserInput } from '@/lib/users';

const PAGE_SIZE = 10;

const statusFilterOptions = [
  { value: 'true', label: 'Activos' },
  { value: 'false', label: 'Inactivos' },
];

export default function UsersPage() {
  const {
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
    refresh,
  } = useUsers();

  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserWithId | null>(null);
  const [confirmToggle, setConfirmToggle] = useState<UserWithId | null>(null);
  const [toggling, setToggling] = useState(false);
  const [institutions, setInstitutions] = useState<InstitutionData[]>([]);

  useEffect(() => {
    fetchInstitutions().then(setInstitutions).catch(console.error);
  }, []);

  const paginatedData = users.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const tabs: Tab[] = [
    { key: 'all', label: 'Todos', count: counts.all },
    { key: 'agent', label: 'Agentes', count: counts.agent },
    { key: 'citizen', label: 'Ciudadanos', count: counts.citizen },
    { key: 'admin', label: 'Admins', count: counts.admin },
  ];

  function handleOpenCreate() {
    setEditingUser(null);
    setModalOpen(true);
  }

  function handleOpenEdit(user: UserWithId) {
    setEditingUser(user);
    setModalOpen(true);
  }

  async function handleCreate(data: CreateUserInput) {
    await create(data);
  }

  async function handleUpdate(id: string, data: Partial<UserWithId>) {
    await update(id, data);
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

  function getInstitutionName(institutionId?: string): string {
    if (!institutionId) return '—';
    const inst = institutions.find((i) => i.id === institutionId);
    return inst?.name || '—';
  }

  function getInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  const columns: Column<UserWithId>[] = [
    {
      key: 'name',
      header: 'Usuario',
      render: (user) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-sm font-semibold text-primary">
            {getInitials(user.firstName, user.lastName)}
          </div>
          <div>
            <p className="font-medium text-text-primary">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-text-secondary">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'dni',
      header: 'DNI',
      width: '100px',
      render: (user) => (
        <span className="text-text-secondary font-mono text-xs">{user.dni}</span>
      ),
    },
    {
      key: 'role',
      header: 'Rol',
      width: '130px',
      render: (user) => (
        <Badge variant={roleColors[user.role] as 'primary' | 'default' | 'warning'}>
          {roleLabels[user.role]}
        </Badge>
      ),
    },
    {
      key: 'institutionId',
      header: 'Institución',
      render: (user) => (
        <span className="text-text-secondary text-sm">
          {getInstitutionName(user.institutionId)}
        </span>
      ),
    },
    {
      key: 'isActive',
      header: 'Estado',
      width: '100px',
      render: (user) => (
        <div className="flex items-center gap-1.5">
          <div
            className={`w-2 h-2 rounded-full ${
              user.isActive ? 'bg-success' : 'bg-error'
            }`}
          />
          <span className="text-sm text-text-secondary">
            {user.isActive ? 'Activo' : 'Inactivo'}
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Acciones',
      width: '100px',
      render: (user) => (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); handleOpenEdit(user); }}
            className="p-1.5 rounded-md text-text-secondary hover:bg-bg hover:text-primary transition-colors"
            title="Editar"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setConfirmToggle(user); }}
            className={`p-1.5 rounded-md transition-colors ${
              user.isActive
                ? 'text-text-secondary hover:bg-error/10 hover:text-error'
                : 'text-text-secondary hover:bg-success/10 hover:text-success'
            }`}
            title={user.isActive ? 'Desactivar' : 'Activar'}
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
        breadcrumb="Inicio / Usuarios"
        title="Gestión de Usuarios"
        actionButton={
          <Button onClick={handleOpenCreate}>
            <Plus className="w-4 h-4" />
            Nuevo Usuario
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

        {/* Tabs */}
        <div className="bg-surface rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={(key) => { setActiveTab(key as 'all' | 'agent' | 'citizen' | 'admin'); setPage(1); }}
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 flex-wrap">
          <SearchInput
            value={filters.search || ''}
            onChange={(v) => { setFilters({ ...filters, search: v }); setPage(1); }}
            placeholder="Buscar por nombre, DNI, email..."
            className="w-[300px]"
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
          {(filters.search || (filters.isActive !== null && filters.isActive !== undefined)) && (
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
          rowKey={(user) => user.id}
          emptyMessage="No se encontraron usuarios"
          onRowClick={handleOpenEdit}
        />

        {/* Pagination */}
        {users.length > PAGE_SIZE && (
          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            total={users.length}
            onPageChange={setPage}
          />
        )}
      </div>

      {/* Modal */}
      <UserModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleCreate}
        onUpdate={handleUpdate}
        user={editingUser}
        institutions={institutions}
      />

      {/* Confirm Toggle */}
      <ConfirmDialog
        open={!!confirmToggle}
        onCancel={() => setConfirmToggle(null)}
        onConfirm={handleToggleStatus}
        title={confirmToggle?.isActive ? 'Desactivar Usuario' : 'Activar Usuario'}
        message={
          confirmToggle?.isActive
            ? `¿Estás seguro de desactivar a "${confirmToggle?.firstName} ${confirmToggle?.lastName}"? No podrá acceder al sistema.`
            : `¿Estás seguro de activar a "${confirmToggle?.firstName} ${confirmToggle?.lastName}"?`
        }
        variant={confirmToggle?.isActive ? 'danger' : 'info'}
        confirmLabel={confirmToggle?.isActive ? 'Desactivar' : 'Activar'}
        loading={toggling}
      />
    </>
  );
}
