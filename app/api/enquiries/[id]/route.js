import { getAdminFirestore } from '../../../../services/firebase-admin';
import { enquiryStatuses, enquiryUpdatedTimestamp, requireAdmin, serializeEnquiry } from '../../../../services/enquiry-admin';

export const runtime = 'nodejs';

async function authorized(request) {
  return Boolean(await requireAdmin(request));
}

export async function GET(request, { params }) {
  if (!(await authorized(request))) return Response.json({ message: 'Unauthorized.' }, { status: 401 });
  try {
    const { id } = await params;
    const snapshot = await getAdminFirestore().collection('enquiries').doc(id).get();
    if (!snapshot.exists) return Response.json({ message: 'Not found.' }, { status: 404 });
    return Response.json({ enquiry: serializeEnquiry(snapshot) });
  } catch {
    return Response.json({ message: 'Unable to load enquiry.' }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  if (!(await authorized(request))) return Response.json({ message: 'Unauthorized.' }, { status: 401 });
  try {
    const body = await request.json();
    if (!body || Object.keys(body).length !== 1 || !enquiryStatuses.includes(body.status)) return Response.json({ message: 'Invalid status.' }, { status: 400 });
    const { id } = await params;
    const reference = getAdminFirestore().collection('enquiries').doc(id);
    if (!(await reference.get()).exists) return Response.json({ message: 'Not found.' }, { status: 404 });
    await reference.update({ status: body.status, updatedAt: enquiryUpdatedTimestamp() });
    return Response.json({ status: body.status });
  } catch {
    return Response.json({ message: 'Unable to update enquiry.' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  if (!(await authorized(request))) return Response.json({ message: 'Unauthorized.' }, { status: 401 });
  try {
    const { id } = await params;
    const reference = getAdminFirestore().collection('enquiries').doc(id);
    if (!(await reference.get()).exists) return Response.json({ message: 'Not found.' }, { status: 404 });
    await reference.delete();
    return Response.json({ success: true });
  } catch {
    return Response.json({ message: 'Unable to delete enquiry.' }, { status: 500 });
  }
}
