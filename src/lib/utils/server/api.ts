import { env } from '$env/dynamic/private';

/**
 * Creates standardized headers for API requests with authorization.
 * 
 * @param includeContentType - Whether to include 'Content-Type: application/json' header. Defaults to true.
 * @returns Headers object with Authorization and optionally Content-Type
 */
export function createApiHeaders(includeContentType = true): HeadersInit {
	const headers: HeadersInit = {
		Authorization: env.API_KEY || ''
	};

	if (includeContentType) {
		headers['Content-Type'] = 'application/json';
	}

	return headers;
}

/**
 * Gets the API base URL from environment variables.
 * 
 * @returns The base URL for API requests from env.API_URL
 * @throws No error, returns empty string if not configured
 */
export function getApiBaseUrl(): string {
	return env.API_URL || '';
}

/**
 * Standardized API fetch wrapper with automatic error handling and JSON parsing.
 * Handles common HTTP patterns including empty responses and error states.
 * 
 * @template T - The expected response data type
 * @param endpoint - API endpoint path (e.g., '/documents' or '/workflows/123')
 * @param options - Optional fetch options (method, headers, body, etc.)
 * @returns Promise resolving to object with data, error, and statuss
 */
export async function apiFetch<T>(
	endpoint: string,
	options: RequestInit = {}
): Promise<{ data?: T; error?: string; status: number }> {
	const apiBase = getApiBaseUrl();
	const url = `${apiBase}${endpoint}`;

	try {
		const response = await fetch(url, {
			...options,
			headers: {
				...createApiHeaders(),
				...options.headers
			}
		});

		if (!response.ok) {
			const errorText = await response.text();
			return {
				error: errorText || response.statusText,
				status: response.status
			};
		}

		// Handle empty responses
		const contentLength = response.headers.get('content-length');
		if (contentLength === '0' || response.status === 204) {
			return { status: response.status };
		}

		// Parse JSON response
		const contentType = response.headers.get('content-type');
		if (contentType?.includes('application/json')) {
			const text = await response.text();
			const data = text ? JSON.parse(text) : undefined;
			return { data: data as T, status: response.status };
		}

		return { status: response.status };
	} catch (error) {
		console.error(`API fetch error for ${endpoint}:`, error);
		return {
			error: error instanceof Error ? error.message : 'Unknown error',
			status: 500
		};
	}
}

/**
 * Fetch multiple API endpoints in parallel with consistent error handling.
 * Uses Promise.allSettled to ensure all requests complete even if some fail.
 * 
 * @template T - Object type mapping keys to their expected response types
 * @param endpoints - Object mapping keys to endpoint paths
 * @returns Promise with partial data object and errors object for failed requestss
 */
export async function apiFetchMultiple<T extends Record<string, any>>(
	endpoints: Record<keyof T, string>
): Promise<{ data: Partial<T>; errors: Record<string, string> }> {
	const keys = Object.keys(endpoints) as (keyof T)[];
	const results = await Promise.allSettled(
		keys.map((key) => apiFetch(endpoints[key]))
	);

	const data: Partial<T> = {};
	const errors: Record<string, string> = {};

	results.forEach((result, index) => {
		const key = keys[index];
		if (result.status === 'fulfilled' && result.value.data) {
			(data as any)[key] = result.value.data;
		} else if (result.status === 'fulfilled' && result.value.error) {
			errors[key as string] = result.value.error;
		} else if (result.status === 'rejected') {
			errors[key as string] = result.reason;
		}
	});

	return { data, errors };
}

/**
 * Creates a standard error response for API routes with plain text body.
 * 
 * @param message - Error message to return in response body
 * @param status - HTTP status code (defaults to 500)
 * @returns Response object with error message and status
 */
export function createErrorResponse(message: string, status = 500): Response {
	return new Response(message, { status });
}

/**
 * Creates a standard JSON success response with proper Content-Type header.
 * Automatically serializes data to JSON string.
 * 
 * @template T - Type of data being returned
 * @param data - Data to serialize and return
 * @param status - HTTP status code (defaults to 200)
 * @returns Response object with JSON data and appropriate headers
 */
export function createJsonResponse<T>(data: T, status = 200): Response {
	return new Response(JSON.stringify(data), {
		status,
		headers: {
			'Content-Type': 'application/json'
		}
	});
}