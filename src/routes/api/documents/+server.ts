import { json, type RequestHandler } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const GET: RequestHandler = async () => {
	const documents = await prisma.documents.findMany({
		include: { approvals: true, document_tags: { include: { tags: true } } }
	});
	return json(documents);
};

export const POST: RequestHandler = async ({ request }) => {
	const { title, content, file_url, created_by } = await request.json();
	const document = await prisma.documents.create({
		data: { title, content, file_url, created_by }
	});
	return json(document);
};
