'use client';

import { useState, useEffect } from 'react';
import { Building2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { RadioGroup } from '@/components/ui/RadioGroup';
import { Checkbox } from '@/components/ui/Checkbox';
import { fetchCategories } from '@/lib/categories';
import type { InstitutionData, InstitutionType, CategoryData } from '@/types';

const typeOptions = [
  { value: 'pnp', label: 'PNP' },
  { value: 'serenazgo', label: 'Serenazgo' },
  { value: 'bomberos', label: 'Bomberos' },
  { value: 'salud', label: 'Salud' },
  { value: 'otro', label: 'Otro' },
];

const FALLBACK_ALERT_TYPE_OPTIONS = [
  { value: 'robbery', label: 'Robo / Asalto' },
  { value: 'accident', label: 'Accidente' },
  { value: 'medical', label: 'Emergencia Médica' },
  { value: 'fire', label: 'Incendio' },
  { value: 'electrical', label: 'Peligro Eléctrico' },
  { value: 'water', label: 'Inundación' },
  { value: 'lost', label: 'Persona Perdida' },
  { value: 'other', label: 'Otro' },
];

interface InstitutionModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<InstitutionData, 'id' | 'createdAt' | 'updatedAt' | 'agentCount'>) => Promise<void>;
  institution?: InstitutionData | null;
}

export function InstitutionModal({
  open,
  onClose,
  onSave,
  institution,
}: InstitutionModalProps) {
  const isEditing = !!institution?.id;

  const [alertTypeOptions, setAlertTypeOptions] = useState(FALLBACK_ALERT_TYPE_OPTIONS);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    fetchCategories()
      .then((cats: CategoryData[]) => {
        const active = cats.filter((c) => c.isActive);
        if (active.length > 0) {
          setAlertTypeOptions(
            active.map((c) => ({ value: c.code, label: `${c.emoji} ${c.name}` })),
          );
        }
      })
      .catch((err) => {
        console.error('[InstitutionModal] Error cargando categorias:', err);
      })
      .finally(() => setLoadingCategories(false));
  }, []);

  const [name, setName] = useState('');
  const [type, setType] = useState<InstitutionType | ''>('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [schedule, setSchedule] = useState('');
  const [alertTypes, setAlertTypes] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (institution) {
      setName(institution.name);
      setType(institution.type);
      setPhone(institution.phone);
      setEmail(institution.email);
      setAddress(institution.address);
      setSchedule(institution.schedule);
      setAlertTypes(institution.alertTypes || []);
      setIsActive(institution.isActive);
    } else {
      setName('');
      setType('');
      setPhone('');
      setEmail('');
      setAddress('');
      setSchedule('');
      setAlertTypes([]);
      setIsActive(true);
    }
    setErrors({});
  }, [institution, open]);

  function toggleAlertType(value: string) {
    setAlertTypes((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value],
    );
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'El nombre es requerido';
    if (!type) newErrors.type = 'El tipo es requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave({
        name: name.trim(),
        type: type as InstitutionType,
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        schedule: schedule.trim(),
        alertTypes,
        isActive,
      });
      onClose();
    } catch (err) {
      console.error('[InstitutionModal] Error:', err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Editar Institución' : 'Nueva Institución'}
      subtitle={isEditing ? `Editando: ${institution?.name}` : 'Registrar nueva institución en el sistema'}
      icon={Building2}
      width={560}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={saving}>
            {isEditing ? 'Guardar Cambios' : 'Crear Institución'}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Input
          label="Nombre de la Institución *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Comisaría de Atalaya"
          error={errors.name}
        />

        <Select
          label="Tipo de Institución *"
          options={typeOptions}
          value={type}
          onChange={(v) => setType(v as InstitutionType)}
          placeholder="Seleccionar tipo..."
          error={errors.type}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Teléfono"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Ej: 063-461234"
          />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ej: comisaria@pnp.gob.pe"
          />
        </div>

        <Input
          label="Dirección"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Ej: Jr. Raimondi 456, Atalaya"
        />

        <Input
          label="Horario de Atención"
          value={schedule}
          onChange={(e) => setSchedule(e.target.value)}
          placeholder="Ej: 24 horas"
        />

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-text-primary">
            Tipos de Alerta que Atiende
          </span>
          {loadingCategories ? (
            <p className="text-sm text-text-secondary">Cargando categorias...</p>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {alertTypeOptions.map((opt) => (
                <Checkbox
                  key={opt.value}
                  label={opt.label}
                  checked={alertTypes.includes(opt.value)}
                  onChange={() => toggleAlertType(opt.value)}
                />
              ))}
            </div>
          )}
        </div>

        <RadioGroup
          label="Estado"
          options={[
            { value: 'true', label: 'Activo' },
            { value: 'false', label: 'Inactivo' },
          ]}
          value={String(isActive)}
          onChange={(v) => setIsActive(v === 'true')}
        />
      </div>
    </Modal>
  );
}
