import type { RequestHandler } from '@sveltejs/kit';
import { createErrorResponse, createJsonResponse, apiFetch } from '$lib/utils/server/api';

export const PUT: RequestHandler = async ({ params, request }) => {
	const { id } = params;

	if (!id) {
		return createErrorResponse('Missing workflow ID parameter', 400);
	}

	const body = await request.json();
	const result = await apiFetch(`/workflows/${id}`, {
		method: 'PUT',
		body: JSON.stringify(body)
	});

	if (result.error) {
		return createErrorResponse(result.error, result.status);
	}

	return createJsonResponse(result.data || { success: true });
};
