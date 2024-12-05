<script lang="ts" setup>
import {useStore} from "@/js/stores/store";
import {ZOOM_VISIBLE_LEVELS} from "@/js/stores/constants";
import {onMounted, onUnmounted} from "vue";

const store = useStore();
const baseClass = 'absolute gap-1 rounded-lg border border-red-300 dark:border-red-400 p-2 bg-white dark:bg-gray-800'

onMounted(() => {
    document.addEventListener('mousemove', onDocumentPointMove);
});

onUnmounted(() => {
    document.removeEventListener('mousemove', onDocumentPointMove);
});
const onDocumentPointMove = (event: MouseEvent | TouchEvent) => {
    const point = 'changedTouches' in event ? event.changedTouches[0] : event;
    store.documentPoint = {x: point.clientX, y: point.clientY};
};
</script>
<template>
    <div v-if="store.debug" :class="baseClass" class="left-5 bottom-5 flex flex-col">
        <div>itemType: {{ store.itemType }}</div>
        <hr>
        <div>documentPoint X: {{ store.documentPoint.x }}</div>
        <div>documentPoint Y: {{ store.documentPoint.y }}</div>
        <hr>
        <div>canvasMatrix X: {{ store.canvasMatrix.x }}</div>
        <div>canvasMatrix Y: {{ store.canvasMatrix.y }}</div>
        <div>canvasMatrix Scale: {{ store.canvasMatrix.scale }}</div>
        <hr>
        <div>canvasPointMatrix X: {{ store.canvasPointMatrix.x }}</div>
        <div>canvasPointMatrix Y: {{ store.canvasPointMatrix.y }}</div>
        <hr>
        <div>canvasPoint X: {{ store.canvasPoint.x }}</div>
        <div>canvasPoint Y: {{ store.canvasPoint.y }}</div>
        <hr>
        <div>mainBoxRect X: {{ store.mainBoxRect.x }}</div>
        <div>mainBoxRect Y: {{ store.mainBoxRect.y }}</div>
        <div>mainBoxRect W: {{ store.mainBoxRect.width }}</div>
        <div>mainBoxRect H: {{ store.mainBoxRect.height }}</div>
    </div>

    <div v-if="store.debug"
         :class="baseClass" class="top-1/2 transform -translate-y-1/2 right-5 flex flex-col">
        <button v-for="level in ZOOM_VISIBLE_LEVELS" :key="`${level}-temp`"
                class="flex items-center gap-2 p-2 text-gray-900 rounded-lg dark:text-white bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 group"
                type="button"
                @click="()=>store.setZoom(level)">
            <svg class="size-3" fill="none" stroke="currentColor" stroke-width="1.5"
                 viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                      stroke-linecap="round"
                      stroke-linejoin="round"/>
            </svg>
            <span>{{ level }}%</span>
        </button>
        <button
            class="flex items-center gap-2 p-2 text-gray-900 rounded-lg dark:text-white bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 group"
            type="button"
            @click="store.zoomFit">
            <svg class="size-5" fill="none" stroke="currentColor" stroke-width="1.5"
                 viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M7.5 3.75H6A2.25 2.25 0 0 0 3.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0 1 20.25 6v1.5m0 9V18A2.25 2.25 0 0 1 18 20.25h-1.5m-9 0H6A2.25 2.25 0 0 1 3.75 18v-1.5M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    stroke-linecap="round"
                    stroke-linejoin="round"/>
            </svg>
            <span>fit</span>
        </button>
    </div>
</template>
