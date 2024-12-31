<script lang="ts">
    import {documentPointToRelatedToCanvasZeroPoint} from "@/js/svelte/Store/store";
    import {ColorName, ElementTypeColor} from "@/js/svelte/Store/constants";
    import {writable} from "svelte/store";
    import {getElementStore} from "@/js/svelte/Store/elementsStore";

    let {title, element} = $props();
    let thisRef;
    let dragging = writable(false);

    const startDragging = (event) => {
        const {x: relatedX, y: relatedY} = documentPointToRelatedToCanvasZeroPoint(event.clientX, event.clientY);
        const offsetX = relatedX - element.x;
        const offsetY = relatedY - element.y;

        const move = (e) => {
            if ($dragging) {
                const {x: relatedX, y: relatedY} = documentPointToRelatedToCanvasZeroPoint(e.clientX, e.clientY);
                getElementStore(element.id).update((state) => {
                    state.x = relatedX - offsetX;
                    state.y = relatedY - offsetY;
                    return state;
                });
            }
        }
        const stop = () => {
            window.removeEventListener('mousemove', move);
            window.removeEventListener('mouseup', stop);
            dragging.set(false);
        }

        window.addEventListener('mousemove', move);
        window.addEventListener('mouseup', stop);
        dragging.set(true);
    };
</script>

<div
    bind:this={thisRef}
    onmousedown={startDragging}
    class="min-w-64 p-2 rounded-t-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 whitespace-nowrap flex items-center"
    class:cursor-grabbing={$dragging}
    class:cursor-grab={!$dragging}
>
    <div
        class="grow flex items-center text-gray-900 hover:text-primary-700 focus-within:text-primary-700 dark:focus-within:text-white dark:hover:text-white dark:text-white">
        <div class={`bg-${ColorName[ElementTypeColor[element.type]]}-500 w-3 h-3 rounded-full mr-1`}></div>
        <span class="capitalize">{title}</span>
    </div>
    <div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
            <path
                d="m13.28 7.78 3.22-3.22v2.69a.75.75 0 0 0 1.5 0v-4.5a.75.75 0 0 0-.75-.75h-4.5a.75.75 0 0 0 0 1.5h2.69l-3.22 3.22a.75.75 0 0 0 1.06 1.06ZM2 17.25v-4.5a.75.75 0 0 1 1.5 0v2.69l3.22-3.22a.75.75 0 0 1 1.06 1.06L4.56 16.5h2.69a.75.75 0 0 1 0 1.5h-4.5a.747.747 0 0 1-.75-.75ZM12.22 13.28l3.22 3.22h-2.69a.75.75 0 0 0 0 1.5h4.5a.747.747 0 0 0 .75-.75v-4.5a.75.75 0 0 0-1.5 0v2.69l-3.22-3.22a.75.75 0 1 0-1.06 1.06ZM3.5 4.56l3.22 3.22a.75.75 0 0 0 1.06-1.06L4.56 3.5h2.69a.75.75 0 0 0 0-1.5h-4.5a.75.75 0 0 0-.75.75v4.5a.75.75 0 0 0 1.5 0V4.56Z"/>
        </svg>
    </div>
</div>
