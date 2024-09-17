<!-- src/routes/approvals/+page.svelte -->
<script lang="ts">
import { onMount } from 'svelte';
import { isAuthenticated } from '$lib/stores/auth';
import { goto } from '$app/navigation';

onMount(async () => {
    if (!$isAuthenticated) {
        goto('/login');
    }
});

let approvals = [
    { id: 1, title: 'Approval 1', requester: 'John Doe', date: '2024-09-17' },
    { id: 2, title: 'Approval 2', requester: 'Jane Smith', date: '2024-09-16' },
    { id: 3, title: 'Approval 3', requester: 'Bob Johnson', date: '2024-09-15' },
];

// You can add more approval-specific logic here
</script>

<div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Approvals</h1>
    
    <div class="card p-4">
        <table class="table table-compact w-full">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Requester</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {#each approvals as approval}
                    <tr>
                        <td>{approval.title}</td>
                        <td>{approval.requester}</td>
                        <td>{approval.date}</td>
                        <td>
                            <button class="btn btn-sm variant-filled-success">Approve</button>
                            <button class="btn btn-sm variant-filled-error">Reject</button>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>