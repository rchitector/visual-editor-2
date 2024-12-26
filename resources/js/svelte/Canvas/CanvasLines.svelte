<script lang="ts">
    import {store} from "@/js/svelte/Store/store";
    import Line from "../Elements/Line.svelte";
</script>

<div class="relative top-0 left-0 select-none inset-0 w-0 h-0">
    {#each $store.lines as [id, line]}
        <Line line={line}/>
    {/each}
</div>
