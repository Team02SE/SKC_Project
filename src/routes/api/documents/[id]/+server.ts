import type { RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { apiFetch, createErrorResponse, createJsonResponse } from '$lib/utils/server/api';

export const DELETE: RequestHandler = async ({ params }) => {
	const { id } = params;

	if (!id) {
		return new Response('Missing document ID', { status: 400 });
	}

	const apiBase = env.API_URL;
	const apiKey = env.API_KEY;

	try {
		const response = await fetch(`${apiBase}/documents/${id}`, {
			method: 'DELETE',
			headers: {
				Authorization: apiKey,
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			return new Response(`Failed to delete document: ${response.statusText}`, {
				status: response.status
			});
		}

		return new Response(null, { status: 204 });
	} catch (error) {
		console.error('Error deleting document:', error);
		return new Response('Internal server error', { status: 500 });
	}
};

export const PUT: RequestHandler = async ({ request, params }) => {
	const { id } = params;
	if (!id) {
		return createErrorResponse('Missing coding ID parameter', 400);
	}

	const data = await request.json();

	console.log(data);

	const result = await apiFetch(`/documents/${id}`, {
		method: 'PUT',
		body: JSON.stringify(data)
	});

	if (result.error) {
		return createErrorResponse(result.error, result.status);
	}

	return createJsonResponse(result.data || { success: true });
};
