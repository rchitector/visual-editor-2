<script lang="ts">
    import CanvasElement from "@/js/svelte/Canvas/CanvasElement.svelte";
    import {canvasMatrix} from '@/js/svelte/Store/store';
    import {elementIds} from "@/js/stores/elementsStore";
    import {lineIds} from "@/js/stores/linesStore";
    import Line from "@/js/svelte/Elements/Line.svelte";
    import DebugDot from "@/js/svelte/Debug/DebugDot.svelte";
    import DraggingLine from "@/js/svelte/Elements/DraggingLine.svelte";

    const elementKeys = $derived($elementIds);
    const linesKeys = $derived($lineIds);
</script>

<div class="relative top-0 left-0 select-none inset-0 w-0 h-0"
     style:transform={`matrix(${$canvasMatrix.scale}, 0, 0, ${$canvasMatrix.scale}, ${$canvasMatrix.x}, ${$canvasMatrix.y})`}>
    <DebugDot size="2"/>
    {#each linesKeys as lineKey (lineKey)}
        {#if lineKey}
            <Line id={lineKey}/>
        {/if}
    {/each}
    <DraggingLine/>
    {#each elementKeys as key (key)}
        {#if key}
            <CanvasElement id={key}/>
        {/if}
    {/each}
</div>
