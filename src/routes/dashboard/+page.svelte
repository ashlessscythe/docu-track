<!-- src/routes/dashboard/+page.svelte -->
<script lang="ts">
import { onMount } from 'svelte';
import { type ModalSettings, getModalStore } from '@skeletonlabs/skeleton';
import { isAuthenticated, userStore } from '$lib/stores/auth';
import { goto } from '$app/navigation';
import { FileDropzone } from '@skeletonlabs/skeleton';

const modalStore = getModalStore()

const modal: ModalSettings = {
    type: 'component',
    component: 'createDocument',
};
function openModal() {
    console.log('hi from dashboard openmodal')
    modalStore.trigger(modal);
}

let isPending = false;

onMount(async () => {
    if (!$isAuthenticated) {
        goto('/login');
    } else {
        isPending = $userStore?.roles?.includes('pending') || $userStore?.roles?.length === 0;
    }
});

// You can add more dashboard-specific logic here
</script>

{#if isPending}
<div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">Account Pending</h1>
    <p class="text-lg">Your account is currently pending approval. An administrator needs to grant you access before you can use the dashboard. Please check back later or contact the admin for more information.</p>
</div>
{:else}
<div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">Dashboard</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="card p-6">
            <h2 class="text-xl font-semibold mb-4">Recent Documents</h2>
            <p class="text-sm">List of recent documents will appear here.</p>
        </div>
        
        <div class="card p-6">
            <h2 class="text-xl font-semibold mb-4">Pending Approvals</h2>
            <p class="text-sm">List of pending approvals will appear here.</p>
        </div>
        
        <div class="card p-6">
            <h2 class="text-xl font-semibold mb-4">Quick Actions</h2>
            <button class="btn btn-lg hover:variant-filled variant-ghost-primary w-full sm:w-auto" on:click={openModal}>
                New Document
            </button>
        </div>
    </div>
</div>
{/if}
