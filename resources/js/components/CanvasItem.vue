<script setup lang="ts">
import {Item} from '../interfaces'
import {useCanvasStore} from '../stores/canvasStore.js';

const canvasStore = useCanvasStore();

defineProps<{ data: Item; }>();

const onMouseDown = (event: MouseEvent | TouchEvent, itemId: string | null = null) => {
    const point = event.touches?.[0] || event;
    if (itemId) {
        canvasStore.setOnTop(itemId);
        if (point.target && (point.target as HTMLElement).closest('[data-is-draggable]')) {
            canvasStore.draggingElement = canvasStore.items.find(item => item.id === itemId) || null;
            canvasStore.lastMouseX = point.clientX;
            canvasStore.lastMouseY = point.clientY;
        }
    }
};

</script>

<template>
    <div class="absolute select-none rounded-lg border-2 p-2 bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700 w-[200px]"
         :key="data.id"
         :style="{
            transform: `matrix(1, 0, 0, 1, ${data.x}, ${data.y})`,
        }"
         @mousedown="onMouseDown($event, data.id)"
         @touchstart="onMouseDown($event, data.id)"
    >
        <div class="cursor-grab hover:bg-gray-200 hover:dark:bg-gray-600" data-is-draggable="true">
            <div>id:{{ data.id }}</div>
        </div>
        <div class="border-gray-200 dark:border-gray-700"
             :style="{
                // backgroundColor: data.color,
             }"
        >
            <div>x:{{ data.x }}</div>
            <div>y:{{ data.y }}</div>
        </div>
    </div>
</template>