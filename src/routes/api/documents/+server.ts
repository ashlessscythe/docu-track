import { json, type RequestHandler } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const GET: RequestHandler = async () => {
	const documents = await prisma.document.findMany({
		include: { 
			approvals: true, 
			documentTags: { 
				include: { tag: true } 
			} 
		}
	});
	return json(documents);
};

export const POST: RequestHandler = async ({ request }) => {
	const { title, content, fileUrl, createdBy } = await request.json();
	const document = await prisma.document.create({
		data: { title, content, fileUrl, createdBy }
	});
	return json(document);
};
