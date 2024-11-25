<script setup lang="ts">
import {Item} from '../interfaces'
import {useCanvasStore} from '../stores/canvasStore.js';
import DebugDot from "@/js/components/Debug/DebugDot.vue";
import {DebugColor} from "@/js/components/Debug/DebugEnums";
import { vElementSize } from '@vueuse/components'

const canvasStore = useCanvasStore();

const props = defineProps<{ item: Item; }>();

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

const onResize = ({ width, height }: { width: number, height: number }) => canvasStore.setItemSize(props.item.id, width, height);
</script>
<template>
    <div class="absolute box-border top-0 left-0 select-none"
         v-element-size="onResize"
         :key="props.item.id"
         :style="{ transform: `matrix(1, 0, 0, 1, ${props.item.x}, ${props.item.y})` }"
         @mousedown="onMouseDown($event, props.item.id)"
         @touchstart="onMouseDown($event, props.item.id)"
    >
        <DebugDot :color="DebugColor.Green" :size="1" />
        <div class="w-full h-full p-2 border rounded-lg bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <div class="cursor-grab hover:bg-gray-200 hover:dark:bg-gray-600 whitespace-nowrap" data-is-draggable="true" >id:{{ props.item.id }}</div>
            <div class="border-gray-200 dark:border-gray-700">
                <div>x:{{ props.item.x.toFixed(3) }}</div>
                <div>y:{{ props.item.y.toFixed(3) }}</div>
                <div>w:{{ props.item.w.toFixed(3) }}</div>
                <div>h:{{ props.item.h.toFixed(3) }}</div>
                <button class="border p-2 rounded" @click="()=>centerMe(props.item.id)">Center</button>
            </div>
        </div>
    </div>
</template>