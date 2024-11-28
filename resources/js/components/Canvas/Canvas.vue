<script lang="ts" setup>
import {onMounted, onUnmounted, ref} from 'vue';
import CanvasZoomControl from "@/js/components/Controls/CanvasZoomControl.vue";
import {v4 as uuidv4} from "uuid";
import CanvasBackground from "@/js/components/Canvas/CanvasBackground.vue";
import CanvasItems from "@/js/components/Canvas/CanvasItems.vue";
import DebugInfo from "@/js/components/Debug/DebugInfo.vue";
import {useStore} from "@/js/stores/store";


const store = useStore();

const canvasBoxRef = ref<HTMLDivElement | null>(null);

const onUpdateWindowSize = () => {
    if (canvasBoxRef.value) {
        const rect = canvasBoxRef.value.getBoundingClientRect();
        store.updateWindowSize(rect);
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
    if (event.target === canvasBoxRef.value) {
        const point = 'touches' in event ? event.touches[0] : event;
        store.isDraggingCanvas = true;
        store.lastMouseX = point.clientX;
        store.lastMouseY = point.clientY;
        store.startMouseX = point.clientX;
        store.startMouseY = point.clientY;
    }
};

const onPointMove = (event: MouseEvent | TouchEvent) => {
    const point = 'touches' in event ? event.touches[0] : event;

    if (canvasBoxRef.value) {
        store.clientX = point.clientX - canvasBoxRef.value.getBoundingClientRect().left;
        store.clientY = point.clientY - canvasBoxRef.value.getBoundingClientRect().top;
        const coeff = 100 * 100 / store.zoomLevel;
        // console.log('coeff:', coeff)
        store.clientZoomedX = store.clientX * coeff / 100;
        store.clientZoomedY = store.clientY * coeff / 100;
    }

    if (store.isDraggingCanvas) {
        if (store.lastMouseX !== null) {
            store.canvasTranslateX += (point.clientX - store.lastMouseX);
        }
        if (store.lastMouseY !== null) {
            store.canvasTranslateY += (point.clientY - store.lastMouseY);
        }
        store.lastMouseX = point.clientX;
        store.lastMouseY = point.clientY;
    }
    if (store.draggingElement !== null) {
        if (store.lastMouseX !== null) {
            store.draggingElement.x = (store.draggingElement.x + (point.clientX - store.lastMouseX) / (store.zoomLevel / 100));
        }
        if (store.lastMouseY !== null) {
            store.draggingElement.y = (store.draggingElement.y + (point.clientY - store.lastMouseY) / (store.zoomLevel / 100));
        }
        store.lastMouseX = point.clientX;
        store.lastMouseY = point.clientY;
    }
};

const onPointUp = (event: MouseEvent | TouchEvent) => {
    // store.renderAllItemsRect();
    if (canvasBoxRef.value) {
        const point = 'touches' in event ? event.touches[0] : event;
        const rect = canvasBoxRef.value.getBoundingClientRect();
        const relatedX = point.clientX - rect.left - store.canvasTranslateX;
        const relatedY = point.clientY - rect.top - store.canvasTranslateY;
        if ((store.startMouseX === point.clientX && store.startMouseY === point.clientY)) {
            store.items.push({
                id: uuidv4(),
                onTop: false,
                x: relatedX / (store.zoomLevel / 100),
                y: relatedY / (store.zoomLevel / 100),
                w: 0,
                h: 0,
                ports: {
                    in: [],
                    out: [],
                }
            });
        }
    }
    store.isDraggingCanvas = false;
    store.draggingElement = null;
    store.lastMouseX = null;
    store.lastMouseY = null;
    store.startMouseX = null;
    store.startMouseY = null;
};

const onWheel = (event: WheelEvent) => {
    event.preventDefault();
    if (canvasBoxRef.value) {
        const rect = canvasBoxRef.value.getBoundingClientRect();
        const scaleRelatedX = event.clientX - rect.left;
        const scaleRelatedY = event.clientY - rect.top;
        const vector = Math.sign(event.deltaY);
        if (vector > 0) {
            store.zoomOut(scaleRelatedX, scaleRelatedY);
        } else if (vector < 0) {
            store.zoomIn(scaleRelatedX, scaleRelatedY);
        }
    }
};
</script>
<template>
    <!--  class="overflow-hidden relative w-full h-full bg-gray-50 dark:bg-gray-800 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:20px_20px]"  -->
    <div id="canvas-box"
         ref="canvasBoxRef"
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