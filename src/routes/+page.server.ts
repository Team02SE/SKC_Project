import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import type { WorkflowDocument } from '$lib/types';

export const load: PageServerLoad = async ({ params }) => {
	const apiBase = env.API_URL;

	const header = {
		headers: {
			'Content-Type': 'application/json',
			Authorization: env.API_KEY,
			'X-Custom-Header': 'custom-value'
		}
	};

	try {
		const documentsRes = await fetch(`${apiBase}/documents`, header);

		console.log('Fetching documents from:', `${apiBase}/documents`);
		console.log('Response status:', documentsRes.status, documentsRes.statusText);

		if (!documentsRes.ok) {
			const errorText = await documentsRes.text();
			console.log('Failed to fetch documents:', documentsRes.status, errorText);

			return {
				documents: [] as WorkflowDocument[]
			};
		}

		const documentData = await documentsRes.json();
		console.log('Documents fetched successfully:', documentData.length);

		return {
			documents: documentData as WorkflowDocument[]
		};
	} catch (error) {
		console.log('Error fetching documents:', error);
		return {
			documents: [] as WorkflowDocument[]
		};
	}
};
