<script lang="ts">
  import { Tab, TabGroup } from '@skeletonlabs/skeleton';
  import { writable } from 'svelte/store';
  import authRef from '$lib/authorizerConfig';
  import { goto } from '$app/navigation';
  import { isAuthenticated } from '$lib/stores/auth';
  import { type AuthToken, type ApiResponse } from '@authorizerdev/authorizer-js';

  let activeTab: 'login' | 'signup' = 'login';
  let email = '';
  let password = '';
  let confirmPassword = '';
  let error: string | null = null;
  const loading = writable(false);

  $: isSignup = activeTab === 'signup';
  $: isFormValid = email && password && (!isSignup || password === confirmPassword);


  async function handleSubmit() {
    if (!isFormValid) {
      console.log('form is not valid');
      return;
    }
    error = null;
    loading.set(true);
    try {
      const response: ApiResponse<AuthToken> = isSignup
        ? await authRef.signup({ email, password, confirm_password: confirmPassword })
        : await authRef.login({ email, password });
      
      console.log('Auth response:', response); // Add this line for debugging

      if (response.data?.access_token) {
        await isAuthenticated.login()
        // Redirect to home page or dashboard after successful login/signup
        goto('/');
      } else {
        // Handle cases where the response doesn't contain an access token
        if (response.errors && response.errors.length > 0) {
          // If there are specific errors in the response, display them
          error = response.errors.map(err => err.message).join(', ');
        } else if (response.data?.message) {
          // If there's a general error message, display it
          error = response.data.message;
        } else {
          // If no specific error information is available
          error = `An error occurred during ${isSignup ? 'signup' : 'login'}. Please try again.`;
        }
      }
    } catch (err: unknown) {
      console.error('Authentication error:', err);
      if (err instanceof Error && 'response' in err) {
        const responseData = (err.response as any)?.data;
        if (responseData?.errors && responseData.errors.length > 0) {
          error = responseData.errors.map((e: { message: string }) => e.message).join(', ');
        } else {
          error = responseData?.message || responseData?.error || 'An unexpected error occurred. Please try again.';
        }
      } else {
        error = 'An unknown error occurred. Please try again.';
      }
    } finally {
      loading.set(false);
    }
  }
</script>

<div class="container mx-auto p-4 max-w-md">
  <h1 class="text-2xl font-bold mb-4">Account Access</h1>
  <TabGroup>
    <Tab bind:group={activeTab} name="login" value="login">Login</Tab>
    <Tab bind:group={activeTab} name="signup" value="signup">Signup</Tab>
  </TabGroup>
  <form on:submit|preventDefault={handleSubmit} class="space-y-4 mt-4">
    <input
      type="email"
      bind:value={email}
      placeholder="Enter your email"
      required
      class="input"
      aria-label="Email"
    />
    <input
      type="password"
      bind:value={password}
      placeholder="Enter your password"
      required
      class="input"
      aria-label="Password"
    />
    {#if isSignup}
      <input
        type="password"
        bind:value={confirmPassword}
        placeholder="Confirm your password"
        required
        class="input"
        aria-label="Confirm Password"
      />
    {/if}
    {#if error}
      <p class="text-red-500 text-sm">{error}</p>
    {/if}
    <button type="submit" class="btn variant-filled-primary w-full" disabled={$loading}>
      {#if $loading}
        {isSignup ? 'Signing up...' : 'Logging in...'}
      {:else}
        {isSignup ? 'Sign Up' : 'Log In'}
      {/if}
    </button>
  </form>
</div>
