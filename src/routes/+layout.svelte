<script lang="ts">
	import '../app.postcss';
	import { APP_NAME } from '$lib/config';
	import { AppShell, AppBar, initializeStores } from '@skeletonlabs/skeleton';
	import NotificationBell from '$lib/components/NotificationBell.svelte';
	import { LightSwitch } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import authRef, { checkAuthStatus } from '$lib/authorizerConfig';
	import { onMount } from 'svelte';

	// Highlight JS (keep this if you're using code highlighting in your app)
	import hljs from 'highlight.js/lib/core';
	import 'highlight.js/styles/github-dark.css';
	import { storeHighlightJs } from '@skeletonlabs/skeleton';
	import xml from 'highlight.js/lib/languages/xml';
	import css from 'highlight.js/lib/languages/css';
	import javascript from 'highlight.js/lib/languages/javascript';
	import typescript from 'highlight.js/lib/languages/typescript';
	hljs.registerLanguage('xml', xml);
	hljs.registerLanguage('css', css);
	hljs.registerLanguage('javascript', javascript);
	hljs.registerLanguage('typescript', typescript);
	storeHighlightJs.set(hljs);
	initializeStores();

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	// auth
	let isAuthenticated = false;
	onMount(async () => {
		const session = await checkAuthStatus();
		let user;
		if (session?.data?.user) {
			user = session?.data?.user;
			isAuthenticated = true;
		} else {
			isAuthenticated = false
		}
		console.log(`isAuthenticated is: ${isAuthenticated}`)
		console.log(`email is: ${session?.data?.user?.email}`)
	})

	async function logout() {
		await authRef.logout();
		isAuthenticated = false;
		goto('/');
	}
</script>

<AppShell>
	<svelte:fragment slot="header">
		<AppBar background="bg-surface-100-800-token">
			<svelte:fragment slot="lead">
				<a href="/" class="block group">
					<blockquote class="blockquote cursor-pointer transition duration-300 group-hover:bg-gray-200 group-hover:text-blue-600 p-4">
						{APP_NAME}
					</blockquote>
				</a>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				{#if isAuthenticated}
				<a class="btn btn-sm variant-ghost-surface" href="/dashboard">Dashboard</a>
				<a class="btn btn-sm variant-ghost-surface" href="/documents">Documents</a>
				<a class="btn btn-sm variant-ghost-surface" href="/approvals">Approvals</a>
				<NotificationBell />
				<button on:click={logout} class="btn btn-sm variant-ghost-surface">Logout</button>
				{:else if $page.url.pathname != '/login'}
				<a href='/login' class="btn btn-sm variant-ghost-surface">Login / Signup</a>
				{/if}
				<LightSwitch />
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>

	<div class="container mx-auto p-4 space-y-8">
		<slot />
	</div>

	<svelte:fragment slot="footer">
		<div class="container mx-auto p-4 flex justify-between">
			<p>© 2024 {APP_NAME}. All rights reserved.</p>
			<nav class="space-x-4">
				<a href="/privacy">Privacy Policy</a>
				<a href="/terms">Terms of Service</a>
				<a href="/contact">Contact Us</a>
			</nav>
		</div>
	</svelte:fragment>
</AppShell>

<style lang="postcss">
	:global(body) {
		@apply bg-surface-50-900-token;
	}

	:global(.app-bar) {
		@apply shadow-lg;
	}

	a {
		@apply text-primary-700-200-token hover:underline;
	}
</style>
