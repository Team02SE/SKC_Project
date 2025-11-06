import type { RequestHandler } from '@sveltejs/kit';
import { API_URL, API_KEY } from '$env/static/private';

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();
	console.log("Incoming GLOBAL POST /codings:", data);

	if (!data?.type) {
		return new Response("Missing type in request body", { status: 400 });
	}

	const type = data.type.replace(/\s+/, '-').toLowerCase();

	const backendRes = await fetch(`${API_URL}/${type}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: API_KEY
		},
		body: JSON.stringify({
			name: data.name,
			number: data.number,
			description: data.description,
		})
	});

	const json = await backendRes.json();
	return new Response(JSON.stringify(json), {
		status: backendRes.status,
		headers: { "Content-Type": "application/json" }
	});
};

