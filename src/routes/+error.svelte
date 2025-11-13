<script lang="ts">
	import { Forbidden, GenericError, NetworkError, NotFound, ServerError, Unauthorized } from '$lib/components/ErrorPages';

	type ErrorProps = {
		error: App.Error & { status?: number; cause?: unknown };
		status?: number;
	};

	let { error, status }: ErrorProps = $props();

	const normalizedStatus =
		status ?? (typeof error?.status === 'number' ? error.status : undefined) ?? 500;

	const message =
		typeof error?.message === 'string' && error.message.trim().length > 0
			? error.message.trim()
			: undefined;

	const cause = error?.cause as { code?: unknown } | undefined;
	const causeCode = typeof cause?.code === 'string' ? cause.code : undefined;
	const lowerMessage = message?.toLowerCase();

	const isNetworkError =
		normalizedStatus === 0 ||
		(error?.name === 'TypeError' && lowerMessage?.includes('fetch')) ||
		!!causeCode?.startsWith('ECONN');

	const component =
		isNetworkError
			? NetworkError
			: normalizedStatus === 401
				? Unauthorized
				: normalizedStatus === 403
					? Forbidden
					: normalizedStatus === 404
						? NotFound
						: normalizedStatus >= 500
							? ServerError
							: GenericError;

	const componentProps =
		component === GenericError
			? {
				title:
					normalizedStatus >= 500
						? 'Unexpected server error'
						: normalizedStatus >= 400
							? 'Something went wrong'
							: 'Unexpected error',
				message: message ?? 'An unexpected error occurred. Please try again.'
			}
			: {};

	if (import.meta.env.DEV) {
		console.error('Route error handled by +error.svelte', {
			status: normalizedStatus,
			error
		});
	}
</script>

<svelte:component this={component} {...componentProps} />
