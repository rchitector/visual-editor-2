<script setup lang="ts">
import {Item} from '@/js/interfaces'
import {useStore} from '@/js/stores/store';
import DebugDot from "@/js/components/Debug/DebugDot.vue";
import {DebugColor} from "@/js/components/Debug/DebugEnums";
import {vElementSize} from '@vueuse/components'

const store = useStore();

const props = defineProps<{ item: Item; }>();

const onMouseDown = (event: MouseEvent, itemId: string) => {
    event.stopPropagation();
    store.onCanvasItemPointDown(event, itemId);
};
const onTouchStart = (event: TouchEvent, itemId: string) => {
    event.stopPropagation();
    store.onCanvasItemPointDown(event.touches[0], itemId);
};
const onResize = ({width, height}: { width: number, height: number }) => {
    store.setCanvasItemSize(props.item.id, width, height)
};
</script>
<template>
    <div class="absolute box-border top-0 left-0 select-none"
         :key="props.item.id"
         :style="{ transform: `matrix(1, 0, 0, 1, ${props.item.x}, ${props.item.y})` }"
         v-element-size="onResize"
         @mousedown="onMouseDown($event, props.item.id)"
         @touchstart="onTouchStart($event, props.item.id)"
    >
        <DebugDot :color="DebugColor.Green" :size="1"/>
        <div class="w-full h-full p-2 border rounded-lg bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <div class="cursor-grab hover:bg-gray-200 hover:dark:bg-gray-600 whitespace-nowrap" data-is-draggable="true">id:{{ props.item.id }}</div>
            <div class="border-gray-200 dark:border-gray-700">
                <div>x:{{ props.item.x.toFixed(3) }}</div>
                <div>y:{{ props.item.y.toFixed(3) }}</div>
                <div>w:{{ props.item.w.toFixed(3) }}</div>
                <div>h:{{ props.item.h.toFixed(3) }}</div>
                <button class="border p-2 rounded" @click="()=>store.moveCanvasItemToCenter(props.item.id)">Center</button>
                <button class="border p-2 rounded bg-red-800" @click="()=>store.deleteCanvasItem(props.item.id)">Delete</button>
            </div>
        </div>
    </div>
</template>