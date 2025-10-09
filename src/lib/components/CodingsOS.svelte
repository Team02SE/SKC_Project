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

    const structures = [
        "Railroads",
        "Police",
        "Buildings",
        "Roads",
        "Bridges",
        "Airports",
        "Banks",
        "Schools",
        "Hospitals",
        "Water Systems",
        "Electric Grid"
    ]
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

<h1 class="text-xl font-bold text-light-text-primary">Structures</h1>
<div class="flex h-full w-full gap-30">
    <div class="h-full w-1/2">
        <div class="grid grid-cols-2 gap-4">
            <!-- SPLITS THE LIST INTO TWO COLUMNS -->
            <ul class="list-disc pl-6 text-light-text-primary">
            {#each structures.slice(0, Math.ceil(structures.length / 2)) as structure}
                <li class="py-1">{structure}</li>
            {/each}
            </ul>
            <ul class="list-disc pl-6 text-light-text-primary">
            {#each structures.slice(Math.ceil(structures.length / 2)) as structure}
                <li class="py-1">{structure}</li>
            {/each}
            </ul>
        </div>
    </div>
    <div class="h-full w-1/2">
        <AddCoding />
    </div>
</div>