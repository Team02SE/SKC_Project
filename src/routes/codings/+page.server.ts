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

		const url = `${env.API_URL}/${type}`;

		console.log("sending request");

		const res = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: env.API_KEY
			},
			body: JSON.stringify({
				name,
				description,
				number: number ? Number(number) : 0,
				parent_id: parent_id !== null ? Number(parent_id) : null
			})
		});

		console.log("sending");

		if (!res.ok) {
			const errorBody = await res.text();
			console.error(`API Error [${res.status}]:`, errorBody);
			throw new Error(`Failed to create coding: ${res.status} ${res.statusText}`);
		}
		return { success: true };
	}
} satisfies Actions;
