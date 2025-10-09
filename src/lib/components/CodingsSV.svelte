<script lang="ts">
    import TreeCodings from "./TreeCodings.svelte";
    import AddCoding from "./AddCoding.svelte";
	import Textbox from "./Textbox.svelte";

    // THIS IS TEST DATA UNTIL REAL DATA IS IMPLEMENTED
    const svData = {
        title: "Sv",
        label: "1",
        children: [
            {
                title: "Sub-sv 1",
                label: "1.1",
                buttonIcon: "close"
            },
            {
                title: "Sub-sv 2",
                label: "1.2",
                buttonIcon: "close"
            },
            {
                title: "Sub-sv 3",
                label: "1.3",
                buttonIcon: "close"
            }
        ]
    };
</script>

<h1 class="text-4xl font-bold text-light-text-primary">System Vulnerabilities - Clustering</h1>
<div class="flex h-full w-full gap-30">
    <div class="h-full w-1/2">
        <TreeCodings data={svData} />
    </div>

    <div class="h-full w-1/2">
        <AddCoding />
    </div>
</div>

<h1 class="text-4xl font-bold text-light-text-primary">System Vulnerabilities</h1>
<Textbox />