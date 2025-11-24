<script lang="ts">
	import { page } from '$app/state';

	let { targetUrl, displayName } = $props();
</script>

<li class="{page.url.pathname === targetUrl ? 'border-b-3 border-orange-500' : ''} duration-200">
	<a
		href={targetUrl}
		class=" text-2xl font-semibold text-gray-700 duration-500 {page.url.pathname === targetUrl
			? 'text-orange-500'
			: ''}"
	>
		{displayName}
	</a>
</li>
