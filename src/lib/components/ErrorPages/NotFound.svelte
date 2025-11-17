<script lang="ts">
	import { goto } from '$app/navigation';
	
	function goHome() {
		goto('/');
	}
	
	function goBack() {
		window.history.back();
	}
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
	<div class="max-w-md w-full text-center">
		<div class="mb-8">
			<div class="mx-auto w-32 h-32 rounded-full flex items-center justify-center" style="background-color: var(--color-light-active-primary);">
				<span class="text-6xl font-bold" style="color: var(--color-light-button-content-primary);">404</span>
			</div>
		</div>
		
		<div class="mb-8">
			<h1 class="text-3xl font-bold mb-4" style="color: var(--color-light-text-primary);">Page Not Found</h1>
			<p class="text-lg mb-2" style="color: var(--color-light-text-primary);">Sorry, we couldn't find the page you're looking for.</p>
			<p class="text-sm" style="color: var(--color-light-text-primary); opacity: 0.7;">The page might have been moved, deleted, or you entered the wrong URL.</p>
		</div>
		
		<div class="flex flex-col sm:flex-row gap-4 justify-center">
			<button
				onclick={goBack}
				class="px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 focus:outline-none cursor-pointer"
				style="background-color: var(--color-light-secondary); color: var(--color-light-button-content-primary);"
			>
				←
			</button>
			<button
				onclick={goHome}
				class="px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 focus:outline-none cursor-pointer"
				style="background-color: var(--color-light-active-primary); color: var(--color-light-button-content-primary);"
			>
				Homepage
			</button>
		</div>
		
		<div class="mt-8 text-sm" style="color: var(--color-light-text-primary); opacity: 0.6;">
			<p>If you believe this is an error, please contact support.</p>
		</div>
	</div>
</div>
