import type { PageServerLoad } from './$types';
import type { Actions } from './$types';

export const load: PageServerLoad = async () => {
	//Codings are now loaded in the root layout (+layout.server.ts)
	//Leaving this here instead of deleting for clarity for potential merge conflicts
	return {};
};

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		console.log(data);
	}
} satisfies Actions;
