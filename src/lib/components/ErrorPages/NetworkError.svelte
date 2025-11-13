<script lang="ts">
	import { goto } from '$app/navigation';
	
	function goHome() {
		goto('/');
	}
	
	function checkConnection() {
		if (navigator.onLine) {
			alert('You are connected to the internet. The issue might be with our servers.');
		} else {
			alert('You are offline. Please check your internet connection.');
		}
	}
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
	<div class="max-w-md w-full text-center">
		<div class="mb-8">
			<div class="mx-auto w-32 h-32 rounded-full flex items-center justify-center" style="background-color: #f97316;">
				<svg class="w-16 h-16" style="color: white;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"/>
				</svg>
			</div>
		</div>
		
		<div class="mb-8">
			<h1 class="text-3xl font-bold mb-4" style="color: var(--color-light-text-primary);">Connection Error</h1>
			<p class="text-lg mb-2" style="color: var(--color-light-text-primary);">Unable to connect to the server.</p>
			<p class="text-sm" style="color: var(--color-light-text-primary); opacity: 0.7;">Please check your internet connection and try again.</p>
		</div>
		
		<div class="flex flex-col sm:flex-row gap-4 justify-center">
			<button
				onclick={checkConnection}
				class="px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 focus:outline-none cursor-pointer"
				style="background-color: var(--color-light-secondary); color: var(--color-light-button-content-primary);"
			>
				Check Connection
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
			<p>Make sure you're connected to the internet and try again.</p>
		</div>
	</div>
</div>
