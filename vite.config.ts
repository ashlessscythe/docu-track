import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export default defineConfig({
	plugins: [sveltekit(), purgeCss()],
	define: {
		// Expose environment variables to the client-side code
		'process.env': process.env
	}
});
