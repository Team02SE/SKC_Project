<script lang="ts">
	import { goto } from '$app/navigation';
	
	function testError(status: number) {
		goto(`/test-errors/trigger/${status}`);
	}
</script>

<div class="min-h-screen bg-gray-50 p-8">
	<div class="max-w-4xl mx-auto">
		<h1 class="text-3xl font-bold mb-8" style="color: var(--color-light-text-primary);">Error Page Testing</h1>
		
		<div class="bg-white rounded-lg shadow p-6 mb-6">
			<div class="grid grid-cols-2 md:grid-cols-3 gap-4">
				<button
					onclick={() => testError(404)}
					class="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
				>
					404 - Not Found
				</button>
				
				<button
					onclick={() => testError(401)}
					class="px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
				>
					401 - Unauthorized
				</button>
				
				<button
					onclick={() => testError(403)}
					class="px-4 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
				>
					403 - Forbidden
				</button>
				
				<button
					onclick={() => testError(500)}
					class="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
				>
					500 - Server Error
				</button>
				
				<button
					onclick={() => testError(503)}
					class="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
				>
					503 - Service Unavailable
				</button>
				
				<button
					onclick={() => goto('/nonexistent-page-12345')}
					class="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
				>
					Real 404 (Bad URL)
				</button>
			</div>
		</div>
		<div class="mt-6 text-center">
			<button
				onclick={() => goto('/')}
				class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
			>
				← Back to Home
			</button>
		</div>
	</div>
</div>
