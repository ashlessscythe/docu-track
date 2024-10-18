import { json, type RequestHandler } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';

export const GET: RequestHandler = async () => {
	const approvals = await prisma.approval.findMany({
		include: { document: true }
	});
	return json(approvals);
};

export const POST: RequestHandler = async ({ request }) => {
	const { documentId, approverId, status, comment } = await request.json();
	const approval = await prisma.approval.create({
		data: {
			documentId,
			approverId,
			status,
			comment
		}
	});
	return json(approval);
};

export const PUT: RequestHandler = async ({ request, params }) => {
	const { status, comment } = await request.json();
	const updatedApproval = await prisma.approval.update({
		where: { id: params.id },
		data: { status, comment }
	});
	return json(updatedApproval);
};
