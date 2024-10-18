import { writable } from 'svelte/store';
import authRef, { type User } from '$lib/authorizerConfig';
import { isAuthenticated, userStore } from '$lib/stores/auth';

export interface Notification {
    id: string;
    type: 'approval' | 'message';
    status: 'pending' | 'approved' | 'rejected';
    message: string;
    createdAt: Date;
}

function createNotificationStore() {
    const { subscribe, set, update } = writable<Notification[]>([]);

    return {
        subscribe,
        fetchNotifications: async (user: User | null) => {
            if (!user) {
                set([]);
                return;
            }

            try {
                const session = await authRef.getSession();
                if (!session || !session.data || !session.data.access_token) {
                    console.error('No valid session found');
                    set([]);
                    return;
                }

                const response = await fetch('/api/notifications', {
                    headers: {
                        'Authorization': `Bearer ${session.data.access_token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const notifications: Notification[] = await response.json();
                
                // Filter notifications based on user role
                const filteredNotifications = notifications.filter(notification => {
                    if (notification.type === 'approval') {
                        return user.roles?.includes('doc-approver') || user.roles?.includes('doc-admin') || false;
                    }
                    return true; // Show all messages to all users
                });

                set(filteredNotifications);
            } catch (error) {
                console.error('Failed to fetch notifications:', error);
                set([]);
            }
        },
        addNotification: (notification: Notification) => {
            update(notifications => [notification, ...notifications]);
        },
        removeNotification: (id: string) => {
            update(notifications => notifications.filter(n => n.id !== id));
        },
        clearNotifications: () => {
            set([]);
        }
    };
}

export const notificationStore = createNotificationStore();

// Subscribe to userStore changes to update notifications
userStore.subscribe(user => {
    notificationStore.fetchNotifications(user);
});
