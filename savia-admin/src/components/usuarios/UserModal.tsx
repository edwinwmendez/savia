'use client';

import { useState, useEffect } from 'react';
import { UserPlus } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, type SelectOption } from '@/components/ui/Select';
import { RadioGroup } from '@/components/ui/RadioGroup';
import { Checkbox } from '@/components/ui/Checkbox';
import type { UserRole, InstitutionData } from '@/types';
import type { UserWithId, CreateUserInput } from '@/lib/users';

const roleOptions: SelectOption[] = [
  { value: 'agent', label: 'Agente' },
  { value: 'citizen', label: 'Ciudadano' },
  { value: 'admin', label: 'Administrador' },
];

interface UserModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: CreateUserInput) => Promise<void>;
  onUpdate?: (id: string, data: Partial<UserWithId>) => Promise<void>;
  user?: UserWithId | null;
  institutions: InstitutionData[];
}

export function UserModal({
  open,
  onClose,
  onSave,
  onUpdate,
  user,
  institutions,
}: UserModalProps) {
  const isEditing = !!user?.id;

  const [dni, setDni] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole | ''>('agent');
  const [institutionId, setInstitutionId] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [sendCredentials, setSendCredentials] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const institutionOptions: SelectOption[] = institutions
    .filter((i) => i.isActive)
    .map((i) => ({ value: i.id!, label: i.name }));

  useEffect(() => {
    if (user) {
      setDni(user.dni);
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setPhone(user.phone);
      setEmail(user.email);
      setRole(user.role);
      setInstitutionId(user.institutionId || '');
      setIsActive(user.isActive);
    } else {
      setDni('');
      setFirstName('');
      setLastName('');
      setPhone('');
      setEmail('');
      setRole('agent');
      setInstitutionId('');
      setIsActive(true);
      setSendCredentials(true);
    }
    setErrors({});
  }, [user, open]);

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!dni.trim()) newErrors.dni = 'El DNI es requerido';
    else if (!/^\d{8}$/.test(dni.trim())) newErrors.dni = 'El DNI debe tener 8 dígitos';
    if (!firstName.trim()) newErrors.firstName = 'El nombre es requerido';
    if (!lastName.trim()) newErrors.lastName = 'El apellido es requerido';
    if (!phone.trim()) newErrors.phone = 'El celular es requerido';
    if (!email.trim()) newErrors.email = 'El email es requerido';
    if (!role) newErrors.role = 'El rol es requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSaving(true);
    try {
      if (isEditing && onUpdate) {
        await onUpdate(user!.id, {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: phone.trim(),
          role: role as UserRole,
          institutionId: institutionId || undefined,
          isActive,
        });
      } else {
        await onSave({
          dni: dni.trim(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          role: role as UserRole,
          institutionId: institutionId || undefined,
          sendCredentials,
        });
      }
      onClose();
    } catch (err) {
      console.error('[UserModal] Error:', err);
      const msg = err instanceof Error ? err.message : 'Error al guardar usuario';
      setErrors({ submit: msg });
    } finally {
      setSaving(false);
    }
  }

  const roleEmojis: Record<string, string> = {
    agent: '👮',
    citizen: '👤',
    admin: '🛡️',
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
      subtitle={
        isEditing
          ? `${roleEmojis[user!.role]} ${user!.firstName} ${user!.lastName}`
          : 'Registrar nuevo usuario en el sistema'
      }
      icon={UserPlus}
      width={520}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={saving}>
            {isEditing ? 'Guardar Cambios' : 'Crear Usuario'}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {errors.submit && (
          <div className="p-3 rounded-md bg-error/10 border border-error/20">
            <p className="text-sm text-error">{errors.submit}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="DNI *"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            placeholder="12345678"
            maxLength={8}
            error={errors.dni}
            disabled={isEditing}
          />
          <Input
            label="Celular *"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="987654321"
            error={errors.phone}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Nombres *"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Juan"
            error={errors.firstName}
          />
          <Input
            label="Apellidos *"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Pérez"
            error={errors.lastName}
          />
        </div>

        <Input
          label="Email *"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="juan.perez@email.com"
          error={errors.email}
          disabled={isEditing}
        />

        <Select
          label="Institución Asignada"
          options={institutionOptions}
          value={institutionId}
          onChange={setInstitutionId}
          placeholder="Sin institución"
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Rol *"
            options={roleOptions}
            value={role}
            onChange={(v) => setRole(v as UserRole)}
            placeholder="Seleccionar rol..."
            error={errors.role}
          />
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

        {!isEditing && (
          <Checkbox
            label="Enviar credenciales por email"
            checked={sendCredentials}
            onChange={setSendCredentials}
          />
        )}
      </div>
    </Modal>
  );
}
