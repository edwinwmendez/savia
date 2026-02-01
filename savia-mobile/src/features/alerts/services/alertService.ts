import { httpsCallable } from 'firebase/functions';
import { collection, doc } from 'firebase/firestore';
import { functions, db } from '@/shared/config/firebase';
import type { CreateAlertPayload } from '@/shared/types/alert';

interface CreateAlertResponse {
  success: boolean;
  alertId: string;
  alertCode: string;
}

export async function createAlert(payload: CreateAlertPayload): Promise<CreateAlertResponse> {
  console.log('[Alerts] Creando alerta:', payload.type);
  try {
    const callable = httpsCallable<CreateAlertPayload, CreateAlertResponse>(
      functions,
      'createAlert',
    );
    const result = await callable(payload);
    console.log('[Alerts] Alerta creada:', result.data.alertCode);
    return result.data;
  } catch (error) {
    console.error('[Alerts] Error al crear alerta:', error);
    throw error;
  }
}

/** Genera un ID único para usar como prefijo de Storage antes de crear la alerta */
export function generateAlertId(): string {
  return doc(collection(db, 'alerts')).id;
}

