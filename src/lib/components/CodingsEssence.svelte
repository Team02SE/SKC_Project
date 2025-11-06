<script lang="ts">
    import Textbox from "./Textbox.svelte";
	import type { EssenceData } from "$lib/types";
	let { data }: { data: EssenceData } = $props();
</script>

<section id="essence" class="mb-50">
	<h1 class="text-4xl font-bold text-light-text-primary">Essence</h1>
	<Textbox title="Essence" content={data.essence}/>
	<Textbox title="Summary" content={data.summary}/>
	<Textbox title="Conclusion" content={data.conclusion}/>
</section>
