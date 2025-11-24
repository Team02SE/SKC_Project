import type { RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { Workflow } from '$lib/types';

export const PUT: RequestHandler = async ({ params, request }) => {
	const { documentId } = params;

	if (!documentId) {
		return new Response('Missing documentId parameter', { status: 400 });
	}

	const apiBase = env.API_URL;
	const apiKey = env.API_KEY;

	try {
		const body = await request.json();

		console.log(body);

		const response = await fetch(`${apiBase}/workflows/${documentId}`, {
			method: 'PUT',
			headers: {
				Authorization: apiKey,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error(`Failed to update workflow: ${response.statusText}`, errorText);
			return new Response(`Failed to update workflow: ${response.statusText}`, {
				status: response.status
			});
		}

		// Check if response has content before parsing
		const contentType = response.headers.get('content-type');
		const contentLength = response.headers.get('content-length');
		
		if (contentLength === '0' || response.status === 204) {
			// No content to parse, return success
			console.log(`Successfully updated workflow ${documentId}`);
			return new Response(JSON.stringify({ success: true }), {
				status: 200,
				headers: {
					'Content-Type': 'application/json'
				}
			});
		}

		// Only parse JSON if content-type indicates JSON and there's content
		let result;
		if (contentType && contentType.includes('application/json')) {
			const text = await response.text();
			result = text ? JSON.parse(text) : { success: true };
		} else {
			result = { success: true };
		}
		
		console.log(`Successfully updated workflow ${documentId}`);

		return new Response(JSON.stringify(result), {
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} catch (error) {
		console.error('Error batch updating workflow:', error);
		return new Response('Internal server error', { status: 500 });
	}
};
