import { writable } from 'svelte/store';
import { checkAuthStatus } from '$lib/authorizerConfig';

function createAuthStore() {
    const { subscribe, set } = writable(false);

    return {
        subscribe,
        login: async () => {
            const session = await checkAuthStatus();
            set(!!session?.data?.user);
        },
        logout: () => set(false),
        check: async () => {
            const session = await checkAuthStatus();
            set(!!session?.data?.user);
        }
    };
}

export const isAuthenticated = createAuthStore();