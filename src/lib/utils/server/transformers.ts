import type { Workflow } from '$lib/types';

/**
 * Transforms backend workflow response to frontend structure.
 * Maps backend field names (Pascal case) to frontend field names (camelCase/kebab-case).
 * 
 * @param backendData - Raw workflow data from backend API
 * @returns Workflow object with frontend field structure
 */
export function transformWorkflowFromBackend(backendData: any): Workflow {
	return {
		id: backendData.id,
		activities: backendData.Activities || [],
		effects: backendData.Effects || [],
		destep: backendData.Dsteps || [],
		'opportunity-structures': backendData.Os || [],
		'system-vulnerabilities': backendData.Sv || [],
		updated_at: backendData.updated_at
	};
}

/**
 * Transforms frontend workflow to backend structure.
 * Maps frontend field names to backend expected field names (Pascal case).
 * 
 * @param workflow - Workflow object from frontend
 * @returns Object formatted for backend API consumption
 */
export function transformWorkflowToBackend(workflow: Workflow): any {
	return {
		Activities: workflow.activities,
		Effects: workflow.effects,
		Dsteps: workflow.destep,
		Os: workflow['opportunity-structures'],
		Sv: workflow['system-vulnerabilities'],
		updated_at: workflow.updated_at
	};
}

/**
 * Creates an empty codings structure with all required keys initialized to empty arrays.
 * Useful as a fallback when API requests fail or as default state.
 * 
 * @returns Object with all coding categories initialized to empty arrays
 */
export function createEmptyCodings() {
	return {
		activities: [],
		effects: [],
		destep: [],
		'opportunity-structures': [],
		'system-vulnerabilities': []
	};
}
