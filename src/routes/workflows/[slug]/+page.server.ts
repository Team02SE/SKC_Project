import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';
import type { Workflow } from '$lib/types';

export const load: PageServerLoad = async ({ params }) => {
	const apiBase = env.API_URL;
	const workflowId = params.slug;

	const header = {
		headers: {
			'Content-Type': 'application/json',
			Authorization: env.API_KEY,
			'X-Custom-Header': 'custom-value'
		}
	};

	try {
		const workflowRes = await fetch(`${apiBase}/workflows/${workflowId}`, header);

		if (!workflowRes.ok) {
			if (workflowRes.status === 404) {
				throw error(404, `Workflow with ID ${workflowId} not found`);
			}
			throw error(workflowRes.status, `Failed to fetch document: ${workflowRes.statusText}`);
		}

		const workflowData = await workflowRes.json();

		console.log(`Workflow ${workflowId} loaded correctly`);

		return {
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
