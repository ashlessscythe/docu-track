<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';

	const modalStore = getModalStore();

	let comment: string = '';

	function onSubmit() {
		if (
			$modalStore[0] &&
			$modalStore[0].meta &&
			typeof $modalStore[0].meta.onSubmit === 'function'
		) {
			$modalStore[0].meta.onSubmit(comment);
			modalStore.close();
		} else {
			console.error('onSubmit function not properly passed to modal');
		}
	}

	function onClose() {
		modalStore.close();
	}
</script>

<div class="card p-4 w-modal shadow-xl space-y-4">
	<h3 class="h3">Rejection Reason</h3>
	<textarea
		class="textarea"
		bind:value={comment}
		placeholder="Enter reason for rejection..."
		rows="4"
	></textarea>
	<div class="flex justify-end space-x-2">
		<button class="btn variant-ghost-surface" on:click={onClose}>Cancel</button>
		<button class="btn variant-filled-primary" on:click={onSubmit}>Submit</button>
	</div>
</div>
