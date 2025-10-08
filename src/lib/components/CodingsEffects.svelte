<script lang="ts">
    import Effect from "./TreeCodings.svelte";
    import AddCoding from "./AddCoding.svelte";

    // THIS IS TEST DATA UNTIL REAL DATA IS IMPLEMENTED
    const data = {
        title: "Effect Title",
        label: "1",
        buttonIcon: "",
        children: [
            {
                title: "Sub-effect 1",
                label: "1.1",
                buttonIcon: "close"
            },
            {
                title: "Sub-effect 2",
                label: "1.2",
                buttonIcon: "close"
            },
            {
                title: "Sub-effect 3",
                label: "1.3",
                buttonIcon: "close"
            }
        ]
    }
</script>

<h1 class="text-4xl font-bold text-light-text-primary">Effects</h1>
<div class="w-2/3 h-0.5 bg-light-text-primary/15 "></div>
<div class="flex h-full w-full gap-30">
    <div class="h-full w-1/2">
        <h2 class="text-2xl font-semibold text-light-text-primary mb-2">N1</h2>
        <Effect data={data} />
        <Effect data={data} />
    </div>
    <div class="h-full w-1/2">
        <h2 class="text-2xl font-semibold text-light-text-primary mb-2">Add N1 Effect</h2>
        <AddCoding />
    </div>
</div>
