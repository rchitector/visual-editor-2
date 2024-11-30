<script lang="ts" setup>
import {onMounted, onUnmounted, ref} from 'vue';
import CanvasZoomControl from "@/js/components/Controls/CanvasZoomControl.vue";
import CanvasBackground from "@/js/components/Canvas/CanvasBackground.vue";
import CanvasItems from "@/js/components/Canvas/CanvasItems.vue";
import DebugInfo from "@/js/components/Debug/DebugInfo.vue";
import {useStore} from "@/js/stores/store";

const store = useStore();

const mainBoxRef = ref<HTMLDivElement | null>(null);

onMounted(() => {
    onWindowSizeUpdate();
    window.addEventListener('resize', onWindowSizeUpdate);
    document.addEventListener('mousemove', onDocumentMouseMove);
    document.addEventListener('touchmove', onDocumentTouchMove);
    document.addEventListener('mouseup', onDocumentMouseUp);
    document.addEventListener('touchend', onDocumentTouchEnd);
    store.initRandomElements();
    store.zoomFit();
});

onUnmounted(() => {
    window.removeEventListener('resize', onWindowSizeUpdate);
    document.removeEventListener('mousemove', onDocumentMouseMove);
    document.removeEventListener('touchmove', onDocumentTouchMove);
    document.removeEventListener('mouseup', onDocumentMouseUp);
    document.removeEventListener('touchend', onDocumentTouchEnd);
});

const onWindowSizeUpdate = () => {
    if (mainBoxRef.value) {
        const rect = mainBoxRef.value.getBoundingClientRect();
        store.updateMainBoxRect(rect);
    }
};

const onMainBoxContextMenu = (event: MouseEvent) => {
    event.preventDefault();
};

const onMainBoxWheel = (event: WheelEvent) => {
    event.preventDefault();
    if (mainBoxRef.value) {
        store.onMainBoxWheel(event.deltaY, event.clientX, event.clientY);
    }
};

const onMainBoxMouseDown = (event: MouseEvent) => {
    if (event.target === mainBoxRef.value) { // trigger event ONLY for MainBox and NOT for children
        store.onMainBoxPointDown(event.clientX, event.clientY);
    }
};
const onMainBoxTouchStart = (event: TouchEvent) => {
    if (event.target === mainBoxRef.value) { // trigger event ONLY for MainBox and NOT for children
        const point = event.touches[0];
        store.onMainBoxPointDown(point.clientX, point.clientY);
    }
};

const onDocumentMouseMove = (event: MouseEvent) => {
    store.onDocumentPointMove(event.clientX, event.clientY);
};
const onDocumentTouchMove = (event: TouchEvent) => {
    const point = event.touches[0];
    store.onDocumentPointMove(point.clientX, point.clientY);
};

const onDocumentMouseUp = (event: MouseEvent) => {
    // store.renderAllItemsRect();
    store.onDocumentPointUp(event.clientX, event.clientY);
};
const onDocumentTouchEnd = (event: TouchEvent) => {
    // store.renderAllItemsRect();
    const point = event.changedTouches[0];
    store.onDocumentPointUp(point.clientX, point.clientY);
};
</script>
<template>
    <div ref="mainBoxRef"
         id="main-box"
         class="border-0 box-border overflow-hidden relative w-full h-full bg-gray-50 dark:bg-gray-800"
         @contextmenu="onMainBoxContextMenu"
         @mousedown="onMainBoxMouseDown($event)"
         @touchstart="onMainBoxTouchStart($event)"
         @wheel="onMainBoxWheel"
    >
        <CanvasBackground/>
        <CanvasItems/>
        <CanvasZoomControl/>
        <DebugInfo/>
    </div>
</template>