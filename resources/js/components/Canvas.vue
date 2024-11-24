<script lang="ts" setup>
import {computed, onBeforeUnmount, onMounted, onUnmounted, ref} from 'vue';
import {useCanvasStore} from '../stores/canvasStore.js';
import CanvasItem from "@/js/components/CanvasItem.vue";
import CanvasZoomControl from "@/js/components/CanvasZoomControl.vue";

const canvasStore = useCanvasStore();

const canvasBoxRef = ref<HTMLDivElement | null>(null);

const onUpdateWindowSize = () => {
    if (canvasBoxRef.value) {
        const rect = canvasBoxRef.value.getBoundingClientRect();
        canvasStore.updateWindowSize(rect);
    }
};

onMounted(() => {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('touchmove', onMouseMove);

    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('touchend', onMouseUp);

    onUpdateWindowSize();
    window.addEventListener('resize', onUpdateWindowSize);

    canvasStore.initRandomElements();
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', onUpdateWindowSize);
});

onUnmounted(() => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('touchmove', onMouseMove);

    document.removeEventListener('mouseup', onMouseUp);
    document.removeEventListener('touchend', onMouseUp);
});

const canvasStyle = computed(() => {
    return { transform: `matrix(${canvasStore.zoomLevel / 100}, 0, 0, ${canvasStore.zoomLevel / 100}, ${canvasStore.canvasTranslateX + canvasStore.rectCenterX}, ${canvasStore.canvasTranslateY + canvasStore.rectCenterY})` };
});

const blueDotStyle = computed(() => {
    return { transform: `matrix(1, 0, 0, 1, ${canvasStore.scaleRelatedX}, ${canvasStore.scaleRelatedY})` }
});

const canvasBoxStyle = computed(() => {
    const scaledCellSize = canvasStore.baseCellSize * (canvasStore.zoomLevel / 100);
    const translateCellSizeX = canvasStore.canvasTranslateX % scaledCellSize;
    const translateCellSizeY = canvasStore.canvasTranslateY % scaledCellSize;
    return {
        backgroundSize: `${scaledCellSize}px ${scaledCellSize}px`,
        backgroundPosition: `${translateCellSizeX}px ${translateCellSizeY}px`,
    };
});

const onContextMenu = (event: MouseEvent) => {
    event.preventDefault();
};

const onMouseDown = (event: MouseEvent | TouchEvent) => {
    if (event.target === canvasBoxRef.value) {
        const point = 'touches' in event ? event.touches[0] : event;
        canvasStore.isDraggingCanvas = true;
        canvasStore.lastMouseX = point.clientX;
        canvasStore.lastMouseY = point.clientY;
    }
};

const onMouseMove = (event: MouseEvent | TouchEvent) => {
    const point = 'touches' in event ? event.touches[0] : event;
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

const onMouseUp = () => {
    canvasStore.isDraggingCanvas = false;
    canvasStore.draggingElement = null;
    canvasStore.lastMouseX = null;
    canvasStore.lastMouseY = null;
};

const onWheel = (event: WheelEvent) => {
    event.preventDefault();
    if (canvasBoxRef.value) {
        const rect = canvasBoxRef.value.getBoundingClientRect();
        canvasStore.zoom(Math.sign(event.deltaY), event.clientX - rect.left, event.clientY - rect.top);
    }
};
</script>
<template>
        <div id="canvas-box"
             ref="canvasBoxRef"
             :style="canvasBoxStyle"
             class="grow relative w-full h-full overflow-hidden bg-gray-50 dark:bg-gray-800 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:20px_20px]"
             @contextmenu="onContextMenu"
             @mousedown="onMouseDown($event)"
             @touchstart="onMouseDown($event)"
             @wheel="onWheel"
        >
            <div id="canvas" :style="canvasStyle" class="relative top-0 left-0 select-none inset-0 w-0 h-0">
                <CanvasItem v-for="item in canvasStore.items" :key="item.id" :data="item"/>
                <div v-if="canvasStore.debug"
                     class="z-[99997] absolute top-0 left-0 select-none opacity-50 rounded-full bg-red-500 dark:bg-red-500 w-2 h-2 -ml-1 -mt-1"></div>
            </div>
            <div v-if="canvasStore.debug" :style="blueDotStyle" class="z-[99998] absolute top-0 left-0 select-none rounded-full bg-blue-500 dark:bg-blue-500 w-2 h-2 -ml-1 -mt-1"></div>
            <CanvasZoomControl/>
        </div>
</template>