// Shared state to manage dropdown visibility - only one dropdown can be open at a time
let openDropdownId = $state<string | number | null>(null);

export const dropdownState = {
	get openId() {
		return openDropdownId;
	},
	open(id: string | number) {
		openDropdownId = id;
	},
	close(id: string | number) {
		if (openDropdownId === id) {
			openDropdownId = null;
		}
	},
	toggle(id: string | number) {
		if (openDropdownId === id) {
			openDropdownId = null;
		} else {
			openDropdownId = id;
		}
	},
	isOpen(id: string | number) {
		return openDropdownId === id;
	}
};
