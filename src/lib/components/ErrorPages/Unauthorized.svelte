<script lang="ts">
	import { goto } from '$app/navigation';
	
	function goToLogin() {
		goto('/login');
	}
	
	function goHome() {
		goto('/');
	}
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
	<div class="max-w-md w-full text-center">
		<div class="mb-8">
			<div class="mx-auto w-32 h-32 rounded-full flex items-center justify-center" style="background-color: #7c3aed;">
				<svg class="w-16 h-16" style="color: white;" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
				</svg>
			</div>
		</div>
		
		<div class="mb-8">
			<h1 class="text-3xl font-bold mb-4" style="color: var(--color-light-text-primary);">Unauthorized Access</h1>
			<p class="text-lg mb-2" style="color: var(--color-light-text-primary);">You need to be logged in to access this page.</p>
			<p class="text-sm" style="color: var(--color-light-text-primary); opacity: 0.7;">Please sign in to continue.</p>
		</div>
		
		<div class="flex flex-col sm:flex-row gap-4 justify-center">
			<button
				onclick={goToLogin}
				class="px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 focus:outline-none cursor-pointer"
				style="background-color: var(--color-light-active-primary); color: var(--color-light-button-content-primary);"
			>
				Sign In
			</button>
			<button
				onclick={goHome}
				class="px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 focus:outline-none cursor-pointer"
				style="background-color: var(--color-light-secondary); color: var(--color-light-button-content-primary);"
			>
				Homepage
			</button>
		</div>
		
	<div class="mt-8 text-sm" style="color: var(--color-light-text-primary); opacity: 0.6;">
		<p>Don't have an account? <button type="button" class="underline" style="color: var(--color-light-active-primary); background: none; border: none; padding: 0; cursor: pointer;">Sign up here</button></p>
	</div>
	</div>
</div>
