<script lang="ts" setup>
import {useStore} from "@/js/stores/store";
import {DraggingTypes, ItemTypes} from "@/js/stores/constants";
import {onMounted, onUnmounted, ref} from 'vue';
import {itemTypeColor} from "@/js/stores/helper";

const store = useStore();
const newItemLayerRef = ref(null);
const pointDownPosition = ref({x: null, y: null});

onMounted(() => {
    window.addEventListener('keydown', handleKeydown);
});
onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown);
});
const handleKeydown = (event: KeyboardEvent) => {
    // console.log(`key: ${event.key}, code: ${event.code}`);
    // console.log('ctrlKey:', event.ctrlKey);
    if (event.code == 'Escape') {
        store.itemType = null;
    }
}
const startListenMoving = () => {
    document.addEventListener('mousedown', onDocumentPointDown);
    document.addEventListener('touchstart', onDocumentPointDown);
    document.addEventListener('mousemove', onDocumentPointMove);
    document.addEventListener('touchmove', onDocumentPointMove);
    document.addEventListener('mouseup', onDocumentPointUp);
    document.addEventListener('touchend', onDocumentPointUp);
};
const stopListenMoving = () => {
    document.removeEventListener('mousedown', onDocumentPointDown);
    document.removeEventListener('touchstart', onDocumentPointDown);
    document.removeEventListener('mousemove', onDocumentPointMove);
    document.removeEventListener('touchmove', onDocumentPointMove);
    document.removeEventListener('mouseup', onDocumentPointUp);
    document.removeEventListener('touchend', onDocumentPointUp);
};
const onDocumentPointDown = (event: MouseEvent | TouchEvent) => {
    if (event.target?.closest('[data-type]')?.getAttribute('data-type') === DraggingTypes.Canvas) {
        const point = 'changedTouches' in event ? event.changedTouches[0] : event;
        pointDownPosition.value = {x: point.clientX, y: point.clientY};
    }
};
const onDocumentPointMove = (event: MouseEvent | TouchEvent) => {
    const point = 'changedTouches' in event ? event.changedTouches[0] : event;
    store.documentPoint = {x: point.clientX, y: point.clientY};
};
const onDocumentPointUp = (event: MouseEvent | TouchEvent) => {
    // if (event.button === 2) {
    //     return;
    // }
    const point = 'changedTouches' in event ? event.changedTouches[0] : event;
    if (Math.abs(pointDownPosition.value.x - point.clientX) < 5 && Math.abs(pointDownPosition.value.y - point.clientY) < 5) {
        // const mainBoxPoint = store.getMainBoxPoint(point.clientX, point.clientY);
        // console.log('mainBoxPoint:', mainBoxPoint);
        store.createItem(store.itemType, point.clientX, point.clientY);
        stopListenMoving();
        store.itemType = null;
    }
};
const setCanvasItemTypeActive = (itemType, event: MouseEvent | TouchEvent) => {
    startListenMoving();
    store.itemType = itemType;
    const point = 'changedTouches' in event ? event.changedTouches[0] : event;
    store.documentPoint = {x: point.clientX, y: point.clientY};
};
</script>
<template>
    <div v-if="store.itemType"
         :style="{
             color: itemTypeColor(store.itemType),
             transform: `matrix(${store.canvasPointMatrix.scale}, 0, 0, ${store.canvasPointMatrix.scale}, ${store.canvasPointMatrix.x}, ${store.canvasPointMatrix.y})`
         }"
         class="pointer-events-none absolute left-0 top-0 w-0 h-0"
    >
        <div
            class="pointer-events-none absolute rounded-lg border border-gray-200 dark:border-gray-700 p-2 bg-white dark:bg-gray-800">
            <div>{{ store.canvasPointMatrix.x }}:{{ store.canvasPointMatrix.y }}</div>
        </div>
    </div>
    <div
        class="absolute left-5 top-5 rounded-lg border border-gray-200 dark:border-gray-700 p-2 bg-white dark:bg-gray-800">
        <div class="gap-1 flex items-center">
            <button
                :style="{ color: itemTypeColor(ItemTypes.Start) }"
                class="p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 group"
                type="button"
                @click="setCanvasItemTypeActive(ItemTypes.Start, $event)">Start
            </button>
            <button
                :style="{ color: itemTypeColor(ItemTypes.Finish) }"
                class="p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 group"
                type="button"
                @click="setCanvasItemTypeActive(ItemTypes.Finish, $event)">End
            </button>
            <button
                :style="{ color: itemTypeColor(ItemTypes.Action1) }"
                class="p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 group"
                type="button"
                @click="setCanvasItemTypeActive(ItemTypes.Action1, $event)">Action 1
            </button>
            <button
                :style="{ color: itemTypeColor(ItemTypes.Action2) }"
                class="p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 group"
                type="button"
                @click="setCanvasItemTypeActive(ItemTypes.Action2, $event)">Action 2
            </button>
        </div>
    </div>
</template>
