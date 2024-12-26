<script lang="ts">
    import CanvasElement from "@/js/svelte/Canvas/CanvasElement.svelte";
    import DebugDot from "../Debug/DebugDot.svelte";
    import {canvasMatrix, elementsStore} from '@/js/svelte/Store/store';
</script>

<div class="relative top-0 left-0 select-none inset-0 w-0 h-0"
     style:transform={`matrix(${$canvasMatrix.scale}, 0, 0, ${$canvasMatrix.scale}, ${$canvasMatrix.x}, ${$canvasMatrix.y})`}>
    <DebugDot size="2"/>
    {#each Object.values($elementsStore) as element (element.id)}
        <CanvasElement {element}/>
    {/each}
</div>
