'use client';

import { useState, useEffect } from 'react';
import { Tag } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { RadioGroup } from '@/components/ui/RadioGroup';
import type { CategoryData } from '@/types';

interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<CategoryData, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  category?: CategoryData | null;
  nextOrder: number;
}

export function CategoryModal({
  open,
  onClose,
  onSave,
  category,
  nextOrder,
}: CategoryModalProps) {
  const isEditing = !!category?.id;

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [emoji, setEmoji] = useState('');
  const [icon, setIcon] = useState('');
  const [color, setColor] = useState('#1976D2');
  const [order, setOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (category) {
      setCode(category.code ?? '');
      setName(category.name);
      setShortName(category.shortName);
      setEmoji(category.emoji);
      setIcon(category.icon ?? '');
      setColor(category.color);
      setOrder(category.order);
      setIsActive(category.isActive);
    } else {
      setCode('');
      setName('');
      setShortName('');
      setEmoji('');
      setIcon('');
      setColor('#1976D2');
      setOrder(nextOrder);
      setIsActive(true);
    }
    setErrors({});
  }, [category, open, nextOrder]);

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!code.trim()) newErrors.code = 'El código es requerido';
    else if (!/^[a-z_]+$/.test(code.trim())) newErrors.code = 'Solo minúsculas y guiones bajos';
    if (!name.trim()) newErrors.name = 'El nombre es requerido';
    if (!shortName.trim()) newErrors.shortName = 'El nombre corto es requerido';
    if (!emoji.trim()) newErrors.emoji = 'El emoji es requerido';
    if (!icon.trim()) newErrors.icon = 'El icono es requerido';
    if (!color.trim()) newErrors.color = 'El color es requerido';
    if (!/^#[0-9A-Fa-f]{6}$/.test(color)) newErrors.color = 'Formato hex invalido (#RRGGBB)';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave({
        code: code.trim(),
        name: name.trim(),
        shortName: shortName.trim(),
        emoji: emoji.trim(),
        icon: icon.trim(),
        color: color.trim(),
        order,
        isActive,
      });
      onClose();
    } catch (err) {
      console.error('[CategoryModal] Error:', err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Editar Categoria' : 'Nueva Categoria'}
      icon={Tag}
      width={520}
    >
      <div className="space-y-4">
        {/* Preview */}
        <div className="flex items-center justify-center gap-3 p-4 bg-surface-secondary rounded-xl">
          <span
            className="flex items-center justify-center w-12 h-12 rounded-xl text-2xl"
            style={{ backgroundColor: `${color}26` }}
          >
            {emoji || '?'}
          </span>
          <div>
            <p className="font-semibold text-text-primary">{name || 'Nombre'}</p>
            <p className="text-sm text-text-secondary">{shortName || 'Corto'}</p>
          </div>
          <div
            className="w-6 h-6 rounded-full ml-auto border border-border"
            style={{ backgroundColor: color }}
          />
        </div>

        <div>
          <Input
            label="Código (slug)"
            value={code}
            onChange={(e) => setCode(e.target.value.toLowerCase().replace(/[^a-z_]/g, ''))}
            placeholder="Ej: robbery"
            error={errors.code}
            disabled={isEditing}
          />
          <p className="text-xs text-text-secondary mt-1">
            Identificador interno en minúsculas. Se usa para vincular con instituciones y alertas. No se puede cambiar después.
          </p>
        </div>

        <Input
          label="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Robo / Asalto"
          error={errors.name}
        />

        <Input
          label="Nombre corto"
          value={shortName}
          onChange={(e) => setShortName(e.target.value)}
          placeholder="Ej: Robo"
          error={errors.shortName}
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Input
              label="Emoji"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              placeholder="Ej: 🚨"
              error={errors.emoji}
            />
            <p className="text-xs text-text-secondary mt-1">
              Se muestra en el panel admin y en instituciones.
            </p>
          </div>
          <div>
            <Input
              label="Icono Lucide"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="Ej: Siren"
              error={errors.icon}
            />
            <p className="text-xs text-text-secondary mt-1">
              Nombre exacto del icono en inglés (<a href="https://lucide.dev/icons" target="_blank" rel="noopener noreferrer" className="text-primary underline">lucide.dev/icons</a>). Ej: Siren, Flame, Droplets, Car.
            </p>
          </div>
        </div>

        <div>
          <Input
            label="Color (hex)"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="#1976D2"
            error={errors.color}
          />
          <p className="text-xs text-text-secondary mt-1">
            Color hexadecimal para el icono y fondo de la tarjeta en la app.
          </p>
        </div>

        <Input
          label="Orden"
          type="number"
          value={order.toString()}
          onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
        />

        <RadioGroup
          label="Estado"
          value={isActive ? 'active' : 'inactive'}
          onChange={(v) => setIsActive(v === 'active')}
          options={[
            { value: 'active', label: 'Activa' },
            { value: 'inactive', label: 'Inactiva' },
          ]}
        />
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-border">
        <Button variant="secondary" onClick={onClose} disabled={saving}>
          Cancelar
        </Button>
        <Button onClick={handleSave} loading={saving}>
          {isEditing ? 'Guardar cambios' : 'Crear categoria'}
        </Button>
      </div>
    </Modal>
  );
}
