<!-- src/lib/components/CreateDocumentModal.svelte -->
<script lang="ts">
  import { getModalStore } from '@skeletonlabs/skeleton';

  const modalStore = getModalStore();

  let title = '';
  let content = '';

  function closeModal() {
    modalStore.close();
  }

  function handleSubmit() {
    // Here you would typically send this data to your backend
    if ($modalStore[0].response) $modalStore[0].response({ title, content });
    closeModal();
  }
</script>

<div class="modal-backdrop">
  <div class="modal-container">
    <div class="card p-4 w-modal shadow-xl space-y-4">
      <header class="text-2xl font-bold">Create New Document</header>
      <form on:submit|preventDefault={handleSubmit} class="space-y-4">
        <label class="label">
          <span>Title</span>
          <input
            class="input"
            type="text"
            bind:value={title}
            placeholder="Enter document title"
            required
          />
        </label>
        <label class="label">
          <span>Content</span>
          <textarea
            class="textarea"
            bind:value={content}
            placeholder="Enter document content"
            rows="5"
            required
          ></textarea>
        </label>
        <div class="flex justify-end space-x-2">
          <button type="button" class="btn variant-ghost-surface" on:click={closeModal}>Cancel</button>
          <button type="submit" class="btn variant-filled-primary">Create Document</button>
        </div>
      </form>
    </div>
  </div>
</div>

<style lang="postcss">
  .modal-backdrop {
    @apply fixed inset-0 z-50 flex items-center justify-center bg-surface-backdrop-token;
  }

  .modal-container {
    @apply w-full max-w-lg max-h-[90vh] overflow-auto p-4;
  }
</style>