<script setup lang="ts">
import {Item} from '@/js/interfaces'
import {useStore} from '@/js/stores/store';
import DebugDot from "@/js/components/Debug/DebugDot.vue";
import {DebugColor} from "@/js/components/Debug/DebugEnums";
import {vElementSize} from '@vueuse/components'
import {itemTypeColor} from "@/js/stores/helper";

const store = useStore();

const props = defineProps<{ item: Item; }>();

const onResize = ({width, height}: { width: number, height: number }) => {
    store.setCanvasItemSize(props.item.id, width, height)
};

const onStartDragItem = (event: MouseEvent | TouchEvent): void => {
    event.stopPropagation();
    store.setCanvasItemOnTop(props.item.id);
    store.dragging.element = store.items.find(item => item.id === props.item.id) || null;
    const point = 'touches' in event ? event.touches[0] : event;
    store.documentLastPoint = {x: point.clientX, y: point.clientY};
};

</script>
<template>
    <div class="absolute box-border top-0 left-0 select-none"
         :key="props.item.id"
         :style="{ transform: `matrix(1, 0, 0, 1, ${props.item.x}, ${props.item.y})` }"
         v-element-size="onResize"
    >
        <DebugDot :color="DebugColor.Green" :size="1"/>
        <div class="p-0.5 border rounded-lg bg-white border-gray-200 dark:bg-gray-700 dark:border-gray-600 shadow shadow-lg">
            <div class="cursor-grab p-2 rounded-t-md bg-gray-200 dark:bg-gray-600 whitespace-nowrap flex items-center"
                 @mousedown="onStartDragItem"
                 @touchstart="onStartDragItem"
            >
                <div class="grow" :style="{ color: itemTypeColor(props.item.type) }">{{ props.item.type }}</div>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
                        <path d="m13.28 7.78 3.22-3.22v2.69a.75.75 0 0 0 1.5 0v-4.5a.75.75 0 0 0-.75-.75h-4.5a.75.75 0 0 0 0 1.5h2.69l-3.22 3.22a.75.75 0 0 0 1.06 1.06ZM2 17.25v-4.5a.75.75 0 0 1 1.5 0v2.69l3.22-3.22a.75.75 0 0 1 1.06 1.06L4.56 16.5h2.69a.75.75 0 0 1 0 1.5h-4.5a.747.747 0 0 1-.75-.75ZM12.22 13.28l3.22 3.22h-2.69a.75.75 0 0 0 0 1.5h4.5a.747.747 0 0 0 .75-.75v-4.5a.75.75 0 0 0-1.5 0v2.69l-3.22-3.22a.75.75 0 1 0-1.06 1.06ZM3.5 4.56l3.22 3.22a.75.75 0 0 0 1.06-1.06L4.56 3.5h2.69a.75.75 0 0 0 0-1.5h-4.5a.75.75 0 0 0-.75.75v4.5a.75.75 0 0 0 1.5 0V4.56Z"/>
                    </svg>
                </div>
            </div>
            <div class="border-gray-200 dark:border-gray-700 p-1.5">
                <div class="action-ports flex flex-row justify-between">
                    <div class="input-ports">
                        <div class="input-port relative">
                            <div>input 1</div>
                            <div>input 1</div>
                            <div class="output-sign absolute top-0 -left-8">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                          d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"/>
                                </svg>
                            </div>
                        </div>
                        <div class="input-port relative">
                            <div>input 2</div>
                            <div>input 2</div>
                            <div class="output-sign absolute top-0 -left-8">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                          d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class="output-ports">
                        <div class="output-port relative">
                            <div>output 1</div>
                            <div>output 1</div>
                            <div class="output-sign absolute top-0 -right-8">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                          d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"/>
                                </svg>
                            </div>
                        </div>
                        <div class="output-port relative border">
                            <div>output 2</div>
                            <div>output 2</div>
                            <div class="output-sign absolute top-0 -right-8">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                          d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div>id:{{ props.item.id }}</div>
                <div>x:{{ props.item.x.toFixed(3) }}</div>
                <div>y:{{ props.item.y.toFixed(3) }}</div>
                <div>w:{{ props.item.w.toFixed(3) }}</div>
                <div>h:{{ props.item.h.toFixed(3) }}</div>
                <div>type:{{ props.item.type }}</div>
                <div class="mt-2 flex gap-2">
                    <button class="border p-1 rounded" @click="()=>store.moveCanvasItemToCenter(props.item.id)">Center</button>
                    <button class="border p-1 rounded bg-red-800" @click="()=>store.deleteCanvasItem(props.item.id)">Delete</button>
                </div>
            </div>
        </div>
    </div>
</template>