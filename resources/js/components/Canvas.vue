<script setup lang="ts">
    import { computed, onMounted, onUnmounted, ref } from 'vue';
    import { useCanvasStore } from '../stores/canvasStore.js';
    import CanvasItem from "@/js/components/CanvasItem.vue";

    const canvasStore = useCanvasStore();

    const canvasBoxRef = ref<HTMLDivElement | null>(null);

    onMounted(() => {
        if (canvasBoxRef.value) {
            const rect = canvasBoxRef.value.getBoundingClientRect();
            canvasStore.canvasTranslateX = rect.width / 2;
            canvasStore.canvasTranslateY = rect.height / 2;
        }
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

        canvasStore.initRandomElements();
    });

    onUnmounted(() => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
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

    const onMouseDown = (event: MouseEvent) => {
        if (event.target === canvasBoxRef.value) {
            canvasStore.isDraggingCanvas = true;
            canvasStore.lastMouseX = event.clientX;
            canvasStore.lastMouseY = event.clientY;
        }
    };

    const onMouseMove = (event: MouseEvent) => {
        if (canvasStore.isDraggingCanvas) {
            if (canvasStore.lastMouseX !== null) {
                canvasStore.canvasTranslateX += (event.clientX - canvasStore.lastMouseX);
            }
            if (canvasStore.lastMouseY !== null) {
                canvasStore.canvasTranslateY += (event.clientY - canvasStore.lastMouseY);
            }
            canvasStore.lastMouseX = event.clientX;
            canvasStore.lastMouseY = event.clientY;
        }
        if (canvasStore.draggingElement !== null) {
            if (canvasStore.lastMouseX !== null) {
                canvasStore.draggingElement.x = (canvasStore.draggingElement.x + (event.clientX - canvasStore.lastMouseX) / canvasStore.canvasScale);
            }
            if (canvasStore.lastMouseY !== null) {
                canvasStore.draggingElement.y = (canvasStore.draggingElement.y + (event.clientY - canvasStore.lastMouseY) / canvasStore.canvasScale);
            }
            canvasStore.lastMouseX = event.clientX;
            canvasStore.lastMouseY = event.clientY;
        }
    };

    const onMouseUp = () => {
        canvasStore.isDraggingCanvas = false;
        canvasStore.draggingElement = null;
        canvasStore.lastMouseX = null;
        canvasStore.lastMouseY = null;
    };

    const onWheel = (event: WheelEvent) => {
        if (canvasBoxRef.value) {
            event.preventDefault();
            const rect = canvasBoxRef.value.getBoundingClientRect();
            const cursorX = event.clientX - rect.left;
            const cursorY = event.clientY - rect.top;
            const oldScale = canvasStore.canvasScale;
            let newScale = canvasStore.canvasScale + event.deltaY * canvasStore.scaleStep;
            canvasStore.canvasScale = Math.min(canvasStore.maxScale, Math.max(canvasStore.minScale, newScale));
            canvasStore.canvasTranslateX -= (cursorX - canvasStore.canvasTranslateX) * (canvasStore.canvasScale / oldScale - canvasStore.defaultScale);
            canvasStore.canvasTranslateY -= (cursorY - canvasStore.canvasTranslateY) * (canvasStore.canvasScale / oldScale - canvasStore.defaultScale);
        }
    };
</script>
<template>
    <div id="canvas-box"
         ref="canvasBoxRef"
         @wheel="onWheel"
         @contextmenu="onContextMenu"
         @mousedown="onMouseDown($event)"
         :style="canvasBoxStyle"
         class="border relative overflow-hidden box-border bg-gray-50 dark:bg-gray-800 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:20px_20px]"
    >
        <div id="canvas" :style="canvasStyle" class="absolute select-none inset-0 w-0 h-0">
            <CanvasItem
                :data="item"
                :key="item.id"
                v-for="item in canvasStore.items"
            />
        </div>
    </div>
</template>