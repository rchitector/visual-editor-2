<script lang="ts">
    import Line from "@/js/svelte/Elements/Line.svelte";
    import {lineIds} from "@/js/svelte/Store/linesStore";

    const linesKeys = $derived($lineIds);
</script>

<div class="relative top-0 left-0 select-none inset-0 w-0 h-0">
    {#each linesKeys as key (key)}
        {#if key}
            <Line id={key}/>
        {/if}
    {/each}
</div>
