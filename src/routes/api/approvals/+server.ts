import { json, type RequestHandler } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';

export const GET: RequestHandler = async () => {
	const approvals = await prisma.approvals.findMany({
		include: { users: true, documents: true }
	});
	return json(approvals);
};

export const POST: RequestHandler = async ({ request }) => {
	const { document_id, approver_id, status, comment } = await request.json();
	const approval = await prisma.approvals.create({
		data: {
			document_id,
			approver_id,
			status,
			comment
		}
	});
	return json(approval);
};

export const PUT: RequestHandler = async ({ request, params }) => {
	const { status, comment } = await request.json();
	const updatedApproval = await prisma.approvals.update({
		where: { id: params.id },
		data: { status, comment }
	});
	return json(updatedApproval);
};
