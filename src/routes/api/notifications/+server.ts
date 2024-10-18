import { json, type RequestHandler } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';
import authRef from '$lib/authorizerConfig';

export const GET: RequestHandler = async ({ request }) => {
    try {
        const session = await authRef.getSession();
        if (!session || !session.data || !session.data.user) {
            return json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = session.data.user;

        // Fetch notifications for the user
        const notifications = await prisma.notification.findMany({
            where: {
                userId: user.id
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        if (error instanceof Error) {
            return json({ error: error.message }, { status: 500 });
        }
        return json({ error: 'Internal Server Error' }, { status: 500 });
    }
};
