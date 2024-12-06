<script setup lang="ts">
import {DebugColor} from "@/js/components/Debug/DebugEnums";
import DebugDot from "@/js/components/Debug/DebugDot.vue";
import {vElementSize} from '@vueuse/components'
import {useStore} from "@/js/stores/store";
import {Item} from "@/js/interfaces";
import {ref} from "vue";
import {DraggingTypes} from "@/js/stores/constants";
import ItemHeader from "@/js/components/Items/ItemHeader.vue";

const store = useStore();

const props = defineProps<{ item: Item; }>();

const item = ref(null);

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
            <ItemHeader :type="props.item.type" :title="props.item.type"/>
            <div
                class="p-2 action-ports flex flex-row justify-between gap-2 border-b border-gray-200 dark:border-gray-600">
                <div class="input-ports">
                    <slot name="inputPorts"></slot>
                </div>
                <div class="output-ports">
                    <slot name="outputPorts"></slot>
                </div>
            </div>
            <div class="border-gray-200 dark:border-gray-700 p-1.5">
                <slot></slot>
                <div>
                    <div>x:{{ props.item.x.toFixed(3) }}</div>
                    <div>y:{{ props.item.y.toFixed(3) }}</div>
                </div>
            </div>
        </div>
    </div>

</template>
