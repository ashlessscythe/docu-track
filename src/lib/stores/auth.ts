// src/lib/stores/auth.ts
import { writable } from 'svelte/store';

function createAuthStore() {
	const { subscribe, set, update } = writable({
		isAuthenticated: false,
		user: null
	});

	return {
		subscribe,
		login: (userData) => update((state) => ({ ...state, isAuthenticated: true, user: userData })),
		logout: () => set({ isAuthenticated: false, user: null }),
		checkAuth: () => {
			// Check for auth token in localStorage or cookies
			const token = localStorage.getItem('authToken');
			if (token) {
				// Validate token with your backend or authorizer.dev
				// If valid, call login() with user data
			}
		}
	};
}

export const auth = createAuthStore();
