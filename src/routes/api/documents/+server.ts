import type { RequestHandler } from '@sveltejs/kit';
import { getApiBaseUrl, createApiHeaders, createErrorResponse } from '$lib/utils/server/api';

export const POST: RequestHandler = async ({ request }) => {
	const apiBase = getApiBaseUrl();
	if (!apiBase) {
		return createErrorResponse('API configuration missing', 500);
	}

	const formData = await request.formData();

	try {
		const response = await fetch(`${apiBase}/workflows`, {
			method: 'POST',
			headers: createApiHeaders(false),
			body: formData
		});

		if (!response.ok) {
			const errorBody = await response.text();
			return createErrorResponse(errorBody || response.statusText, response.status);
		}

		const body = await response.arrayBuffer();
		const headers = new Headers(response.headers);
		headers.set('Content-Type', headers.get('Content-Type') || 'application/json');

		return new Response(body, {
			status: response.status,
			headers
		});
	} catch (error) {
		console.error('Error forwarding document upload:', error);
		return createErrorResponse('Failed to upload document', 502);
	}
};
