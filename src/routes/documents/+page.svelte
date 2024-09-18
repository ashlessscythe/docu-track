<script lang="ts">
	import { onMount } from 'svelte';
	import { isAuthenticated } from '$lib/stores/auth';
	import { type ModalSettings, getModalStore } from '@skeletonlabs/skeleton';
	import { goto } from '$app/navigation';
	import { type Document } from '$lib/types';

	let documents: Document[] = [];

	onMount(async () => {
		if (!$isAuthenticated) {
			goto('/login');
		} else {
			await fetchDocuments();
		}
	});

	async function fetchDocuments() {
		try {
			const response = await fetch('/api/documents');
			if (!response.ok) throw new Error('Failed to fetch documents');
			documents = await response.json();
		} catch (error) {
			console.error('Error fetching documents:', error);
			// You might want to show an error message to the user here
		}
	}

	const modalStore = getModalStore();
	const modal: ModalSettings = {
		type: 'component',
		component: 'createDocument',
		// You can pass a callback function to handle the new document creation
		meta: {
			onDocumentCreated: handleDocumentCreated
		}
	};

	function openModal() {
		modalStore.trigger(modal);
	}

	async function handleDocumentCreated(newDocument: {
		title: string;
		content: string;
		file_url: string;
	}) {
		try {
			const response = await fetch('/api/documents', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					...newDocument,
					created_by: 'user_id_here' // Replace with actual user ID from your auth system
				})
			});
			if (!response.ok) throw new Error('Failed to create document');
			const createdDocument = await response.json();
			documents = [...documents, createdDocument];
		} catch (error) {
			console.error('Error creating document:', error);
			// You might want to show an error message to the user here
		}
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
						<td>{new Date(doc.created_at).toLocaleDateString()}</td>
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
