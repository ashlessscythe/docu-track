import { writable } from 'svelte/store';
import { checkAuthStatus, type User } from '$lib/authorizerConfig';

function createAuthStore() {
    const { subscribe, set } = writable(false);

    return {
        subscribe,
        login: async () => {
            const user = await checkAuthStatus();
            set(!!user);
            if (user) {
                userStore.set(user);
            }
        },
        logout: () => {
            set(false);
            userStore.set(null);
        },
        check: async () => {
            const user = await checkAuthStatus();
            set(!!user);
            if (user) {
                userStore.set(user);
            } else {
                userStore.set(null);
            }
        }
    };
}

export const isAuthenticated = createAuthStore();
export const userStore = writable<User | null>(null);