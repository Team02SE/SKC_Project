<script lang="ts">
	import { goto } from '$app/navigation';
	
	function goHome() {
		goto('/');
	}
	
	function contactSupport() {

	}
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
	<div class="max-w-md w-full text-center">
		<div class="mb-8">
			<div class="mx-auto w-32 h-32 rounded-full flex items-center justify-center" style="background-color: #f59e0b;">
				<svg class="w-16 h-16" style="color: white;" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
				</svg>
			</div>
		</div>
		
		<div class="mb-8">
			<h1 class="text-3xl font-bold mb-4" style="color: var(--color-light-text-primary);">Access Forbidden</h1>
			<p class="text-lg mb-2" style="color: var(--color-light-text-primary);">You don't have permission to access this resource.</p>
			<p class="text-sm" style="color: var(--color-light-text-primary); opacity: 0.7;">Please check your permissions or contact an administrator.</p>
		</div>
		
		<div class="flex flex-col sm:flex-row gap-4 justify-center">
			<button
				onclick={contactSupport}
				class="px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 focus:outline-none cursor-pointer"
				style="background-color: var(--color-light-secondary); color: var(--color-light-button-content-primary);"
			>
				Contact Support
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
			<p>If you believe you should have access, please contact your administrator.</p>
		</div>
	</div>
</div>
