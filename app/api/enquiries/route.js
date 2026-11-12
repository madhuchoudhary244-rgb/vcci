import { getAdminFirestore } from '../../../services/firebase-admin';
import { enquiryTimestamps, requireAdmin, serializeEnquiry, validateEnquiryInput } from '../../../services/enquiry-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const unavailableMessage = 'Unable to submit your enquiry right now. Please try again or contact VCCI directly.';

export async function POST(request) {
  try {
    if (!request.headers.get('content-type')?.includes('application/json')) return Response.json({ message: unavailableMessage }, { status: 400 });
    const enquiry = validateEnquiryInput(await request.json());
    if (!enquiry) return Response.json({ message: unavailableMessage }, { status: 400 });
    await getAdminFirestore().collection('enquiries').add({ ...enquiry, status: 'New', ...enquiryTimestamps() });
    return Response.json({ message: 'Thank you. Your enquiry has been submitted successfully. VCCI will contact you.' }, { status: 201 });
  } catch {
    return Response.json({ message: unavailableMessage }, { status: 500 });
  }
}

export async function GET(request) {
  if (!(await requireAdmin(request))) return Response.json({ message: 'Unauthorized.' }, { status: 401 });
  try {
    const snapshot = await getAdminFirestore().collection('enquiries').get();
    const enquiries = snapshot.docs
      .map(serializeEnquiry)
      .sort((first, second) => (Date.parse(second.createdAt || '') || 0) - (Date.parse(first.createdAt || '') || 0));
    return Response.json({ enquiries });
  } catch (error) {
    console.error('Unable to load admin enquiries.', error);
    return Response.json({ message: 'Unable to load enquiries.' }, { status: 500 });
  }
}
