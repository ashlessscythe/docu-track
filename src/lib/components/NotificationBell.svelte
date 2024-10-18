<script lang="ts">
	import { Bell } from 'lucide-svelte';
	import { fly } from 'svelte/transition';
	import { notificationStore, type Notification } from '$lib/stores/notifications';
	import { onMount } from 'svelte';

	let showNotifications = false;
	let notifications: Notification[] = [];

	onMount(() => {
		const unsubscribe = notificationStore.subscribe(value => {
			notifications = value;
		});

		return unsubscribe;
	});

	function toggleNotifications() {
		showNotifications = !showNotifications;
	}

	function getNotificationColor(status: Notification['status']) {
		switch (status) {
			case 'pending':
				return 'bg-yellow-500';
			case 'approved':
				return 'bg-green-500';
			case 'rejected':
				return 'bg-red-500';
			default:
				return 'bg-gray-500';
		}
	}
</script>

<div class="relative">
	<button class="variant-ghost" on:click={toggleNotifications}>
		<Bell />
		{#if notifications.length > 0}
			<span
				class="absolute top-0 right-0 rounded-full w-5 h-5 flex items-center justify-center text-xs bg-red-500 text-white"
			>
				{notifications.length}
			</span>
		{/if}
	</button>

	{#if showNotifications}
		<div
			transition:fly={{ y: -10, duration: 300 }}
			class="absolute right-0 mt-2 w-64 shadow-lg rounded-lg overflow-hidden z-50 bg-white dark:bg-gray-800"
		>
			{#each notifications as notification}
				<div class="p-4 border-b border-gray-200 dark:border-gray-700">
					<div class="flex items-center justify-between">
						<span class="text-sm font-semibold capitalize">{notification.type}</span>
						<span class={`text-xs px-2 py-1 rounded-full ${getNotificationColor(notification.status)}`}>
							{notification.status}
						</span>
					</div>
					<p class="text-sm mt-2">{notification.message}</p>
					<p class="text-xs text-gray-500 mt-1">
						{new Date(notification.createdAt).toLocaleString()}
					</p>
				</div>
			{:else}
				<div class="p-4">
					<p class="text-sm text-gray-500">No new notifications</p>
				</div>
			{/each}
		</div>
	{/if}
</div>
