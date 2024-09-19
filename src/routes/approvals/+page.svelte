<!-- src/routes/approvals/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { isAuthenticated } from '$lib/stores/auth';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { goto } from '$app/navigation';
	import type { Approval } from '$lib/types';

	const modalStore = getModalStore();

	let approvals: Approval[] = [];
	let currentApprovalId: string | null = null;

	onMount(async () => {
		if (!$isAuthenticated) {
			goto('/login');
		}
		fetchApprovals();
	});

	async function fetchApprovals() {
		const response = await fetch('/api/approvals');
		if (response.ok) {
			approvals = await response.json();
		} else {
			console.error('Failed to fetch approvals');
		}
	}

	async function updateApprovalStatus(approvalId: string, newStatus: string, comment?: string) {
		const response = await fetch(`/api/approvals/${approvalId}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ status: newStatus, comment })
		});

		if (response.ok) {
			await fetchApprovals(); // Refresh the entire list
		} else {
			console.error('Failed to update approval status');
		}
	}

	function openRejectionModal(approvalId: string) {
		modalStore.trigger({
			type: 'component',
			component: 'rejectionModal',
			meta: {
				approvalId,
				onSubmit: (comment: string) => {
					updateApprovalStatus(approvalId, 'rejected', comment);
				}
			}
		});
	}
</script>

<div class="table-container mx-auto p-4">
	<h1 class="text-2xl font-bold mb-4">Approvals</h1>
	<div class="card p-4 overflow-hidden">
		<div class="overflow-x-auto">
		<table class="table table-hover">
			<thead>
				<tr>
					<th>Document Title</th>
					<th>Approver</th>
					<th>Status</th>
					<th>Date</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each approvals as approval}
					<tr>
						<td>{approval.documents.title}</td>
						<td>{approval.users.full_name}</td>
						<td>{approval.status}</td>
						<td>{new Date(approval.created_at).toLocaleDateString()}</td>
						<td>
							{#if approval.status === 'pending'}
								<button
									class="btn btn-sm variant-filled-success"
									on:click={() => updateApprovalStatus(approval.id, 'approved')}
								>
									Approve
								</button>
								<button
									class="btn btn-sm variant-filled-error"
									on:click={() => openRejectionModal(approval.id)}
								>
									Reject
								</button>
							{:else}
								<span>{approval.status}</span>
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
		</div>
	</div>
</div>
