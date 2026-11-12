import { randomUUID } from 'crypto';
import { getAdminFirestore, getAdminStorage } from '../../../../services/firebase-admin';
import { galleryCollection, galleryTimestamps, maxGalleryImages, serializeGalleryEvent, validateGalleryEvent, validateGalleryFiles } from '../../../../services/gallery-admin';
import { requireAdmin } from '../../../../services/enquiry-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function denied(request) { return requireAdmin(request); }

export async function uploadFiles(eventId, files) {
  const bucket = getAdminStorage();
  return Promise.all(files.map(async (file) => {
    const extension = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
    const path = `gallery/${eventId}/${randomUUID()}.${extension}`;
    const token = randomUUID();
    await bucket.file(path).save(Buffer.from(await file.arrayBuffer()), { resumable: false, metadata: { contentType: file.type, cacheControl: 'public,max-age=31536000,immutable', metadata: { firebaseStorageDownloadTokens: token } } });
    return { path, url: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(path)}?alt=media&token=${token}` };
  }));
}

export async function GET(request) {
  if (!(await denied(request))) return Response.json({ message: 'Unauthorized.' }, { status: 401 });
  try {
    const snapshot = await getAdminFirestore().collection(galleryCollection).get();
    return Response.json({ events: snapshot.docs.map(serializeGalleryEvent).sort((a, b) => b.eventDate.localeCompare(a.eventDate)) });
  } catch (error) {
    console.error('Unable to load admin gallery.', error);
    return Response.json({ message: 'Unable to load gallery events.' }, { status: 500 });
  }
}

export async function POST(request) {
  if (!(await denied(request))) return Response.json({ message: 'Unauthorized.' }, { status: 401 });
  try {
    const form = await request.formData();
    const event = validateGalleryEvent(Object.fromEntries(form));
    const files = validateGalleryFiles(form.getAll('images').filter((item) => item instanceof File));
    if (!event || !files || files.length === 0 || files.length > maxGalleryImages) return Response.json({ message: 'Enter a title, valid date, and up to six JPG, PNG, or WebP images (5 MB each).' }, { status: 400 });
    const reference = getAdminFirestore().collection(galleryCollection).doc();
    const images = await uploadFiles(reference.id, files);
    await reference.set({ ...event, images, ...galleryTimestamps() });
    return Response.json({ event: serializeGalleryEvent(await reference.get()) }, { status: 201 });
  } catch (error) {
    console.error('Unable to create gallery event.', error);
    const message = error?.code === 404 ? 'Firebase Storage is not available for this project yet. Complete the Storage setup before uploading gallery photos.' : 'Unable to save this gallery event.';
    return Response.json({ message }, { status: 500 });
  }
}
