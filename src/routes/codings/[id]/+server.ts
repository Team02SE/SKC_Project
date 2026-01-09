import type { RequestHandler } from '@sveltejs/kit';
import { createErrorResponse, createJsonResponse, apiFetch } from '$lib/utils/server/api';

export const PUT: RequestHandler = async ({ request, params }) => {
	const { id } = params;
	if (!id) {
		return createErrorResponse('Missing coding ID parameter', 400);
	}

	const data = await request.json();
	const type = data.type.replace(/[\s_]+/g, '-').toLowerCase();

	const result = await apiFetch(`/${type}/${id}`, {
		method: 'PUT',
		body: JSON.stringify(data)
	});

	if (result.error) {
		return createErrorResponse(result.error, result.status);
	}

	return createJsonResponse(result.data || { success: true });
};

export const DELETE: RequestHandler = async ({ request, params }) => {
	const { id } = params;
	if (!id) {
		return createErrorResponse('Missing coding ID parameter', 400);
	}

	const data = await request.json();
	const type = data.type.replace(/[\s_]+/g, '-').toLowerCase();

	const result = await apiFetch(`/${type}/${id}`, {
		method: 'DELETE',
		body: JSON.stringify(data)
	});

	if (result.error) {
		if (result.status == 455) {
			return createErrorResponse('Coding in use by the workflow ! ', result.status);
		}
		return createErrorResponse(result.error, result.status);
	}

	return createJsonResponse(result.data || { success: true });
};
