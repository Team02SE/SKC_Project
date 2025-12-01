import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';
import type { Workflow, WorkflowDocument } from '$lib/types';

export const load: PageServerLoad = async ({ params }) => {
	const apiBase = env.API_URL;

	// the backend will fetch correct workflow based on the id of the document it belongs to
	// document id is being passed as a slug here
	const documentId = params.slug;

	const header = {
		headers: {
			'Content-Type': 'application/json',
			Authorization: env.API_KEY,
			'X-Custom-Header': 'custom-value'
		}
	};

	try {
		const workflowRes = await fetch(`${apiBase}/workflows/${documentId}`, header);
		const documentRes = await fetch(`${apiBase}/documents/${documentId}`, header);
		if (!workflowRes.ok || !documentRes.ok) {
			if (workflowRes.status === 404) {
				throw error(
					404,
					`Workflow with ID ${documentId} not found or document with ID ${documentId} not found !`
				);
			}
			throw error(workflowRes.status, `Failed to fetch workfow: ${workflowRes.statusText}`);
		}

		const workflowData = await workflowRes.json();
		const documentData = await documentRes.json();

		console.log(`Workflow ${documentId} loaded correctly`);
		console.log(`Document ${documentId} loaded correctly`);

		return {
			documentData: documentData as WorkflowDocument,
			workflowData: workflowData as Workflow
		};
	} catch (err) {
		console.log('Error loading workflow:', err);

		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}

		throw error(
			500,
			`Failed to load workflow: ${err instanceof Error ? err.message : 'Unknown error'}`
		);
	}
};
