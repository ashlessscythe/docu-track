<script lang="ts">
	import '../app.postcss';
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';
	import NotificationBell from '$lib/components/NotificationBell.svelte';
	import { LightSwitch } from '@skeletonlabs/skeleton';
	
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
	
	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
</script>

<AppShell>
	<svelte:fragment slot="header">
		<AppBar background="bg-surface-100-800-token">
			<svelte:fragment slot="lead">
				<strong class="text-xl">DocuTracker</strong>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<a class="btn btn-sm variant-ghost-surface" href="/dashboard">Dashboard</a>
				<a class="btn btn-sm variant-ghost-surface" href="/documents">Documents</a>
				<a class="btn btn-sm variant-ghost-surface" href="/approvals">Approvals</a>
				<NotificationBell />
				<LightSwitch />
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	
	<div class="container mx-auto p-4 space-y-8">
		<slot />
	</div>
	
	<svelte:fragment slot="footer">
		<div class="container mx-auto p-4 flex justify-between">
			<p>© 2024 DocuTracker. All rights reserved.</p>
			<nav class="space-x-4">
				<a href="/privacy">Privacy Policy</a>
				<a href="/terms">Terms of Service</a>
				<a href="/contact">Contact Us</a>
			</nav>
		</div>
	</svelte:fragment>
</AppShell>

<style lang='postcss'>
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