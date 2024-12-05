<script lang="ts" setup>
import {Item} from '@/js/interfaces'
import {useStore} from '@/js/stores/store';
import DebugDot from "@/js/components/Debug/DebugDot.vue";
import {DebugColor} from "@/js/components/Debug/DebugEnums";
import {vElementSize} from '@vueuse/components'
import {itemTypeColor} from "@/js/stores/helper";
import {DraggingTypes} from "@/js/stores/constants";

const store = useStore();

const props = defineProps<{ item: Item; }>();

const onResize = ({width, height}: { width: number, height: number }) => {
    store.setCanvasItemSize(props.item.id, width, height)
};

const onStartDragItem = (event: MouseEvent | TouchEvent): void => {
    event.stopPropagation();
    store.setCanvasItemOnTop(props.item.id);
    if (event.target.closest('[data-draggable]')) {
        document.addEventListener('mousemove', onDocumentPointMove);
        document.addEventListener('touchmove', onDocumentPointMove);
        document.addEventListener('mouseup', onDocumentPointUp);
        document.addEventListener('touchend', onDocumentPointUp);
        const point = 'touches' in event ? event.touches[0] : event;
        store.documentPoint = {x: point.clientX, y: point.clientY};
        store.clearDragging();
        store.dragging.type = DraggingTypes.Item;
        store.dragging.element = store.items.find(item => item.id === props.item.id) || null;
        store.dragging.cursorOffset = {
            x: store.canvasPoint.x * 1 - store.dragging.element.x,
            y: store.canvasPoint.y * 1 - store.dragging.element.y,
        };
    }
};

const onDocumentPointMove = (event: MouseEvent | TouchEvent) => {
    const point = 'changedTouches' in event ? event.changedTouches[0] : event;
    store.documentPoint = {x: point.clientX, y: point.clientY};
    store.dragging.element.x = store.canvasPoint.x * 1 - store.dragging.cursorOffset.x;
    store.dragging.element.y = store.canvasPoint.y * 1 - store.dragging.cursorOffset.y;
};
const onDocumentPointUp = (event: MouseEvent | TouchEvent) => {
    // const point = 'changedTouches' in event ? event.changedTouches[0] : event;
    document.removeEventListener('mousemove', onDocumentPointMove);
    document.removeEventListener('touchmove', onDocumentPointMove);
    document.removeEventListener('mouseup', onDocumentPointUp);
    document.removeEventListener('touchend', onDocumentPointUp);
};

</script>
<template>
    <div :key="props.item.id"
         v-element-size="onResize"
         :style="{ transform: `matrix(1, 0, 0, 1, ${props.item.x}, ${props.item.y})` }"
         class="absolute box-border top-0 left-0 select-none"
         @mousedown="onStartDragItem"
         @touchstart="onStartDragItem"
    >
        <DebugDot :color="DebugColor.Green" :size="1"/>
        <div
            class="p-0.5 border rounded-lg bg-white border-gray-200 dark:bg-gray-700 dark:border-gray-600 shadow shadow-lg">
            <div class="cursor-grab p-2 rounded-t-md bg-gray-200 dark:bg-gray-600 whitespace-nowrap flex items-center"
                 data-draggable>
                <div :style="{ color: itemTypeColor(props.item.type) }" class="grow">{{ props.item.type }}</div>
                <div>
                    <svg class="size-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="m13.28 7.78 3.22-3.22v2.69a.75.75 0 0 0 1.5 0v-4.5a.75.75 0 0 0-.75-.75h-4.5a.75.75 0 0 0 0 1.5h2.69l-3.22 3.22a.75.75 0 0 0 1.06 1.06ZM2 17.25v-4.5a.75.75 0 0 1 1.5 0v2.69l3.22-3.22a.75.75 0 0 1 1.06 1.06L4.56 16.5h2.69a.75.75 0 0 1 0 1.5h-4.5a.747.747 0 0 1-.75-.75ZM12.22 13.28l3.22 3.22h-2.69a.75.75 0 0 0 0 1.5h4.5a.747.747 0 0 0 .75-.75v-4.5a.75.75 0 0 0-1.5 0v2.69l-3.22-3.22a.75.75 0 1 0-1.06 1.06ZM3.5 4.56l3.22 3.22a.75.75 0 0 0 1.06-1.06L4.56 3.5h2.69a.75.75 0 0 0 0-1.5h-4.5a.75.75 0 0 0-.75.75v4.5a.75.75 0 0 0 1.5 0V4.56Z"/>
                    </svg>
                </div>
            </div>
            <div class="border-gray-200 dark:border-gray-700 p-1.5">
                <div class="action-ports flex flex-row justify-between">
                    <div class="input-ports">
                        <div class="input-port relative">
                            <div>input 1</div>
                            <div class="output-sign absolute top-0 -left-8">
                                <svg class="size-6" fill="none" stroke="currentColor"
                                     stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"/>
                                </svg>
                            </div>
                        </div>
                        <div class="input-port relative">
                            <div>input 2</div>
                            <div class="output-sign absolute top-0 -left-8">
                                <svg class="size-6" fill="none" stroke="currentColor"
                                     stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class="output-ports">
                        <div class="output-port relative">
                            <div>output 1</div>
                            <div class="output-sign absolute top-0 -right-8">
                                <svg class="size-6" fill="none" stroke="currentColor"
                                     stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"/>
                                </svg>
                            </div>
                        </div>
                        <div class="output-port relative border">
                            <div>output 2</div>
                            <div class="output-sign absolute top-0 -right-8">
                                <svg class="size-6" fill="none" stroke="currentColor"
                                     stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
                <!--                <div>id:{{ props.item.id }}</div>-->
                <!--                <div>x:{{ props.item.x.toFixed(3) }}</div>-->
                <!--                <div>y:{{ props.item.y.toFixed(3) }}</div>-->
                <!--                <div>w:{{ props.item.w.toFixed(3) }}</div>-->
                <!--                <div>h:{{ props.item.h.toFixed(3) }}</div>-->
                <!--                <div>type:{{ props.item.type }}</div>-->
                <!--                <div class="mt-2 flex gap-2">-->
                <!--                    <button class="border p-1 rounded" @click="()=>store.moveCanvasItemToCenter(props.item.id)">Center-->
                <!--                    </button>-->
                <!--                    <button class="border p-1 rounded bg-red-800" @click="()=>store.deleteCanvasItem(props.item.id)">-->
                <!--                        Delete-->
                <!--                    </button>-->
                <!--                </div>-->
            </div>
        </div>
    </div>
</template>
