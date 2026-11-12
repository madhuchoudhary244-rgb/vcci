import 'server-only';
import { FieldValue } from 'firebase-admin/firestore';

export const galleryCollection = 'galleryEvents';
export const maxGalleryImages = 6;
export const maxGalleryImageBytes = 5 * 1024 * 1024;
const imageTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

export function validateGalleryEvent(values) {
  const title = typeof values.title === 'string' ? values.title.trim() : '';
  const eventDate = typeof values.eventDate === 'string' ? values.eventDate : '';
  const description = typeof values.description === 'string' ? values.description.trim() : '';
  if (!title || title.length > 100 || !/^\d{4}-\d{2}-\d{2}$/.test(eventDate) || description.length > 400) return null;
  return { title, eventDate, description };
}

export function validateGalleryFiles(files) {
  if (!Array.isArray(files) || files.length > maxGalleryImages) return null;
  if (files.some((file) => !imageTypes.has(file.type) || file.size === 0 || file.size > maxGalleryImageBytes)) return null;
  return files;
}

export function galleryTimestamps() {
  return { createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() };
}

export function galleryUpdatedTimestamp() {
  return FieldValue.serverTimestamp();
}

function dateValue(value) {
  return value?.toDate?.().toISOString() || (typeof value === 'string' ? value : null);
}

export function serializeGalleryEvent(snapshot) {
  const value = snapshot.data() || {};
  return {
    id: snapshot.id,
    title: typeof value.title === 'string' ? value.title : 'Untitled event',
    eventDate: typeof value.eventDate === 'string' ? value.eventDate : '',
    description: typeof value.description === 'string' ? value.description : '',
    images: Array.isArray(value.images) ? value.images.filter((image) => image && typeof image.url === 'string').map((image) => ({ path: image.path, url: image.url })) : [],
    createdAt: dateValue(value.createdAt),
    updatedAt: dateValue(value.updatedAt),
  };
}
