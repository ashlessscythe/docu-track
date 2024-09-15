<script lang="ts">
	import { Avatar, Accordion, AccordionItem, Modal } from '@skeletonlabs/skeleton';
	import { fade, fly } from 'svelte/transition';
	import DocumentSubmission from '$lib/components/DocumentSubmission.svelte';
	import LoginModal from '$lib/components/LoginModal.svelte';
	import { APP_NAME } from '$lib/config';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	let isLoginModalOpen = false;

	// Create a writable store to hold the current date and time
  	const currentDate = writable('');

  	// Function to update the current date and time
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

  	// Use onMount to set an interval that updates the time every second
  	onMount(() => {
    	updateDateTime(); // Initialize the time immediately

    	const interval = setInterval(() => {
      	updateDateTime();
    	}, 1000); // Update every second

    	return () => {
      	clearInterval(interval); // Clear interval when component is destroyed
    	};
  	});

	const features = [
		{ title: 'Easy Submission', content: 'Upload documents with just a few clicks.' },
		{ title: 'Quick Approval', content: 'Streamlined approval process for faster turnaround.' },
		{ title: 'Secure Storage', content: 'Your documents are encrypted and stored safely.' },
		{ title: 'Detailed Analytics', content: 'Get insights on document flows and approvals.' }
	];

	function openModal() {
		isLoginModalOpen = true;
		console.log("open modal clicked")
	}

	function closeModal() {
		isLoginModalOpen = false;
	}

</script>

<div class="container mx-auto p-4 space-y-8">
	<!-- Previous sections remain unchanged -->
	<section class="card p-4" in:fade="{{ duration: 300, delay: 300 }}">
    	<h1 class="h1 mb-4">Welcome to {APP_NAME}</h1>
    	<p class="text-2xl font-light">Streamline your document management process</p>
    	<p class="text-surface-600-300-token">Today is {$currentDate}</p>
  	</section>

	<section class="card p-4 text-center" in:fade={{ duration: 300, delay: 1200 }}>
		<h2 class="h2 mb-4">Access Your Account</h2>
		<p class="mb-4">Login to manage your documents and approvals.</p>
		<button class="btn variant-filled-primary" on:click={openModal}>Login / Signup</button>
	</section>

  	<section class="grid grid-cols-2 md:grid-cols-1 gap-4">
		<div class="card p-4" in:fly="{{ y: 50, duration: 300, delay: 900 }}">
		<h2 class="h2 mb-4">Key Features</h2>
		<Accordion>
			{#each features as feature}
			<AccordionItem>
				<svelte:fragment slot="lead"><Avatar initials={feature.title[0]} /></svelte:fragment>
				<svelte:fragment slot="summary">{feature.title}</svelte:fragment>
				<svelte:fragment slot="content">{feature.content}</svelte:fragment>
			</AccordionItem>
			{/each}
		</Accordion>
		</div>
  	</section>

</div>

<LoginModal onClose={closeModal} open={isLoginModalOpen} />


<style lang="postcss">
	.card {
		@apply shadow-xl;
	}
</style>




