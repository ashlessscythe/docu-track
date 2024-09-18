import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/prisma';

export const PUT: RequestHandler = async ({ params, request }) => {
	const { id } = params;
	const { status, comment } = await request.json();

	try {
		const updatedApproval = await prisma.approvals.update({
			where: { id },
			data: { status, comment }
		});
		return json(updatedApproval);
	} catch (error) {
		console.error('Error updating approval:', error);
		return json({ error: 'Failed to update approval' }, { status: 500 });
	}
};
