import type { RequestHandler } from '@sveltejs/kit';
import { API_URL, API_KEY } from '$env/static/private';


export const PUT: RequestHandler = async ({ request, params }) => {
    console.warn(":dsadasd");
    const { slug } = params;
    if (!slug) {
        return new Response('Missing slug parameter', { status: 400 });
    }
    const data = await request.json();
    const type = data.type.replace(/\s+/, '-').toLowerCase();
    console.warn(type);
    const res = await fetch(`${API_URL}/${type}/${slug}`, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': API_KEY
        },
        body: JSON.stringify(data)
    });

    return new Response(await res.text(), { status: res.status });
};