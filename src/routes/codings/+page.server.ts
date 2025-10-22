import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import type { Coding } from '$lib/types';

export const load: PageServerLoad = async ({ params }) => {
	const apiBase = env.API_URL;

	const header = {
		headers: {
			'Content-Type': 'application/json',
			Authorization: env.API_KEY,
			'X-Custom-Header': 'custom-value'
		}
	};
	const [activitiesRes, effectsRes, dstepsRes, opportunityStructuresRes, systemVulnerabilitiesRes] =
		await Promise.all([
			fetch(`${apiBase}/activities`, header),
			fetch(`${apiBase}/effects`, header),
			fetch(`${apiBase}/activities`, header), // Note: This seems to be the same as activities endpoint?
			fetch(`${apiBase}/opportunity-structures`, header),
			fetch(`${apiBase}/system-vulnerabilities`, header)
		]);

	// Check all responses
	const responses = [
		activitiesRes,
		effectsRes,
		dstepsRes,
		opportunityStructuresRes,
		systemVulnerabilitiesRes
	];

	const endpoints = [
		'activities',
		'effects',
		'dsteps',
		'opportunity-structures',
		'system-vulnerabilities'
	];

	responses.forEach((res, index) => {
		if (!res.ok) {
			throw new Error(`Failed to fetch ${endpoints[index]}: ${res.statusText}`);
		}
	});

	const [
		activitiesData,
		effectsData,
		dstepsData,
		opportunityStructuresData,
		systemVulnerabilitiesData
	] = await Promise.all([
		activitiesRes.json(),
		effectsRes.json(),
		dstepsRes.json(),
		opportunityStructuresRes.json(),
		systemVulnerabilitiesRes.json()
	]);

	return {
		activities: activitiesData as Coding[],
		effects: effectsData as Coding[],
		dsteps: dstepsData as Coding[],
		opportunityStructures: opportunityStructuresData as Coding[],
		systemVulnerabilities: systemVulnerabilitiesData as Coding[]
	};
};
