import type { RequestHandler } from '@sveltejs/kit';
import { API_URL, API_KEY } from '$env/static/private';
import { refreshAll } from '$app/navigation';

export const PUT: RequestHandler = async ({ request, params }) => {
	const { slug } = params;
	if (!slug) {
		return new Response('Missing slug parameter', { status: 400 });
	}
	const data = await request.json();
	const type = data.type.replace(/\s+/, '-').toLowerCase();
	const res = await fetch(`${API_URL}/${type}/${slug}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			Authorization: API_KEY
		},
		body: JSON.stringify(data)
	});
	return new Response(await res.text(), { status: res.status });
};

export const DELETE: RequestHandler = async ({ request, params }) => {
	const { slug } = params;
	if (!slug) {
		return new Response('Missing slug parameter', { status: 400 });
	}
	const data = await request.json();
	const type = data.type.replace(/\s+/, '-').toLowerCase();
	const res = await fetch(`${API_URL}/${type}/${slug}`, {
		method: 'DELETE',
		headers: {
			Authorization: API_KEY
		}
	});
	return new Response(await res.text(), { status: res.status });
};
