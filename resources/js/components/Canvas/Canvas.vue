<script lang="ts" setup>
import {onMounted, onUnmounted, ref} from 'vue';
import CanvasZoomControl from "@/js/components/Controls/CanvasZoomControl.vue";
import {v4 as uuidv4} from "uuid";
import CanvasBackground from "@/js/components/Canvas/CanvasBackground.vue";
import CanvasItems from "@/js/components/Canvas/CanvasItems.vue";
import DebugInfo from "@/js/components/Debug/DebugInfo.vue";
import {useCanvasStore} from "@/js/stores/canvasStore";


const canvasStore = useCanvasStore();

const canvasBoxRef = ref<HTMLDivElement | null>(null);

const onUpdateWindowSize = () => {
    if (canvasBoxRef.value) {
        const rect = canvasBoxRef.value.getBoundingClientRect();
        canvasStore.updateWindowSize(rect);
    }
};

onMounted(() => {
    onUpdateWindowSize();
    window.addEventListener('resize', onUpdateWindowSize);
    document.addEventListener('mousemove', onPointMove);
    document.addEventListener('touchmove', onPointMove);
    document.addEventListener('mouseup', onPointUp);
    document.addEventListener('touchend', onPointUp);
    // canvasStore.initRandomElements();
    canvasStore.zoomFit();
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
    if (event.target === canvasBoxRef.value) {
        const point = 'touches' in event ? event.touches[0] : event;
        canvasStore.isDraggingCanvas = true;
        canvasStore.lastMouseX = point.clientX;
        canvasStore.lastMouseY = point.clientY;
        canvasStore.startMouseX = point.clientX;
        canvasStore.startMouseY = point.clientY;
    }
};

const onPointMove = (event: MouseEvent | TouchEvent) => {
    const point = 'touches' in event ? event.touches[0] : event;

    if (canvasBoxRef.value) {
        canvasStore.clientX = point.clientX - canvasBoxRef.value.getBoundingClientRect().left;
        canvasStore.clientY = point.clientY - canvasBoxRef.value.getBoundingClientRect().top;
        const coeff = 100 * 100 / canvasStore.zoomLevel;
        // console.log('coeff:', coeff)
        canvasStore.clientZoomedX = canvasStore.clientX * coeff / 100;
        canvasStore.clientZoomedY = canvasStore.clientY * coeff / 100;
    }

    if (canvasStore.isDraggingCanvas) {
        if (canvasStore.lastMouseX !== null) {
            canvasStore.canvasTranslateX += (point.clientX - canvasStore.lastMouseX);
        }
        if (canvasStore.lastMouseY !== null) {
            canvasStore.canvasTranslateY += (point.clientY - canvasStore.lastMouseY);
        }
        canvasStore.lastMouseX = point.clientX;
        canvasStore.lastMouseY = point.clientY;
    }
    if (canvasStore.draggingElement !== null) {
        if (canvasStore.lastMouseX !== null) {
            canvasStore.draggingElement.x = (canvasStore.draggingElement.x + (point.clientX - canvasStore.lastMouseX) / (canvasStore.zoomLevel / 100));
        }
        if (canvasStore.lastMouseY !== null) {
            canvasStore.draggingElement.y = (canvasStore.draggingElement.y + (point.clientY - canvasStore.lastMouseY) / (canvasStore.zoomLevel / 100));
        }
        canvasStore.lastMouseX = point.clientX;
        canvasStore.lastMouseY = point.clientY;
    }
};

const onPointUp = (event: MouseEvent) => {
    // canvasStore.renderAllItemsRect();
    if (canvasBoxRef.value) {
        const point = 'touches' in event ? event.touches[0] : event;
        const rect = canvasBoxRef.value.getBoundingClientRect();
        const relatedX = point.clientX - rect.left - canvasStore.canvasTranslateX;
        const relatedY = point.clientY - rect.top - canvasStore.canvasTranslateY;
        if ((canvasStore.startMouseX === event.clientX && canvasStore.startMouseY === event.clientY)) {
            canvasStore.items.push({
                id: uuidv4(),
                onTop: false,
                x: relatedX / (canvasStore.zoomLevel / 100),
                y: relatedY / (canvasStore.zoomLevel / 100),
                w: 0,
                h: 0,
                ports: {
                    in: [],
                    out: [],
                }
            });
        }
    }
    canvasStore.isDraggingCanvas = false;
    canvasStore.draggingElement = null;
    canvasStore.lastMouseX = null;
    canvasStore.lastMouseY = null;
    canvasStore.startMouseX = null;
    canvasStore.startMouseY = null;
};

const onWheel = (event: WheelEvent) => {
    event.preventDefault();
    if (canvasBoxRef.value) {
        const rect = canvasBoxRef.value.getBoundingClientRect();
        const scaleRelatedX = event.clientX - rect.left;
        const scaleRelatedY = event.clientY - rect.top;
        const vector = Math.sign(event.deltaY);
        if (vector > 0) {
            canvasStore.zoomOut(scaleRelatedX, scaleRelatedY);
        } else if (vector < 0) {
            canvasStore.zoomIn(scaleRelatedX, scaleRelatedY);
        }
    }
};
</script>
<template>
    <!--  class="overflow-hidden relative w-full h-full bg-gray-50 dark:bg-gray-800 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:20px_20px]"  -->
    <div id="canvas-box"
         ref="canvasBoxRef"
         class="overflow-hidden relative w-full h-full bg-gray-50 dark:bg-gray-800"
         :style="canvasStore.canvasBoxStyle"
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