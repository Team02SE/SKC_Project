import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const status = parseInt(params.status, 10);
	
	// Create appropriate error messages for different status codes
	const messages: Record<number, string> = {
		400: 'Bad Request - The request was invalid',
		401: 'Unauthorized - Please log in to continue',
		403: 'Forbidden - You do not have permission to access this resource',
		404: 'Not Found - The requested resource does not exist',
		500: 'Internal Server Error - Something went wrong on our end',
		502: 'Bad Gateway - The server received an invalid response',
		503: 'Service Unavailable - The service is temporarily unavailable'
	};
	
	throw error(status, messages[status] || `Error ${status}`);
};
