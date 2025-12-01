import { env } from '$env/dynamic/private';
import type { PageServerLoad } from './$types';
import type { Actions } from './$types';

export const load: PageServerLoad = async () => {
	//Codings are now loaded in the root layout (+layout.server.ts)
	//Leaving this here instead of deleting for clarity for potential merge conflicts
	return {};
};

export const actions = {
	codings: async ({ request }) => {
		const data = await request.formData();

		const name = data.get(`name`);
		const description = data.get(`description`);
		const number = data.get(`number`);
		const type = (data.get(`type`) as string || '').toLowerCase().trim();
		const parent_id = data.get(`parent_id`);

		if (!type) {
			throw new Error('Missing type parameter');
		}

		// Process parent_id: convert to number if valid, otherwise omit
		const processedParentId = parent_id && parent_id !== '' ? Number(parent_id) : null;

		const payload: Record<string, any> = {
			name,
			description,
			number: number ? Number(number) : 0
		};
		
		// Only include parent_id if it has a valid value
		if (processedParentId !== null) {
			payload.parent_id = processedParentId;
		}

		const res = await fetch(`${env.API_URL}/${type}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: env.API_KEY
			},
			body: JSON.stringify(payload)
		});

		if (!res.ok) {
			const errorBody = await res.text();
			console.error(`API Error [${res.status}]:`, errorBody);
			throw new Error(`Failed to create coding: ${res.status} ${res.statusText}`);
		}
		
		const responseText = await res.text();
		let responseData = null;
		
		if (responseText) {
			try {
				responseData = JSON.parse(responseText);
			} catch (e) {
				console.error('Failed to parse API response:', e);
			}
		}
		
		return { success: true, data: responseData };
	}
} satisfies Actions;
