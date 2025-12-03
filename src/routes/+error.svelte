<script lang="ts">
	import { page } from '$app/stores';
	import { Forbidden, GenericError, NetworkError, NotFound, ServerError, Unauthorized } from '$lib/components/ErrorPages';

	type EnhancedError = App.Error & { status?: number | string; cause?: unknown; name?: string };

	let error = $derived($page.error as EnhancedError | null | undefined);
	let status = $derived($page.status);

	const coerceStatus = (value: unknown) => {
		const numberValue =
			typeof value === 'number'
				? value
				: typeof value === 'string'
					? Number.parseInt(value, 10)
					: undefined;

		return Number.isFinite(numberValue) ? numberValue : undefined;
	};

	let normalizedStatus = $derived(
		coerceStatus(status) ??
		coerceStatus(error?.status) ??
		(error ? 500 : 404)
	);

	let message = $derived.by(() => {
		const rawMessage = error?.message;
		if (typeof rawMessage === 'string') {
			const trimmed = rawMessage.trim();
			return trimmed.length > 0 ? trimmed : undefined;
		}
		return undefined;
	});

	let lowerMessage = $derived(message?.toLowerCase());

	let causeCode = $derived.by(() => {
		const cause = error?.cause as { code?: unknown } | undefined;
		return typeof cause?.code === 'string' ? cause.code : undefined;
	});

	let isNetworkError = $derived(
		normalizedStatus === 0 ||
		(error?.name === 'TypeError' && !!lowerMessage?.includes('fetch')) ||
		!!causeCode?.startsWith('ECONN')
	);

	let genericProps = $derived({
		title:
			normalizedStatus >= 500
				? 'Unexpected server error'
				: normalizedStatus >= 400
					? 'Something went wrong'
					: 'Unexpected error',
		message:
			message ??
			(normalizedStatus >= 500
				? 'We are experiencing difficulties. Please try again later.'
				: 'An unexpected error occurred. Please try again.')
	});

	$effect(() => {
		if (import.meta.env.DEV) {
			console.error('Route error handled by +error.svelte', {
				status: normalizedStatus,
				receivedStatus: status,
				error
			});
		}
	});
</script>

{#if isNetworkError}
	<NetworkError />
{:else if normalizedStatus === 401}
	<Unauthorized />
{:else if normalizedStatus === 403}
	<Forbidden />
{:else if normalizedStatus === 404}
	<NotFound />
{:else if normalizedStatus >= 500}
	<ServerError />
{:else}
	<GenericError {...genericProps} />
{/if}
