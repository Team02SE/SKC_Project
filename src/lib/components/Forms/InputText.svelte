<script lang="ts">
	interface Props {
		val: string;
		label: string;
		placeholder?: string;
		name: string;
		required?: boolean;
		disabled?: boolean;
		center_text?: boolean;
	}

	let {
		val = '',
		label,
		placeholder = '',
		name,
		required = false,
		disabled = false,
		center_text = false
	}: Props = $props();
</script>
