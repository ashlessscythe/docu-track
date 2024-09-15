<script lang="ts">

  let file: File | null = null;
  let documentType = '';

  const documentTypes = [
    { value: 'excel', name: 'Excel' },
    { value: 'pdf', name: 'PDF' },
    { value: 'docx', name: 'Word Document' }
  ];

  function handleSubmit() {
    if (file && documentType) {
      console.log('Submitting:', { file, documentType });
      // Here you would typically send this data to your backend
    }
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-4">
<button type='button' class='btn variant-ghost hover:variant-filled'>Submit</button>
    
</form>