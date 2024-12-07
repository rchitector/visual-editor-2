<script setup lang="ts">
import {Element} from "@/js/interfaces";
import {useStore} from "@/js/stores/store";
import {ref} from "vue";

const store = useStore();
const props = defineProps<{ element: Element, title: string }>();

const dragging = ref(false);
const startDragging = (event) => {
    const {relatedX, relatedY} = store.documentPointToRelatedToCanvasZeroPoint(event.clientX, event.clientY);
    const offsetX = relatedX - props.element.x;
    const offsetY = relatedY - props.element.y;

    const move = (e) => {
        const {relatedX, relatedY} = store.documentPointToRelatedToCanvasZeroPoint(e.clientX, e.clientY);
        props.element.x = relatedX - offsetX;
        props.element.y = relatedY - offsetY;
    }
    const stop = () => {
        window.removeEventListener('mousemove', move)
        window.removeEventListener('mouseup', stop)
        dragging.value = false;
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', stop)
    dragging.value = true;
};
</script>

<template>
    <div
        class=" p-2 rounded-t-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 whitespace-nowrap flex items-center"
        :class="`${dragging ? 'cursor-grabbing' : 'cursor-grab'}`"
        data-draggable="true"
        @mousedown="startDragging($event)"
    >
        <div class="grow">{{ props.title }}</div>
        <div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
                <path
                    d="m13.28 7.78 3.22-3.22v2.69a.75.75 0 0 0 1.5 0v-4.5a.75.75 0 0 0-.75-.75h-4.5a.75.75 0 0 0 0 1.5h2.69l-3.22 3.22a.75.75 0 0 0 1.06 1.06ZM2 17.25v-4.5a.75.75 0 0 1 1.5 0v2.69l3.22-3.22a.75.75 0 0 1 1.06 1.06L4.56 16.5h2.69a.75.75 0 0 1 0 1.5h-4.5a.747.747 0 0 1-.75-.75ZM12.22 13.28l3.22 3.22h-2.69a.75.75 0 0 0 0 1.5h4.5a.747.747 0 0 0 .75-.75v-4.5a.75.75 0 0 0-1.5 0v2.69l-3.22-3.22a.75.75 0 1 0-1.06 1.06ZM3.5 4.56l3.22 3.22a.75.75 0 0 0 1.06-1.06L4.56 3.5h2.69a.75.75 0 0 0 0-1.5h-4.5a.75.75 0 0 0-.75.75v4.5a.75.75 0 0 0 1.5 0V4.56Z"/>
            </svg>
        </div>
    </div>
</template>
