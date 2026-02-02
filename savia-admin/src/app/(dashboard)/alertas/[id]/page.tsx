'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, RefreshCw, Pencil, UserCheck, XCircle } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { AlertHeaderCard, MapCard, EvidenceCard } from '@/components/alertas/AlertDetailCards';
import { ReporterCard, ResponderCard, TimelineCard } from '@/components/alertas/AlertSideCards';
import { ReassignModal } from '@/components/alertas/ReassignModal';
import { fetchAlertById, updateAlertAdmin, fetchAlertUser, type AlertWithId } from '@/lib/alerts';
import { Timestamp } from 'firebase/firestore';

interface AlertDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function AlertDetailPage({ params }: AlertDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [alert, setAlert] = useState<AlertWithId | null>(null);
  const [reporter, setReporter] = useState<{ firstName: string; lastName: string; phone: string; dni: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingReporter, setLoadingReporter] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reassignOpen, setReassignOpen] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    loadAlert();
  }, [id]);

  async function loadAlert() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAlertById(id);
      if (!data) {
        setError('Alerta no encontrada');
        setLoading(false);
        return;
      }
      setAlert(data);

      // Load reporter
      if (data.createdBy) {
        setLoadingReporter(true);
        const user = await fetchAlertUser(data.createdBy);
        setReporter(user);
        setLoadingReporter(false);
      }
    } catch (err) {
      console.error('[AlertDetail] Error:', err);
      setError('Error al cargar la alerta');
    } finally {
      setLoading(false);
    }
  }

  async function handleReassign(
    agentId: string,
    agentName: string,
    institutionId: string | null,
    institutionName: string | null,
    note?: string,
  ) {
    if (!alert) return;
    const historyEntry = {
      status: 'assigned' as const,
      timestamp: Timestamp.now(),
      agentId,
      agentName,
      note: note || 'Reasignado por administrador',
    };

    await updateAlertAdmin(alert.id, {
      assignedTo: agentId,
      assignedAgentName: agentName,
      assignedInstitution: institutionId,
      assignedInstitutionName: institutionName ?? undefined,
      status: 'assigned',
      statusHistory: [...(alert.statusHistory || []), historyEntry],
    });
    await loadAlert();
  }

  async function handleCloseAlert() {
    if (!alert) return;
    setClosing(true);
    try {
      const historyEntry = {
        status: 'resolved' as const,
        timestamp: Timestamp.now(),
        note: 'Cerrada manualmente por administrador',
      };

      await updateAlertAdmin(alert.id, {
        status: 'resolved',
        statusHistory: [...(alert.statusHistory || []), historyEntry],
      });
      console.log('[AlertDetail] Alerta cerrada exitosamente:', alert.id);
      await loadAlert();
    } catch (err) {
      console.error('[AlertDetail] Error al cerrar alerta:', err);
    } finally {
      setClosing(false);
      setConfirmClose(false);
    }
  }

  if (loading) {
    return (
      <>
        <Header breadcrumb="Inicio / Alertas / Detalle" title="Cargando..." />
        <div className="p-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
        </div>
      </>
    );
  }

  if (error || !alert) {
    return (
      <>
        <Header breadcrumb="Inicio / Alertas / Detalle" title="Error" />
        <div className="p-8">
          <div className="p-6 rounded-xl bg-error/10 border border-error/20 text-center">
            <p className="text-sm text-error mb-4">{error || 'Alerta no encontrada'}</p>
            <Button variant="secondary" onClick={() => router.push('/alertas')}>
              Volver a Alertas
            </Button>
          </div>
        </div>
      </>
    );
  }

  const isOpen = alert.status !== 'resolved' && alert.status !== 'cancelled';
  const canAssign = isOpen;
  const isAssigned = !!alert.assignedTo;
  const canClose = isOpen;

  return (
    <>
      <Header
        breadcrumb={`Inicio / Alertas / ${alert.alertCode || alert.id.slice(0, 8)}`}
        title={`Alerta ${alert.alertCode || ''}`}
        actionButton={
          <div className="flex items-center gap-2">
            {canAssign && (
              <Button variant="secondary" onClick={() => setReassignOpen(true)}>
                <UserCheck className="w-4 h-4" />
                {isAssigned ? 'Reasignar' : 'Asignar'}
              </Button>
            )}
            {canClose && (
              <Button
                variant="secondary"
                onClick={() => setConfirmClose(true)}
                className="text-error border-error/30 hover:bg-error/10"
              >
                <XCircle className="w-4 h-4" />
                Cerrar Alerta
              </Button>
            )}
          </div>
        }
      />

      <div className="p-8">
        {/* Back button */}
        <button
          onClick={() => router.push('/alertas')}
          className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a alertas
        </button>

        {/* Layout 2 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          {/* Left column */}
          <div className="flex flex-col gap-6">
            <AlertHeaderCard alert={alert} />
            <MapCard alert={alert} />
            <EvidenceCard imageUrls={alert.imageUrls || []} />
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-6">
            <ReporterCard
              reporter={reporter}
              createdAt={alert.createdAt}
              loading={loadingReporter}
            />
            <ResponderCard
              agentName={alert.assignedAgentName}
              institutionName={alert.assignedInstitutionName}
              onReassign={() => setReassignOpen(true)}
            />
            <TimelineCard statusHistory={alert.statusHistory} />
          </div>
        </div>
      </div>

      {/* Reassign modal */}
      <ReassignModal
        open={reassignOpen}
        onClose={() => setReassignOpen(false)}
        onReassign={handleReassign}
        currentAgentId={alert.assignedTo}
      />

      {/* Confirm close */}
      <ConfirmDialog
        open={confirmClose}
        onCancel={() => setConfirmClose(false)}
        onConfirm={handleCloseAlert}
        title="Cerrar Alerta"
        message="¿Estás seguro de cerrar esta alerta manualmente? Se marcará como resuelta."
        variant="danger"
        confirmLabel="Cerrar Alerta"
        loading={closing}
      />
    </>
  );
}
