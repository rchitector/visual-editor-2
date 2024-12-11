<script>
    import DebugDot from "@/js/svelte/Debug/DebugDot.svelte";
    import {store} from '@/js/svelte/Store/store';
    import CanvasElement from "@/js/svelte/Canvas/CanvasElement.svelte";
</script>

<div
    style:transform={`matrix(${$store.canvasMatrix.scale}, 0, 0, ${$store.canvasMatrix.scale}, ${$store.canvasMatrix.x}, ${$store.canvasMatrix.y})`}
    class="relative top-0 left-0 select-none inset-0 w-0 h-0">
    <DebugDot size="2"/>
    {#each Object.entries($store.elements) as [id, element]}
        <CanvasElement element={element}/>
    {/each}
</div>
