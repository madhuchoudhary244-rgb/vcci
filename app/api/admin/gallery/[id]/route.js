import { getAdminFirestore, getAdminStorage } from '../../../../../services/firebase-admin';
import { galleryCollection, galleryUpdatedTimestamp, maxGalleryImages, serializeGalleryEvent, validateGalleryEvent, validateGalleryFiles } from '../../../../../services/gallery-admin';
import { requireAdmin } from '../../../../../services/enquiry-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function eventReference(request, params) {
  if (!(await requireAdmin(request))) return null;
  const { id } = await params;
  return getAdminFirestore().collection(galleryCollection).doc(id);
}

export async function PATCH(request, { params }) {
  const reference = await eventReference(request, params);
  if (!reference) return Response.json({ message: 'Unauthorized.' }, { status: 401 });
  try {
    const form = await request.formData();
    const event = validateGalleryEvent(Object.fromEntries(form));
    const files = validateGalleryFiles(form.getAll('images').filter((item) => item instanceof File));
    const current = await reference.get();
    if (!current.exists || !event || !files) return Response.json({ message: 'Invalid gallery event.' }, { status: 400 });
    const currentImages = serializeGalleryEvent(current).images;
    const removedPaths = form.getAll('removedPaths').filter((value) => typeof value === 'string');
    const keptImages = currentImages.filter((image) => !removedPaths.includes(image.path));
    if (keptImages.length + files.length > maxGalleryImages) return Response.json({ message: `An event can contain up to ${maxGalleryImages} images.` }, { status: 400 });
    const newImages = files.length ? await (await import('../route.js')).uploadFiles?.(reference.id, files) : [];
    await reference.update({ ...event, images: [...keptImages, ...newImages], updatedAt: galleryUpdatedTimestamp() });
    if (removedPaths.length) await Promise.all(removedPaths.map((path) => getAdminStorage().file(path).delete({ ignoreNotFound: true })));
    return Response.json({ event: serializeGalleryEvent(await reference.get()) });
  } catch (error) {
    console.error('Unable to update gallery event.', error);
    const message = error?.code === 404 ? 'Firebase Storage is not available for this project yet. Complete the Storage setup before uploading gallery photos.' : 'Unable to update this gallery event.';
    return Response.json({ message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const reference = await eventReference(request, params);
  if (!reference) return Response.json({ message: 'Unauthorized.' }, { status: 401 });
  try {
    const snapshot = await reference.get();
    if (!snapshot.exists) return Response.json({ message: 'Gallery event not found.' }, { status: 404 });
    const event = serializeGalleryEvent(snapshot);
    await reference.delete();
    await Promise.all(event.images.map((image) => image.path && getAdminStorage().file(image.path).delete({ ignoreNotFound: true })));
    return Response.json({ message: 'Gallery event deleted.' });
  } catch (error) {
    console.error('Unable to delete gallery event.', error);
    return Response.json({ message: 'Unable to delete this gallery event.' }, { status: 500 });
  }
}
