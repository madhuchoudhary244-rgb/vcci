import { getAdminFirestore } from '../../../services/firebase-admin';
import { galleryCollection, serializeGalleryEvent } from '../../../services/gallery-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const snapshot = await getAdminFirestore().collection(galleryCollection).get();
    const events = snapshot.docs.map(serializeGalleryEvent).sort((a, b) => b.eventDate.localeCompare(a.eventDate));
    return Response.json({ events });
  } catch (error) {
    console.error('Unable to load public gallery.', error);
    return Response.json({ message: 'Gallery is currently unavailable.' }, { status: 500 });
  }
}
