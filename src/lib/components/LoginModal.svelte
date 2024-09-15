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

  // Handle form submission
  async function handleSubmit() {
    error = null;
    loading.set(true);
    try {
      if (activeTab === 'login') {
        const response = await authRef.login({
          email,
          password,
        });
        if (response?.data?.access_token) {
          // Login successful
          closeModal();
          resetForm();
          // Update user state or redirect as needed
        } else {
          error = response?.data?.message || 'An error occurred during login';
        }
      } else if (activeTab === 'signup') {
        if (password !== confirmPassword) {
          error = 'Passwords do not match';
          return;
        }
        const response = await authRef.signup({
          email,
          password,
          confirm_password: '',
        });
        if (response?.data?.access_token) {
          // Signup successful
          closeModal();
          resetForm();
          // Update user state or redirect as needed
        } else {
          error = response?.data?.message || 'An error occurred during signup';
        }
      }
    } catch (err) {
      console.error('Authentication error:', err);
      error = 'An unexpected error occurred';
    } finally {
      loading.set(false);
    }
  }

  function resetForm() {
    email = '';
    password = '';
    confirmPassword = '';
    error = null;
  }

  function closeModal(){
    onClose();
    resetForm();
  }
</script>

<!-- Modal Component -->
<Modal bind:open={open} on:close={closeModal}>
  <div class="p-6 space-y-4">
    <h2 class="text-2xl font-bold">Account Access</h2>
    <TabGroup name={'grp1'}>
      <Tab
       group='grp1' value='login' name='login' on:click={() => (activeTab = 'login')}
      >
        Login
      </Tab>
      <Tab
        group='grp1' value='signup' name='signup'
        on:click={() => (activeTab = 'signup')}
      >
        Signup
    </Tab>
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
      {#if activeTab === 'signup'}
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
          {activeTab === 'login' ? 'Logging in...' : 'Signing up...'}
        {:else}
          {activeTab === 'login' ? 'Log In' : 'Sign Up'}
        {/if}
      </button>
    </form>
  </div>
</Modal>
