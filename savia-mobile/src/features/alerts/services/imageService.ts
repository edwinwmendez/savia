import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytesResumable, getDownloadURL, type UploadMetadata } from 'firebase/storage';
import { storage } from '@/shared/config/firebase';

export async function pickImageFromCamera(): Promise<string | null> {
  console.log('[Image] Abriendo cámara...');
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    console.log('[Image] Permiso de cámara denegado');
    return null;
  }
  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ['images'],
    quality: 0.7,
  });
  if (result.canceled) return null;
  console.log('[Image] Foto tomada:', result.assets[0].uri);
  return result.assets[0].uri;
}

export async function pickImageFromGallery(): Promise<string | null> {
  console.log('[Image] Abriendo galería...');
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    console.log('[Image] Permiso de galería denegado');
    return null;
  }
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    quality: 0.7,
  });
  if (result.canceled) return null;
  console.log('[Image] Imagen seleccionada:', result.assets[0].uri);
  return result.assets[0].uri;
}

export async function uploadImage(
  localUri: string,
  alertId: string,
  index: number,
): Promise<string> {
  console.log('[Image] Subiendo imagen', index, 'para alerta', alertId);
  const response = await fetch(localUri);
  const blob = await response.blob();
  const storageRef = ref(storage, `alerts/${alertId}/evidence_${index}.jpg`);
  const metadata: UploadMetadata = { contentType: 'image/jpeg' };
  await uploadBytesResumable(storageRef, blob, metadata);
  const downloadUrl = await getDownloadURL(storageRef);
  console.log('[Image] URL de descarga:', downloadUrl);
  return downloadUrl;
}
