/**
 * Thin helpers around expo-image-picker and expo-document-picker so screens
 * never have to know which permission to ask for. Returns a normalised
 * `LocalAttachment` shape that the upload service can later post.
 *
 * Note: actual upload to a presigned URL is out of scope until the backend
 * exposes one. For now we hand the screen the local URI and lean on the
 * web's PATCH-with-URL flow so users can still record submissions/payment
 * proofs by URL or skip the upload.
 */

import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

export interface LocalAttachment {
  uri: string;
  name: string;
  mime?: string;
  size?: number;
  kind: 'image' | 'document';
}

export async function pickImage(): Promise<LocalAttachment | null> {
  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) return null;
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 0.8,
  });
  if (result.canceled || !result.assets?.length) return null;
  const a = result.assets[0];
  return {
    uri: a.uri,
    name: a.fileName ?? `image-${Date.now()}.jpg`,
    mime: a.mimeType ?? 'image/jpeg',
    size: a.fileSize,
    kind: 'image',
  };
}

export async function takePhoto(): Promise<LocalAttachment | null> {
  const perm = await ImagePicker.requestCameraPermissionsAsync();
  if (!perm.granted) return null;
  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    quality: 0.8,
  });
  if (result.canceled || !result.assets?.length) return null;
  const a = result.assets[0];
  return {
    uri: a.uri,
    name: a.fileName ?? `photo-${Date.now()}.jpg`,
    mime: a.mimeType ?? 'image/jpeg',
    size: a.fileSize,
    kind: 'image',
  };
}

export async function pickDocument(): Promise<LocalAttachment | null> {
  const result = await DocumentPicker.getDocumentAsync({
    type: '*/*',
    multiple: false,
    copyToCacheDirectory: true,
  });
  if (result.canceled || !result.assets?.length) return null;
  const a = result.assets[0];
  return {
    uri: a.uri,
    name: a.name,
    mime: a.mimeType ?? undefined,
    size: a.size,
    kind: 'document',
  };
}
