export interface ToastData {
	id: string;
	message: string;
	type: 'success' | 'error' | 'info' | 'warning';
	duration?: number;
}

class ToastStore {
	toasts = $state<ToastData[]>([]);

	private generateId(): string {
		return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
	}

	/**
	 * Show a success toast notification
	 */
	success(message: string, duration = 3000) {
		this.add({ message, type: 'success', duration });
	}

	/**
	 * Show an error toast notification
	 */
	error(message: string, duration = 4000) {
		this.add({ message, type: 'error', duration });
	}

	/**
	 * Show an info toast notification
	 */
	info(message: string, duration = 3000) {
		this.add({ message, type: 'info', duration });
	}

	/**
	 * Show a warning toast notification
	 */
	warning(message: string, duration = 3500) {
		this.add({ message, type: 'warning', duration });
	}

	/**
	 * Add a custom toast notification
	 */
	add(toast: Omit<ToastData, 'id'>) {
		const id = this.generateId();
		this.toasts.push({ id, ...toast });
	}

	/**
	 * Remove a toast by ID
	 */
	remove(id: string) {
		this.toasts = this.toasts.filter(t => t.id !== id);
	}

	/**
	 * Clear all toasts
	 */
	clear() {
		this.toasts = [];
	}
}

export const toastStore = new ToastStore();
