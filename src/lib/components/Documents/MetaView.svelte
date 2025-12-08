<script lang="ts">
	type Metadata = {
		language: string;
		organization: string;
		summary: string;
	};

	const props = $props<{ metadata?: Partial<Metadata> }>();

	const fallbackMetadata: Metadata = {
		language: 'English',
		organization: 'SKC Research Lab',
		summary:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada ex at purus tincidunt, eu consequat augue ultricies. Interdum et malesuada fames ac ante ipsum primis in faucibus.'
	};

	const metadata = $derived({
		...fallbackMetadata,
		...props.metadata
	});
</script>

<section class="flex h-full w-full flex-col gap-6 text-light-text-primary">
	<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
		<div class="rounded-2xl border border-gray-200 bg-white/70 p-4 shadow-sm">
			<p class="text-xs uppercase tracking-wide text-gray-500">Organization</p>
			<p class="text-lg font-medium text-gray-900">{metadata.organization}</p>
		</div>
		<div class="rounded-2xl border border-gray-200 bg-white/70 p-4 shadow-sm">
			<p class="text-xs uppercase tracking-wide text-gray-500">Language</p>
			<p class="text-lg font-medium text-gray-900">{metadata.language}</p>
		</div>
	</div>

	<div class="rounded-2xl border border-gray-200 bg-white/70 p-6 shadow-inner shadow-gray-200">
		<p class="mb-2 text-base font-semibold text-gray-900">Summary</p>
		<p class="text-sm leading-relaxed text-gray-700">
			{metadata.summary}
		</p>
	</div>
</section>