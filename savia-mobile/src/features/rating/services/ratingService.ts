import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { db, auth } from '@/shared/config/firebase';
import type { RatingData } from '@/shared/types/rating';

/**
 * Envía una calificación para una alerta resuelta.
 * Crea un doc en `ratings` y actualiza los campos rating/ratingId en la alerta.
 */
export async function submitRating(
  alertId: string,
  rating: number,
  comment?: string,
  agentId?: string,
): Promise<string> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Usuario no autenticado');

  const ratingsRef = collection(db, 'ratings');
  const ratingDoc = await addDoc(ratingsRef, {
    alertId,
    rating,
    comment: comment || null,
    ratedBy: uid,
    agentId: agentId || null,
    createdAt: serverTimestamp(),
  });

  console.log('[Rating] Calificación creada:', ratingDoc.id);

  // Actualizar la alerta con la calificación
  const alertRef = doc(db, 'alerts', alertId);
  await updateDoc(alertRef, {
    rating,
    ratingId: ratingDoc.id,
    updatedAt: serverTimestamp(),
  });

  console.log('[Rating] Alerta actualizada con rating:', alertId);
  return ratingDoc.id;
}

/**
 * Verifica si el ciudadano actual ya calificó una alerta.
 */
export async function fetchRatingForAlert(
  alertId: string,
): Promise<RatingData | null> {
  const uid = auth.currentUser?.uid;
  if (!uid) return null;

  const ratingsRef = collection(db, 'ratings');
  const q = query(
    ratingsRef,
    where('alertId', '==', alertId),
    where('ratedBy', '==', uid),
  );
  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const d = snapshot.docs[0];
  return { id: d.id, ...d.data() } as RatingData;
}
