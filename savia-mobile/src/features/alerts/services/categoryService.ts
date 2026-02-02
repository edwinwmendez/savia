import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/shared/config/firebase';
import type { AlertCategory } from '@/shared/types/alert';
import { ALERT_CATEGORIES } from '@/features/alerts/data/categories';

export async function fetchCategories(): Promise<AlertCategory[]> {
  try {
    const ref = collection(db, 'categories');
    const q = query(ref, where('isActive', '==', true), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.warn('[Categories] Colección vacía, usando fallback');
      return ALERT_CATEGORIES;
    }

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: data.code ?? doc.id,
        name: data.name,
        icon: data.icon ?? 'HelpCircle',
        color: data.color ?? '#607D8B',
        order: data.order ?? 0,
      };
    });
  } catch (error) {
    console.error('[Categories] Error:', error);
    return ALERT_CATEGORIES;
  }
}
