<script lang="ts">
	import { goto } from '$app/navigation';
	
	let { 
		title = "Something went wrong",
		message = "An unexpected error occurred. Please try again.",
		showRetry = true,
		showHome = true
	} = $props();
	
	function goHome() {
		goto('/');
	}
	
	function refresh() {
		window.location.reload();
	}
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
	<div class="max-w-md w-full text-center">
		<div class="mb-8">
			<div class="mx-auto w-32 h-32 rounded-full flex items-center justify-center" style="background-color: #6b7280;">
				<svg class="w-16 h-16" style="color: white;" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
				</svg>
			</div>
		</div>
		
		<div class="mb-8">
			<h1 class="text-3xl font-bold mb-4" style="color: var(--color-light-text-primary);">{title}</h1>
			<p class="text-lg mb-2" style="color: var(--color-light-text-primary);">{message}</p>
		</div>
		
		<div class="flex flex-col sm:flex-row gap-4 justify-center">
			{#if showRetry}
				<button
					onclick={refresh}
					class="px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 focus:outline-none cursor-pointer"
					style="background-color: var(--color-light-secondary); color: var(--color-light-button-content-primary);"
				>
					Try Again
				</button>
			{/if}
			{#if showHome}
				<button
					onclick={goHome}
					class="px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 focus:outline-none cursor-pointer"
					style="background-color: var(--color-light-active-primary); color: var(--color-light-button-content-primary);"
				>
					Homepage
				</button>
			{/if}
		</div>
		
		<div class="mt-8 text-sm" style="color: var(--color-light-text-primary); opacity: 0.6;">
			<p>If the problem persists, please contact support.</p>
		</div>
	</div>
</div>
