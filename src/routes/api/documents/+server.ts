import type { RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export const POST: RequestHandler = async ({ request }) => {
	const apiBase = env.API_URL;
	const apiKey = env.API_KEY;

	if (!apiBase || !apiKey) {
		return new Response('API configuration missing', { status: 500 });
	}

	const incomingFormData = await request.formData();

	const forwardFormData = new FormData();
	for (const [key, value] of incomingFormData.entries()) {
		forwardFormData.append(key, value);
	}

	try {
		const response = await fetch(`${apiBase}/documents`, {
			method: 'POST',
			headers: {
				Authorization: apiKey
			},
			body: forwardFormData
		});

		if (!response.ok) {
			const errorBody = await response.text();
			return new Response(errorBody || response.statusText, {
				status: response.status
			});
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
		return new Response('Failed to upload document', { status: 502 });
	}
};
