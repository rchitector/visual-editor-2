<script lang="ts">
    import {ColorName, ElementTypeColor, ItemTypes} from "@/js/stores/constants";
    import {createElementGlobal, store} from "@/js/svelte/Store/store";
    import {writable} from "svelte/store";

    let {mainBoxRef} = $props();
    let pointCoordinates = $state({x: 0, y: 0});
    let activeTool = writable(null);

    const onElementTypeClick = (event, type) => {
        $activeTool = type;
        pointCoordinates = {x: event.clientX - $store.mainBoxRect.x, y: event.clientY - $store.mainBoxRect.y};
    };
    const handleMouseMove = (event) => {
        if ($activeTool) {
            pointCoordinates = {x: event.clientX - $store.mainBoxRect.x, y: event.clientY - $store.mainBoxRect.y};
        }
    };
    const handleMouseDown = (event) => {
        if ($activeTool && event.target === mainBoxRef) {
            createElementGlobal(event.clientX, event.clientY, $activeTool);
            $activeTool = null;
        }
    };

</script>
<svelte:body onmousemove={handleMouseMove} onmousedown={handleMouseDown}/>
{#if $activeTool}
    <div
        style:transform={`matrix(${$store.canvasMatrix.scale}, 0, 0, ${$store.canvasMatrix.scale}, ${pointCoordinates.x}, ${pointCoordinates.y})`}
        class={`text-${ElementTypeColor[$activeTool]}-500 pointer-events-none absolute left-0 top-0 w-0 h-0`}>
        <div
            class="pointer-events-none absolute rounded-lg border border-gray-200 dark:border-gray-700 p-2 bg-white dark:bg-gray-800">
            <div>{ pointCoordinates.x }:{ pointCoordinates.y }:{$store.canvasMatrix.scale}</div>
        </div>
    </div>
{/if}
<div
    class="absolute left-5 top-5 rounded-lg border border-gray-200 dark:border-gray-700 p-2 bg-white dark:bg-gray-800">
    <div class="gap-1 flex items-center">
        <button
            class={`text-${ColorName[ElementTypeColor.start]}-500 p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 group`}
            type="button"
            onclick={(event)=>onElementTypeClick(event, ItemTypes.Start)}>Start
        </button>
        <button
            class={`text-${ColorName[ElementTypeColor.action1]}-500 p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 group`}
            type="button"
            onclick={(event)=>onElementTypeClick(event, ItemTypes.Action1)}>Action 1
        </button>
        <button
            class={`text-${ColorName[ElementTypeColor.action2]}-500 p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 group`}
            type="button"
            onclick={(event)=>onElementTypeClick(event, ItemTypes.Action2)}>Action 2
        </button>
        <button
            class={`text-${ColorName[ElementTypeColor.finish]}-500 p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 group`}
            type="button"
            onclick={(event)=>onElementTypeClick(event, ItemTypes.Finish)}>Finish
        </button>
    </div>
</div>
