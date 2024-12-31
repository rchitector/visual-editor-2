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
    class="p-2 rounded-t-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 whitespace-nowrap flex items-center"
    class:cursor-grabbing={$dragging}
    class:cursor-grab={!$dragging}
>
    <div
        class="grow flex items-center text-gray-900 hover:text-primary-700 focus-within:text-primary-700 dark:focus-within:text-white dark:hover:text-white dark:text-white">
        <div class={`bg-${ColorName[ElementTypeColor[element.type]]}-500 w-3 h-3 rounded-full mr-1`}></div>
        <span class="capitalize">{title}</span>
    </div>
    <div>
        <svg viewBox="0 0 15 25" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="size-6">
            <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M9.5 8C10.3284 8 11 7.32843 11 6.5C11 5.67157 10.3284 5 9.5 5C8.67157 5 8 5.67157 8 6.5C8 7.32843 8.67157 8 9.5 8ZM9.5 14C10.3284 14 11 13.3284 11 12.5C11 11.6716 10.3284 11 9.5 11C8.67157 11 8 11.6716 8 12.5C8 13.3284 8.67157 14 9.5 14ZM11 18.5C11 19.3284 10.3284 20 9.5 20C8.67157 20 8 19.3284 8 18.5C8 17.6716 8.67157 17 9.5 17C10.3284 17 11 17.6716 11 18.5ZM15.5 8C16.3284 8 17 7.32843 17 6.5C17 5.67157 16.3284 5 15.5 5C14.6716 5 14 5.67157 14 6.5C14 7.32843 14.6716 8 15.5 8ZM17 12.5C17 13.3284 16.3284 14 15.5 14C14.6716 14 14 13.3284 14 12.5C14 11.6716 14.6716 11 15.5 11C16.3284 11 17 11.6716 17 12.5ZM15.5 20C16.3284 20 17 19.3284 17 18.5C17 17.6716 16.3284 17 15.5 17C14.6716 17 14 17.6716 14 18.5C14 19.3284 14.6716 20 15.5 20Z"></path>
        </svg>
    </div>
</div>
