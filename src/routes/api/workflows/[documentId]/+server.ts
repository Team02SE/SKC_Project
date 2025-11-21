import type { RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export const PUT: RequestHandler = async ({ params, request }) => {
	const { documentId } = params;
	
	if (!documentId) {
		return new Response('Missing documentId parameter', { status: 400 });
	}

	const apiBase = env.API_URL;
	const apiKey = env.API_KEY;

	try {
		const body = await request.json();
		const { activities, effects, dsteps, opportunity_structures, system_vulnerabilities } = body;

		console.log(`Batch updating workflow ${documentId} with codings:`, {
			activities: activities?.length || 0,
			effects: effects?.length || 0,
			dsteps: dsteps?.length || 0,
			opportunity_structures: opportunity_structures?.length || 0,
			system_vulnerabilities: system_vulnerabilities?.length || 0
		});

		const response = await fetch(`${apiBase}/workflows/${documentId}`, {
			method: 'PUT',
			headers: {
				Authorization: apiKey,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				activities: activities || [],
				effects: effects || [],
				dsteps: dsteps || [],
				opportunity_structures: opportunity_structures || [],
				system_vulnerabilities: system_vulnerabilities || []
			})
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error(`Failed to update workflow: ${response.statusText}`, errorText);
			return new Response(`Failed to update workflow: ${response.statusText}`, {
				status: response.status
			});
		}

		const result = await response.json();
		console.log(`Successfully updated workflow ${documentId}`);

		return new Response(JSON.stringify(result), { 
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} catch (error) {
		console.error('Error batch updating workflow:', error);
		return new Response('Internal server error', { status: 500 });
	}
};
