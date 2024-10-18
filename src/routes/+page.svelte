<script lang="ts">
	import { Avatar, Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import { fade, fly } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { APP_NAME } from '$lib/config';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { isAuthenticated, userStore } from '$lib/stores/auth';

	function navigateToLogin() {
		if ($isAuthenticated) {
			goto('/')
		} else {
			goto('/login');
		}
	}

	const currentDate = writable('');

	function updateDateTime() {
		const now = new Date().toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
		});
		currentDate.set(now);
	}

	let isLoading = true;

	onMount(() => {
		updateDateTime();
		const interval = setInterval(updateDateTime, 1000);

		// Use an IIFE to handle the async operation
		(async () => {
			isAuthenticated.check()
			isLoading = false;
		})();
		// Return the cleanup function
		return () => {
			clearInterval(interval);
		};
	});
</script>

<div class="container mx-auto p-4 space-y-8">
	<section class="card p-6 md:p-8 lg:p-10 space-y-4 md:space-y-6 lg:space-y-8" in:fade="{{ duration: 300, delay: 300 }}">
  	<div class="flex flex-col md:flex-row items-center justify-between">
    	<h1 class="h1 text-2xl md:text-3xl lg:text-4xl font-bold text-primary-500">Welcome to {APP_NAME}</h1>
    	<p class="text-surface-600-300-token text-sm md:text-base lg:text-lg mt-2 md:mt-0">
      	{$currentDate}
    	</p>
  	</div>
  
  	<p class="text-lg md:text-xl lg:text-2xl font-light text-center md:text-left">
    	Streamline your document management process
  	</p>
  
	{#if !$isAuthenticated}
  	<div class="flex flex-wrap justify-center md:justify-start gap-4">
    	<button class="btn variant-filled-primary">Get Started</button>
    	<button class="btn variant-soft-secondary">Learn More</button>
  	</div>
	{/if}
	</section>
	
	{#if isLoading}
		<section class="card p-4 text-center" in:fade={{ duration: 300, delay: 600 }}>
			<p>Loading...</p>
		</section>
	{:else if !$isAuthenticated}
		<section class="card p-4 text-center" in:fade={{ duration: 300, delay: 1200 }}>
			<h2 class="h2 mb-4">Access Your Account</h2>
			<p class="mb-4">Login to manage your documents and approvals.</p>
			<button class="btn variant-filled-primary" on:click={navigateToLogin}>Login / Signup</button>
		</section>
	{:else}
		<section class="card p-4 text-center" in:fade={{ duration: 300, delay: 1200 }}>
			<h2 class="h2 mb-4">Welcome, {$userStore?.given_name || 'User'}!</h2>
			<p class="mb-4">You are now logged in as {$userStore?.email}. Manage your documents and approvals with ease.</p>
			{#if $userStore?.picture}
				<img src={$userStore.picture} alt="User avatar" class="w-16 h-16 rounded-full mx-auto mb-4">
			{/if}
		</section>
	{/if}
</div>

<style lang="postcss">
	.card {
		@apply shadow-xl;
	}
</style>
