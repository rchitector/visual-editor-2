<script setup lang="ts">
import {Item} from '../interfaces'
import {useCanvasStore} from '../stores/canvasStore.js';

const canvasStore = useCanvasStore();

defineProps<{ data: Item; }>();

const onMouseDown = (event: MouseEvent | TouchEvent, itemId: string) => {
    canvasStore.setOnTop(itemId);
    const point = 'touches' in event ? event.touches[0] : event;
    if (point.target && (point.target as HTMLElement).closest('[data-is-draggable]')) {
        canvasStore.draggingElement = canvasStore.items.find(item => item.id === itemId) || null;
        canvasStore.lastMouseX = point.clientX;
        canvasStore.lastMouseY = point.clientY;
    }
};

const centerMe = (itemId: string) => {
    const me = canvasStore.items.find(item => item.id === itemId);
    if (me) {
        me.x = 0;
        me.y = 0;
    }
};
</script>

<template>
    <div class="absolute box-border top-0 left-0 select-none"
         :key="data.id"
         :style="{ transform: `matrix(1, 0, 0, 1, ${data.x}, ${data.y})`, width: `${data.w}px`, height: `${data.h}px`, minHeight: `${data.h}px`, maxHeight: `${data.h}px`, }"
         @mousedown="onMouseDown($event, data.id)"
         @touchstart="onMouseDown($event, data.id)"
    >
        <div v-if="canvasStore.debug"  class="z-[99999] w-1 h-1 -ml-0.5 -mt-0.5 absolute top-0 left-0 select-none rounded-full bg-green-500 dark:bg-green-500"></div>
        <div class="w-full h-full p-2 border-4 rounded-lg bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <div class="cursor-grab hover:bg-gray-200 hover:dark:bg-gray-600" data-is-draggable="true">
                <div>id:{{ data.id }}</div>
            </div>
            <div class="border-gray-200 dark:border-gray-700">
                <div>x:{{ data.x.toFixed(3) }}</div>
                <div>y:{{ data.y.toFixed(3) }}</div>
                <button @click="()=>centerMe(data.id)">Center</button>
            </div>
        </div>
    </div>
</template>