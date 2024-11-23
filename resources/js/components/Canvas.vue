<script setup lang="ts">
import {computed, onMounted, onUnmounted, ref} from 'vue';
import {useCanvasStore} from '../stores/canvasStore.js';
import CanvasItem from "@/js/components/CanvasItem.vue";
import CanvasZoomControl from "@/js/components/CanvasZoomControl.vue";

const canvasStore = useCanvasStore();

const canvasBoxRef = ref<HTMLDivElement | null>(null);

onMounted(() => {
    if (canvasBoxRef.value) {
        const rect = canvasBoxRef.value.getBoundingClientRect();
        canvasStore.canvasTranslateX = rect.width / 2;
        canvasStore.canvasTranslateY = rect.height / 2;
    }
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('touchmove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('touchend', onMouseUp);

    canvasStore.initRandomElements();
});

onUnmounted(() => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('touchmove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    document.removeEventListener('touchend', onMouseUp);
});

const canvasStyle = computed(() => {
    return {
        transform: `matrix(${canvasStore.canvasScale}, 0, 0, ${canvasStore.canvasScale}, ${canvasStore.canvasTranslateX}, ${canvasStore.canvasTranslateY})`,
    };
});

const canvasBoxStyle = computed(() => {
    const scaledCellSize = canvasStore.baseCellSize * canvasStore.canvasScale;
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
        const point = event.touches?.[0] || event;
        canvasStore.isDraggingCanvas = true;
        canvasStore.lastMouseX = point.clientX;
        canvasStore.lastMouseY = point.clientY;
    }
};

const onMouseMove = (event: MouseEvent | TouchEvent) => {
    const point = event.touches?.[0] || event;
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
            canvasStore.draggingElement.x = (canvasStore.draggingElement.x + (point.clientX - canvasStore.lastMouseX) / canvasStore.canvasScale);
        }
        if (canvasStore.lastMouseY !== null) {
            canvasStore.draggingElement.y = (canvasStore.draggingElement.y + (point.clientY - canvasStore.lastMouseY) / canvasStore.canvasScale);
        }
        canvasStore.lastMouseX = point.clientX;
        canvasStore.lastMouseY = point.clientY;
    }
};

const onMouseUp = (event: MouseEvent | TouchEvent) => {
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
    <div class="grow mt-[60px] relative">
        <div id="canvas-box"
             ref="canvasBoxRef"
             @wheel="onWheel"
             @contextmenu="onContextMenu"
             @mousedown="onMouseDown($event)"
             @touchstart="onMouseDown($event)"
             :style="canvasBoxStyle"

             class="w-full h-full relative overflow-hidden bg-gray-50 dark:bg-gray-800 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:20px_20px]"
        >
            <div id="canvas" :style="canvasStyle" class="absolute select-none inset-0 w-0 h-0">
                <CanvasItem :data="item" :key="item.id" v-for="item in canvasStore.items"/>
                <div
                        class="z-[999999] absolute select-none rounded-full bg-red-500 dark:bg-red-500 w-2 h-2 -ml-1 -mt-1"
                        :style="{ transform: `matrix(1, 0, 0, 1, ${canvasBoxRef?.value?.getBoundingClientRect().width / 2}, ${canvasBoxRef?.value?.getBoundingClientRect().height / 2})`, }"
                ></div>
            </div>
            <div
                    class="z-[999999] absolute select-none rounded-full bg-blue-500 dark:bg-blue-500 w-2 h-2 -ml-1 -mt-1"
                    :style="{ transform: `matrix(1, 0, 0, 1, ${canvasStore.scaleRelatedX}, ${canvasStore.scaleRelatedY})`, }"
            ></div>
            <div class="top-0 left-0 absolute w-full h-full z-[9999] shadow-inner-black"></div>
        </div>
        <CanvasZoomControl />
    </div>
</template>