<script lang="ts">
	import '../app.postcss';
	import { APP_NAME } from '$lib/config';
	import {
		AppShell,
		AppBar,
		type ModalComponent,
		Drawer,
		LightSwitch
	} from '@skeletonlabs/skeleton';
	import NotificationBell from '$lib/components/NotificationBell.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import authRef, { type User } from '$lib/authorizerConfig';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { isAuthenticated, userStore } from '$lib/stores/auth';
	import { initializeStores, Modal } from '@skeletonlabs/skeleton';
	initializeStores();

	import CreateDocument from '$lib/components/CreateDocument.svelte';
	import RejectionModal from '$lib/components/RejectionModal.svelte';

	const modalRegistry: Record<string, ModalComponent> = {
		createDocument: { ref: CreateDocument },
		rejectionModal: { ref: RejectionModal }
	};

	// Highlight JS
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

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	onMount(() => {
		isAuthenticated.check();
	});

	async function logout() {
		await authRef.logout();
		isAuthenticated.logout();
		goto('/');
	}

	// Mobile menu state
	let isMobileMenuOpen = false;

	// Toggle mobile menu
	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}

	// Function to check if user has specific roles
	function hasRole(userStore: User | null, roles: string[]): boolean {
		return !!userStore && Array.isArray(userStore.roles) && roles.some(role => userStore?.roles?.includes(role));
	}

	// Function to check if user has access to documents
	function canAccessDocuments(userStore: User | null): boolean {
		return hasRole(userStore, ['doc-viewer', 'doc-approver', 'doc-admin', 'doc-submitter']);
	}

	// Function to check if user has access to approvals
	function canAccessApprovals(userStore: User | null): boolean {
		return hasRole(userStore, ['doc-approver', 'doc-admin']);
	}

	// Redirect unauthorized access
	$: {
		if ($isAuthenticated && $userStore) {
			if ($page.url.pathname === '/documents' && !canAccessDocuments($userStore)) {
				goto('/dashboard');
			} else if ($page.url.pathname === '/approvals' && !canAccessApprovals($userStore)) {
				goto('/dashboard');
			}
		}
	}
</script>

<Modal components={modalRegistry} />

<Drawer position="right" width="w-64" bind:open={isMobileMenuOpen}>
	<nav class="space-y-4 p-4">
		{#if $isAuthenticated}
			<a
				class="variant-ghost-surface btn btn-sm w-full"
				href="/dashboard"
				on:click={() => (isMobileMenuOpen = false)}>Dashboard</a
			>
			{#if canAccessDocuments($userStore)}
				<a
					class="variant-ghost-surface btn btn-sm w-full"
					href="/documents"
					on:click={() => (isMobileMenuOpen = false)}>Documents</a
				>
			{/if}
			{#if canAccessApprovals($userStore)}
				<a
					class="variant-ghost-surface btn btn-sm w-full"
					href="/approvals"
					on:click={() => (isMobileMenuOpen = false)}>Approvals</a
				>
			{/if}
			<button
				on:click={() => {
					logout();
					isMobileMenuOpen = false;
				}}
				class="variant-ghost-surface btn btn-sm w-full">Logout</button
			>
		{:else if $page.url.pathname != '/login'}
			<a
				href="/login"
				class="variant-ghost-surface btn btn-sm w-full"
				on:click={() => (isMobileMenuOpen = false)}>Login / Signup</a
			>
		{/if}
	</nav>
</Drawer>

<AppShell>
	<svelte:fragment slot="header">
		<AppBar background="bg-surface-100-800-token">
			<svelte:fragment slot="lead">
				<a href="/" class="group block">
					<blockquote
						class="blockquote cursor-pointer p-4 transition duration-300 group-hover:bg-gray-200 group-hover:text-blue-600"
					>
						{APP_NAME}
					</blockquote>
				</a>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<!-- Desktop view -->
				<div class="hidden items-center space-x-2 md:flex">
					{#if $isAuthenticated}
						<a class="variant-ghost-surface btn btn-sm" href="/dashboard">Dashboard</a>
						{#if canAccessDocuments($userStore)}
							<a class="variant-ghost-surface btn btn-sm" href="/documents">Documents</a>
						{/if}
						{#if canAccessApprovals($userStore)}
							<a class="variant-ghost-surface btn btn-sm" href="/approvals">Approvals</a>
						{/if}
						<div class="variant-ghost-surface btn btn-sm">
							<NotificationBell />
						</div>
						<button on:click={logout} class="variant-ghost-surface btn btn-sm">Logout</button>
					{:else if $page.url.pathname != '/login'}
						<a href="/login" class="variant-ghost-surface btn btn-sm">Login / Signup</a>
					{/if}
				</div>
				<!-- Mobile view -->
				<div class="flex items-center space-x-2 md:hidden">
					{#if $isAuthenticated}
						<div class="variant-ghost-surface btn btn-sm">
							<NotificationBell />
						</div>
					{/if}
					<button
						on:click={toggleMobileMenu}
						class="variant-ghost-surface btn btn-sm"
						aria-label="Toggle mobile menu"
					>
						<span class="material-icons">menu</span>
					</button>
				</div>
				<LightSwitch />
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>

	<div class="container mx-auto space-y-8 p-4">
		<slot />
	</div>

	<svelte:fragment slot="footer">
		<div class="container mx-auto flex flex-col items-center justify-between p-4 md:flex-row">
			<p class="mb-4 md:mb-0">© 2024 {APP_NAME}. All rights reserved.</p>
			<nav class="space-y-2 text-center md:space-x-4 md:space-y-0 md:text-left">
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

	@media (max-width: 768px) {
		:global(.app-bar) {
			@apply px-2;
		}
	}
</style>
