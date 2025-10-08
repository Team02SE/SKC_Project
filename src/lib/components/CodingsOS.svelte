<script lang="ts">
    import TreeCodings from "./TreeCodings.svelte";
    import AddCoding from "./AddCoding.svelte";

    // THIS IS TEST DATA UNTIL REAL DATA IS IMPLEMENTED
    const sectorData = {
        title: "Sector",
        label: "1",
        children: [
            {
                title: "Sub-sector 1",
                label: "1.1",
                buttonIcon: "close"
            },
            {
                title: "Sub-sector 2",
                label: "1.2",
                buttonIcon: "close"
            },
            {
                title: "Sub-sector 3",
                label: "1.3",
                buttonIcon: "close"
            }
        ]
    };
</script>

<h1 class="text-4xl font-bold text-light-text-primary">Opportunity Structures</h1>
<div class="flex h-full w-full gap-30">
    <div class="h-full w-1/2">
        <TreeCodings data={sectorData} />
    </div>

    <div class="h-full w-1/2">
        <AddCoding />
    </div>
</div>