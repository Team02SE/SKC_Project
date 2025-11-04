import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import type { Coding, WorkflowDocument } from '$lib/types';
import type { Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const apiBase = env.API_URL;

	const header = {
		headers: {
			'Content-Type': 'application/json',
			Authorization: env.API_KEY,
			'X-Custom-Header': 'custom-value'
		}
	};
	const documentsRes = await fetch(`${apiBase}/documents`, header);

	if (!documentsRes.ok) {
		documentsRes.json();
		console.error('Failed to fetch documents :' + documentsRes.statusText);
		throw new Error('Failed to fetch documents :' + documentsRes.statusText);
	}

	let documentData = await documentsRes.json();

	return {
		documetns: documentData as WorkflowDocument[]
	};
};
