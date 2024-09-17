<!-- src/routes/documents/+page.svelte -->
<script lang="ts">
import { onMount } from 'svelte';
import { isAuthenticated } from '$lib/stores/auth';
import { type ModalSettings, getModalStore } from '@skeletonlabs/skeleton';
import { goto } from '$app/navigation';
import { FileDropzone } from '@skeletonlabs/skeleton';

onMount(async () => {
    if (!$isAuthenticated) {
        goto('/login');
    }
});

const modalStore = getModalStore();

const modal: ModalSettings = {
    type: 'component',
    component: 'createDocument',
}

function openModal() {
    modalStore.trigger(modal)
}

let documents = [
    { id: 1, title: 'Document 1', date: '2024-09-17' },
    { id: 2, title: 'Document 2', date: '2024-09-16' },
    { id: 3, title: 'Document 3', date: '2024-09-15' },
];

function handleDocumentCreated(event: any) {
    console.log('New document created:', event.detail);
    // Update the documents list
    documents = [...documents, { id: documents.length + 1, title: event.detail.title, date: new Date().toISOString().split('T')[0] }];
}

</script>

<div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Documents</h1>
    
    <button class="btn variant-filled-primary mb-4" on:click={openModal}>Create New Document</button>

    <div class="card p-4">
        <table class="table table-compact w-full">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {#each documents as doc}
                    <tr>
                        <td>{doc.title}</td>
                        <td>{doc.date}</td>
                        <td>
                            <button class="btn btn-sm variant-ghost-primary">View</button>
                            <button class="btn btn-sm variant-ghost-warning">Edit</button>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>