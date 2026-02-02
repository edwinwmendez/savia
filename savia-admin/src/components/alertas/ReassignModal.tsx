'use client';

import { useState, useEffect } from 'react';
import { UserCheck } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Select, type SelectOption } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { fetchUsers, type UserWithId } from '@/lib/users';
import { fetchInstitutions } from '@/lib/institutions';
import type { InstitutionData } from '@/types';

interface ReassignModalProps {
  open: boolean;
  onClose: () => void;
  onReassign: (agentId: string, agentName: string, institutionId: string | null, institutionName: string | null, note?: string) => Promise<void>;
  currentAgentId?: string | null;
}

export function ReassignModal({
  open,
  onClose,
  onReassign,
  currentAgentId,
}: ReassignModalProps) {
  const [agents, setAgents] = useState<UserWithId[]>([]);
  const [institutions, setInstitutions] = useState<InstitutionData[]>([]);
  const [selectedAgent, setSelectedAgent] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!open) return;
    setSelectedAgent('');
    setSelectedInstitution('');
    setNote('');

    Promise.all([
      fetchUsers({ role: 'agent', isActive: true }),
      fetchInstitutions({ isActive: true }),
    ])
      .then(([agentsData, instData]) => {
        setAgents(agentsData.filter((a) => a.id !== currentAgentId));
        setInstitutions(instData);
      })
      .catch(console.error)
      .finally(() => setLoadingData(false));
  }, [open, currentAgentId]);

  const agentOptions: SelectOption[] = agents.map((a) => ({
    value: a.id,
    label: `${a.firstName} ${a.lastName}`,
  }));


  const isReassign = !!currentAgentId;

  // Auto-set institution from agent (institution is tied to agent, not editable separately)
  const selectedAgentData = agents.find((a) => a.id === selectedAgent);
  const agentInstitution = selectedAgentData?.institutionId || '';
  const agentInstitutionName = institutions.find((i) => i.id === agentInstitution)?.name || '';

  useEffect(() => {
    if (selectedAgent && selectedAgentData?.institutionId) {
      setSelectedInstitution(selectedAgentData.institutionId);
    } else {
      setSelectedInstitution('');
    }
  }, [selectedAgent, agents]);

  async function handleReassign() {
    if (!selectedAgent) return;
    setSaving(true);
    try {
      const agent = agents.find((a) => a.id === selectedAgent);
      const agentName = agent ? `${agent.firstName} ${agent.lastName}` : '';
      const inst = institutions.find((i) => i.id === selectedInstitution);
      await onReassign(
        selectedAgent,
        agentName,
        selectedInstitution || null,
        inst?.name || null,
        note || undefined,
      );
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isReassign ? 'Reasignar Alerta' : 'Asignar Alerta'}
      subtitle={isReassign ? 'Seleccionar nuevo agente responsable' : 'Seleccionar agente para atender esta alerta'}
      icon={UserCheck}
      width={520}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleReassign}
            loading={saving}
            disabled={!selectedAgent}
          >
            {isReassign ? 'Reasignar' : 'Asignar'}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {loadingData ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
          </div>
        ) : (
          <>
            <Select
              label="Agente *"
              options={agentOptions}
              value={selectedAgent}
              onChange={setSelectedAgent}
              placeholder="Seleccionar agente..."
            />
            <Input
              label="Institución"
              value={agentInstitutionName || 'Sin institución'}
              onChange={() => {}}
              disabled
            />
            <Input
              label="Nota (opcional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={isReassign ? 'Motivo de la reasignación...' : 'Nota adicional...'}
            />
          </>
        )}
      </div>
    </Modal>
  );
}
