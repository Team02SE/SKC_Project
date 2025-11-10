import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import type { WorkflowDocument, Activity, Effect, OpportunityStructure, SystemVulnerability, DStep } from '$lib/types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const apiBase = env.API_URL;
	const documentId = params.slug;

	const header = {
		headers: {
			'Content-Type': 'application/json',
			Authorization: env.API_KEY,
			'X-Custom-Header': 'custom-value'
		}
	};

	try {
		const [
			documentRes,
			activitiesRes,
			effectsRes,
			opportunityStructuresRes,
			systemVulnerabilitiesRes,
			dstepsRes
		] = await Promise.all([
			fetch(`${apiBase}/documents/${documentId}`, header),
			fetch(`${apiBase}/documents/${documentId}/activities`, header),
			fetch(`${apiBase}/documents/${documentId}/effects`, header),
			fetch(`${apiBase}/documents/${documentId}/opportunity-structures`, header),
			fetch(`${apiBase}/documents/${documentId}/system-vulnerabilities`, header),
			fetch(`${apiBase}/documents/${documentId}/dsteps`, header)
		]);

		// Check if document exists
		if (!documentRes.ok) {
			if (documentRes.status === 404) {
				throw error(404, `Document with ID ${documentId} not found`);
			}
			throw error(documentRes.status, `Failed to fetch document: ${documentRes.statusText}`);
		}

		const codingResponses = [
			{ name: 'activities', res: activitiesRes },
			{ name: 'effects', res: effectsRes },
			{ name: 'opportunity-structures', res: opportunityStructuresRes },
			{ name: 'system-vulnerabilities', res: systemVulnerabilitiesRes },
			{ name: 'dsteps', res: dstepsRes }
		];

		codingResponses.forEach(({ name, res }) => {
			if (!res.ok) {
				console.warn(`Failed to fetch ${name} for document ${documentId}: ${res.statusText}`);
			}
		});

		const [documentData, activitiesData, effectsData, opportunityStructuresData, systemVulnerabilitiesData, dstepsData] = await Promise.all([
			documentRes.json(),
			activitiesRes.ok ? activitiesRes.json() : Promise.resolve([]),
			effectsRes.ok ? effectsRes.json() : Promise.resolve([]),
			opportunityStructuresRes.ok ? opportunityStructuresRes.json() : Promise.resolve([]),
			systemVulnerabilitiesRes.ok ? systemVulnerabilitiesRes.json() : Promise.resolve([]),
			dstepsRes.ok ? dstepsRes.json() : Promise.resolve([])
		]);

		console.log(`Document ${documentId} loaded with codings`);

		return {
			document: documentData as WorkflowDocument,
			codings: {
				activities: activitiesData as Activity[],
				effects: effectsData as Effect[],
				opportunityStructures: opportunityStructuresData as OpportunityStructure[],
				systemVulnerabilities: systemVulnerabilitiesData as SystemVulnerability[],
				dsteps: dstepsData as DStep[]
			}
		};
	} catch (err) {
		console.error('Error loading document and codings:', err);
		
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}
		
        throw error(500, `Failed to load document: ${err instanceof Error ? err.message : 'Unknown error'}`);
	}
};
