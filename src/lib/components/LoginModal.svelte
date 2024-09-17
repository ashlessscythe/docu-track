<!-- LoginModal.svelte -->
<script lang="ts">
  import { Modal, Tab, TabGroup } from '@skeletonlabs/skeleton';
  import { writable } from 'svelte/store';
  import authRef from '$lib/authorizerConfig';

  // Props to control the modal visibility
  export let open: boolean = false;
  export let onClose: () => void;

  // State variables
  let activeTab: 'login' | 'signup' = 'login';
  let email = '';
  let password = '';
  let confirmPassword = '';
  let error: string | null = null;
  const loading = writable(false);

  $: isSignup = activeTab === 'signup';
  $: isFormValid = email && password && (!isSignup || password === confirmPassword);

  // Handle form submission
  async function handleSubmit() {
    if (!isFormValid) {
      console.log('form is not valid')
      return;
    }
    error = null;
    loading.set(true);
   try {
      const response = isSignup
        ? await authRef.signup({ email, password, confirm_password: confirmPassword })
        : await authRef.login({ email, password });

      if (response?.data?.access_token) {
        closeModal();
        // Update user state or redirect as needed
      } else {
        error = response?.data?.message || `An error occurred during ${isSignup ? 'signup' : 'login'}`;
      }
    } catch (err) {
      console.error('Authentication error:', err);
      error = 'An unexpected error occurred. Please try again.';
    } finally {
      loading.set(false);
    }
  } 

  function resetForm() {
    email = password = confirmPassword = '';
    error = null;
  }

  function closeModal(){
    onClose();
    resetForm();
  }
</script>

<!-- Modal Component -->
<Modal bind:open on:close={closeModal}>
  <div class="p-6 space-y-4">
    <h2 class="text-2xl font-bold">Account Access</h2>
    <TabGroup>
      <Tab bind:group={activeTab} name="login" value="login">Login</Tab>
      <Tab bind:group={activeTab} name="signup" value="signup">Signup</Tab>
    </TabGroup>
    <form on:submit|preventDefault={handleSubmit} class="space-y-4">
      <input
        type="email"
        bind:value={email}
        placeholder="Enter your email"
        required
        aria-label="Email"
      />
      <input
        type="password"
        bind:value={password}
        placeholder="Enter your password"
        required
        aria-label="Password"
      />
      {#if isSignup}
        <input
          type="password"
          bind:value={confirmPassword}
          placeholder="Confirm your password"
          required
          aria-label="Confirm Password"
        />
      {/if}
      {#if error}
        <p class="text-red-500 text-sm">{error}</p>
      {/if}
      <button type="submit" class="w-full" disabled={$loading}>
        {#if $loading}
          {isSignup ? 'Signing up...' : 'Logging in...'}
        {:else}
          {isSignup ? 'Sign Up' : 'Log In'}
        {/if}
      </button>
    </form>
  </div>
</Modal>
