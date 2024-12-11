<script lang="ts">
    import {documentPointToRelatedToCanvasZeroPoint, store} from "@/js/svelte/Store/store";

    let {title, element, onDragHeader} = $props();
    let thisElement;

    let dragging = false;
    const startDragging = (event) => {
        const {x: relatedX, y: relatedY} = documentPointToRelatedToCanvasZeroPoint(event.clientX, event.clientY);
        const offsetX = relatedX - element.x;
        const offsetY = relatedY - element.y;

        const move = (e) => {
            if (dragging) {
                const {x: relatedX, y: relatedY} = documentPointToRelatedToCanvasZeroPoint(e.clientX, e.clientY);
                element.x = relatedX - offsetX;
                element.y = relatedY - offsetY;
                onDragHeader();

                store.update(state => ({
                    ...state,
                    elements: {
                        ...state.elements,
                        [element.id]: {...element},
                    },
                }));
            }
        }
        const stop = () => {
            window.removeEventListener('mousemove', move);
            window.removeEventListener('mouseup', stop);
            dragging = false;
        }

        window.addEventListener('mousemove', move);
        window.addEventListener('mouseup', stop);
        dragging = true;
    };
</script>

<div
    bind:this={thisElement}
    onmousedown={startDragging}
    class="min-w-64 p-2 rounded-t-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 whitespace-nowrap flex items-center"
    class:cursor-grabbing={dragging}
    class:cursor-grab={!dragging}
>
    <div class="grow">{title}</div>
    <div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
            <path
                d="m13.28 7.78 3.22-3.22v2.69a.75.75 0 0 0 1.5 0v-4.5a.75.75 0 0 0-.75-.75h-4.5a.75.75 0 0 0 0 1.5h2.69l-3.22 3.22a.75.75 0 0 0 1.06 1.06ZM2 17.25v-4.5a.75.75 0 0 1 1.5 0v2.69l3.22-3.22a.75.75 0 0 1 1.06 1.06L4.56 16.5h2.69a.75.75 0 0 1 0 1.5h-4.5a.747.747 0 0 1-.75-.75ZM12.22 13.28l3.22 3.22h-2.69a.75.75 0 0 0 0 1.5h4.5a.747.747 0 0 0 .75-.75v-4.5a.75.75 0 0 0-1.5 0v2.69l-3.22-3.22a.75.75 0 1 0-1.06 1.06ZM3.5 4.56l3.22 3.22a.75.75 0 0 0 1.06-1.06L4.56 3.5h2.69a.75.75 0 0 0 0-1.5h-4.5a.75.75 0 0 0-.75.75v4.5a.75.75 0 0 0 1.5 0V4.56Z"/>
        </svg>
    </div>
</div>
