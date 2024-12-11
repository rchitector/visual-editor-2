<script lang="ts">
    import {ColorName, ElementTypeColor, ItemTypes} from "@/js/stores/constants";
    import {createElementGlobal, store} from "@/js/svelte/Store/store";
    import {styleString} from "@/js/stores/helper";

    let {mainBoxRef} = $props();

    let elementType = $state(null);
    let pointCoordinates = $state({x: 0, y: 0});

    const onElementTypeClick = (event, type) => {
        let downCoordinates;
        const down = (event) => {
            downCoordinates = {x: event.clientX, y: event.clientY};
        }
        const move = (event) => {
            pointCoordinates = {x: event.clientX - $store.mainBoxRect.x, y: event.clientY - $store.mainBoxRect.y};
        }
        const stop = (event) => {
            if (!mainBoxRef) return;

            if (mainBoxRef == event.target && Math.abs(downCoordinates.x - event.clientX) == 0 && Math.abs(downCoordinates.y - event.clientY) == 0) {
                window.removeEventListener('mousedown', down);
                window.removeEventListener('mousemove', move);
                window.removeEventListener('mouseup', stop);
                createElementGlobal(event.clientX, event.clientY, elementType);
                elementType = null;
            }
        }
        window.addEventListener('mousedown', down);
        window.addEventListener('mousemove', move);
        window.addEventListener('mouseup', stop);
        elementType = type;
        pointCoordinates = {x: event.clientX - $store.mainBoxRect.x, y: event.clientY - $store.mainBoxRect.y};
    };

    const style = $derived({
        'transform': `matrix(${$store.canvasMatrix.scale}, 0, 0, ${$store.canvasMatrix.scale}, ${pointCoordinates.x}, ${pointCoordinates.y})`,
    });
</script>
{#if elementType}
    <div style={styleString(style)}
         class={`text-${ElementTypeColor[elementType]}-500 pointer-events-none absolute left-0 top-0 w-0 h-0`}>
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
