'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, ChevronUp, ChevronDown, Info, Save } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { CategoryModal } from '@/components/categorias/CategoryModal';
import { useCategories } from '@/hooks/useCategories';
import type { CategoryData } from '@/types';

const columns: Column<CategoryData>[] = [
  {
    key: 'emoji',
    header: '',
    width: '60px',
    render: (cat) => (
      <span
        className="flex items-center justify-center w-10 h-10 rounded-lg text-xl"
        style={{ backgroundColor: `${cat.color}26` }}
      >
        {cat.emoji}
      </span>
    ),
  },
  {
    key: 'name',
    header: 'Nombre',
    render: (cat) => (
      <div>
        <p className="font-semibold text-text-primary">{cat.name}</p>
        <p className="text-xs text-text-secondary">{cat.shortName}</p>
      </div>
    ),
  },
  {
    key: 'color',
    header: 'Color',
    width: '120px',
    render: (cat) => (
      <div className="flex items-center gap-2">
        <div
          className="w-5 h-5 rounded-full border border-border"
          style={{ backgroundColor: cat.color }}
        />
        <span className="text-xs text-text-secondary font-mono">{cat.color}</span>
      </div>
    ),
  },
  {
    key: 'order',
    header: 'Orden',
    width: '80px',
    render: (cat) => (
      <span className="text-sm text-text-secondary">{cat.order}</span>
    ),
  },
  {
    key: 'isActive',
    header: 'Estado',
    width: '100px',
    render: (cat) => (
      <Badge variant={cat.isActive ? 'success' : 'default'}>
        {cat.isActive ? 'Activa' : 'Inactiva'}
      </Badge>
    ),
  },
];

export default function CategoriasPage() {
  const {
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
  } = useCategories();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CategoryData | null>(null);
  const [orderChanged, setOrderChanged] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);

  function handleCreate() {
    setEditingCategory(null);
    setModalOpen(true);
  }

  function handleEdit(cat: CategoryData) {
    setEditingCategory(cat);
    setModalOpen(true);
  }

  async function handleSave(
    data: Omit<CategoryData, 'id' | 'createdAt' | 'updatedAt'>,
  ) {
    if (editingCategory?.id) {
      await update(editingCategory.id, data);
    } else {
      await create(data);
    }
  }

  async function handleDelete() {
    if (!deleteTarget?.id) return;
    try {
      await remove(deleteTarget.id);
    } catch (err) {
      console.error('[Categorias] Error eliminando:', err);
    } finally {
      setDeleteTarget(null);
    }
  }

  function handleMoveUp(index: number) {
    moveUp(index);
    setOrderChanged(true);
  }

  function handleMoveDown(index: number) {
    moveDown(index);
    setOrderChanged(true);
  }

  async function handleSaveOrder() {
    setSavingOrder(true);
    try {
      const orderedIds = categories
        .filter((c) => c.id)
        .map((c) => c.id!);
      await reorder(orderedIds);
      setOrderChanged(false);
    } catch (err) {
      console.error('[Categorias] Error guardando orden:', err);
    } finally {
      setSavingOrder(false);
    }
  }

  const actionColumns: Column<CategoryData>[] = [
    ...columns,
    {
      key: 'actions',
      header: 'Acciones',
      width: '180px',
      render: (cat, index) => (
        <div className="flex items-center gap-1">
          <button
            className="p-1.5 rounded-lg hover:bg-surface-secondary text-text-secondary hover:text-text-primary disabled:opacity-30"
            onClick={(e) => { e.stopPropagation(); handleMoveUp(index ?? 0); }}
            disabled={index === 0}
            title="Subir"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            className="p-1.5 rounded-lg hover:bg-surface-secondary text-text-secondary hover:text-text-primary disabled:opacity-30"
            onClick={(e) => { e.stopPropagation(); handleMoveDown(index ?? 0); }}
            disabled={index === categories.length - 1}
            title="Bajar"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <button
            className="p-1.5 rounded-lg hover:bg-surface-secondary text-text-secondary hover:text-primary"
            onClick={(e) => { e.stopPropagation(); handleEdit(cat); }}
            title="Editar"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            className="p-1.5 rounded-lg hover:bg-red-50 text-text-secondary hover:text-red-600"
            onClick={(e) => { e.stopPropagation(); setDeleteTarget(cat); }}
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Header
        breadcrumb="Inicio / Categorias"
        title="Categorias de Alerta"
        actionButton={
          <Button onClick={handleCreate}>
            <Plus className="w-4 h-4" />
            Nueva Categoria
          </Button>
        }
      />

      <div className="p-6 space-y-6">
        {/* Info Banner */}
        <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <Info className="w-5 h-5 text-blue-600 shrink-0" />
          <p className="text-sm text-blue-800">
            Las categorias definen los tipos de alerta disponibles en la app.
            Puedes reordenarlas con las flechas y guardar el nuevo orden.
          </p>
          {orderChanged && (
            <Button
              size="sm"
              onClick={handleSaveOrder}
              loading={savingOrder}
              className="ml-auto shrink-0"
            >
              <Save className="w-4 h-4 mr-1" />
              Guardar orden
            </Button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Table */}
        <DataTable
          columns={actionColumns}
          data={categories}
          loading={loading}
          emptyMessage="No hay categorias registradas"
          emptyDescription="Crea la primera categoria para que los ciudadanos puedan reportar alertas"
        />

        {/* Footer Stats */}
        {categories.length > 0 && (
          <div className="text-sm text-text-secondary text-center">
            Total: {stats.total} categorias · {stats.active} activas · {stats.inactive} inactivas
          </div>
        )}
      </div>

      {/* Modal */}
      <CategoryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        category={editingCategory}
        nextOrder={categories.length}
      />

      {/* Confirm Delete */}
      <ConfirmDialog
        open={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Eliminar Categoria"
        message={`¿Estas seguro de eliminar la categoria "${deleteTarget?.name}"? Las alertas existentes con esta categoria no se veran afectadas, pero no se podran crear nuevas alertas con esta categoria.`}
        confirmLabel="Eliminar"
        variant="danger"
      />
    </>
  );
}
