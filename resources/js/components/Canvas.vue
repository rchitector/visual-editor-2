<script lang="ts" setup>
import {computed, onBeforeUnmount, onMounted, onUnmounted, ref} from 'vue';
import {useCanvasStore} from '../stores/canvasStore.js';
import CanvasItem from "@/js/components/CanvasItem.vue";
import CanvasZoomControl from "@/js/components/CanvasZoomControl.vue";
import {DebugColor} from "@/js/components/Debug/DebugEnums";
import DebugDot from "@/js/components/Debug/DebugDot.vue";
import DebugRect from "@/js/components/Debug/DebugRect.vue";

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

    if (canvasBoxRef.value) {
        canvasStore.clientX = point.clientX - canvasBoxRef.value.getBoundingClientRect().left;
        canvasStore.clientY = point.clientY - canvasBoxRef.value.getBoundingClientRect().top;
        const coeff = 100*100/canvasStore.zoomLevel;
        // console.log('coeff:', coeff)
        canvasStore.clientZoomedX = canvasStore.clientX * coeff/100;
        canvasStore.clientZoomedY = canvasStore.clientY * coeff/100;
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

const onMouseUp = () => {
    canvasStore.isDraggingCanvas = false;
    canvasStore.draggingElement = null;
    canvasStore.lastMouseX = null;
    canvasStore.lastMouseY = null;
    canvasStore.renderAllItemsRect();
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
        <div id="canvas-box"
             ref="canvasBoxRef"
             :style="canvasBoxStyle"
             class="overflow-hidden relative w-full h-full bg-gray-50 dark:bg-gray-800 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:20px_20px]"
             @contextmenu="onContextMenu"
             @mousedown="onMouseDown($event)"
             @touchstart="onMouseDown($event)"
             @wheel="onWheel"
        >
            <div id="canvas"
                 :style="{ transform: `matrix(${canvasStore.zoomLevel / 100}, 0, 0, ${canvasStore.zoomLevel / 100}, ${canvasStore.canvasTranslateX}, ${canvasStore.canvasTranslateY})` }"
                 class="relative top-0 left-0 select-none inset-0 w-0 h-0">
                <CanvasItem v-for="item in canvasStore.items" :key="item.id" :item="item"/>
                <DebugRect :text="`Canvas matrix(${canvasStore.zoomLevel / 100}, 0, 0, ${canvasStore.zoomLevel / 100}, ${canvasStore.canvasTranslateX.toFixed(3)}, ${canvasStore.canvasTranslateY.toFixed(3)})`" />
                <DebugRect :color="DebugColor.Green"
                           :x="canvasStore.minX"
                           :y="canvasStore.minY"
                           :width="canvasStore.maxX - canvasStore.minX"
                           :height="canvasStore.maxY - canvasStore.minY"
                           text="Items" />
            </div>
            <DebugRect :color="DebugColor.Orange" :x="Number(canvasStore.rectCenterX)" :y="Number(canvasStore.rectCenterY)" text="Rect Center"/>
            <DebugDot :color="DebugColor.Blue" :x="Number(canvasStore.scaleRelatedX)" :y="Number(canvasStore.scaleRelatedY)" text="Scale Related"/>
            <CanvasZoomControl/>
        </div>
</template>