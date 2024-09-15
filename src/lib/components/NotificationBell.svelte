<script lang="ts">
	import { Bell } from 'lucide-svelte';
	import { fly } from 'svelte/transition';
	import { notifications } from '$lib/stores/notifications';

	let showNotifications = false;

	function toggleNotifications() {
		showNotifications = !showNotifications;
	}
</script>

<div class="relative">
	<button class="variant-ghost" on:click={toggleNotifications}>
		<Bell />
		{#if notifications.length > 0}
			<span
				class="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
			>
				{notifications.length}
			</span>
		{/if}
	</button>

	{#if showNotifications}
		<div
			transition:fly={{ y: -10, duration: 300 }}
			class="absolute right-0 mt-2 w-64 shadow-lg rounded-lg overflow-hidden z-50"
		>
			{#each notifications as notification}
				<div class="p-4 border-b">
					<p class="text-sm">{notification.message}</p>
				</div>
			{:else}
				<div class="p-4">
					<p class="text-sm text-gray-500">No new notifications</p>
				</div>
			{/each}
		</div>
	{/if}
</div>
