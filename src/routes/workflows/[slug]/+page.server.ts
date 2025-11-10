import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import type { Coding, WorkflowDocument } from '$lib/types';
import type { Actions } from './$types';
import { json } from 'stream/consumers';

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
		const documentRes = await fetch(`${apiBase}/documents/${params.slug}`, header);

		console.log('Fetching document from:', `${apiBase}/documents/${params.slug}`);
		console.log('Response status:', documentRes.status, documentRes.statusText);

		if (!documentRes.ok) {
			const errorText = await documentRes.text();
			console.error('Failed to fetch documents:', documentRes.status, errorText);

			return {
				document: {} as WorkflowDocument
			};
		}

		const documentData = await documentRes.json();
		console.log('Documents fetched successfully:', documentData.Title);

		return {
			documents: documentData as WorkflowDocument
		};
	} catch (error) {
		console.error('Error fetching document:', error);
		return {
			documents: {} as WorkflowDocument
		};
	}
};
