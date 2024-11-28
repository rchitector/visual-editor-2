<script lang="ts" setup>
import {onMounted, onUnmounted, ref} from 'vue';
import CanvasZoomControl from "@/js/components/Controls/CanvasZoomControl.vue";
import CanvasBackground from "@/js/components/Canvas/CanvasBackground.vue";
import CanvasItems from "@/js/components/Canvas/CanvasItems.vue";
import DebugInfo from "@/js/components/Debug/DebugInfo.vue";
import {useStore} from "@/js/stores/store";

const store = useStore();

const globalBoxRef = ref<HTMLDivElement | null>(null);

const onUpdateWindowSize = () => {
    if (globalBoxRef.value) {
        const rect = globalBoxRef.value.getBoundingClientRect();
        store.updateCanvasBoxRect(rect);
    }
};

onMounted(() => {
    onUpdateWindowSize();
    window.addEventListener('resize', onUpdateWindowSize);
    document.addEventListener('mousemove', onPointMove);
    document.addEventListener('touchmove', onPointMove);
    document.addEventListener('mouseup', onPointUp);
    document.addEventListener('touchend', onPointUp);
    // store.initRandomElements();
    store.zoomFit();
});

onUnmounted(() => {
    window.removeEventListener('resize', onUpdateWindowSize);
    document.removeEventListener('mousemove', onPointMove);
    document.removeEventListener('touchmove', onPointMove);
    document.removeEventListener('mouseup', onPointUp);
    document.removeEventListener('touchend', onPointUp);
});


const onContextMenu = (event: MouseEvent) => {
    event.preventDefault();
};

const onPointDown = (event: MouseEvent | TouchEvent) => {
    const point = 'touches' in event ? event.touches[0] : event;
    store.onPointDown(point.clientX, point.clientY);
};

const onPointMove = (event: MouseEvent | TouchEvent) => {
    const point = 'touches' in event ? event.touches[0] : event;
    store.onPointMove(point.clientX, point.clientY);
};

const onPointUp = (event: MouseEvent | TouchEvent) => {
    const point = 'changedTouches' in event ? event.changedTouches[0] : event;
    // store.renderAllItemsRect();
    store.onPointUp(point.clientX, point.clientY);
};

const onWheel = (event: WheelEvent) => {
    event.preventDefault();
    if (globalBoxRef.value) {
        const point = 'touches' in event ? event.touches[0] : event;
        store.onWheel(point.deltaY, point.clientX, point.clientY);
    }
};
</script>
<template>
    <div ref="globalBoxRef"
         class="overflow-hidden relative w-full h-full bg-gray-50 dark:bg-gray-800"
         :style="store.canvasBoxStyle"
         @contextmenu="onContextMenu"
         @mousedown="onPointDown($event)"
         @touchstart="onPointDown($event)"
         @wheel="onWheel"
    >
        <CanvasBackground/>
        <CanvasItems/>
        <CanvasZoomControl/>
        <DebugInfo/>
    </div>
</template>