import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

const SEED_CATEGORIES = [
  { code: 'robbery', name: 'Robo/Asalto', shortName: 'Robo', emoji: '\u{1F6A8}', icon: 'Siren', color: '#D32F2F', order: 1 },
  { code: 'accident', name: 'Accidente', shortName: 'Accidente', emoji: '\u{1F697}', icon: 'Car', color: '#F57C00', order: 2 },
  { code: 'medical', name: 'Emergencia M\u00e9dica', shortName: 'M\u00e9dica', emoji: '\u{1F493}', icon: 'HeartPulse', color: '#E91E63', order: 3 },
  { code: 'fire', name: 'Incendio', shortName: 'Incendio', emoji: '\u{1F525}', icon: 'Flame', color: '#FF5722', order: 4 },
  { code: 'electrical', name: 'Falla El\u00e9ctrica', shortName: 'El\u00e9ctrica', emoji: '\u{26A1}', icon: 'Zap', color: '#FFC107', order: 5 },
  { code: 'water', name: 'Problema de Agua', shortName: 'Agua', emoji: '\u{1F4A7}', icon: 'Droplets', color: '#2196F3', order: 6 },
  { code: 'lost', name: 'P\u00e9rdida/Hallazgo', shortName: 'P\u00e9rdida', emoji: '\u{1F50D}', icon: 'Search', color: '#9C27B0', order: 7 },
  { code: 'other', name: 'Otro', shortName: 'Otro', emoji: '\u{270F}\u{FE0F}', icon: 'Pencil', color: '#607D8B', order: 8 },
];

export async function seedCategories(): Promise<number> {
  let count = 0;
  for (const cat of SEED_CATEGORIES) {
    const ref = doc(db, 'categories', cat.code);
    await setDoc(ref, {
      ...cat,
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    count++;
  }
  console.log(`[Seed] ${count} categor\u00edas creadas`);
  return count;
}
