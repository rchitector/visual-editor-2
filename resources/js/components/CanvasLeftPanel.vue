<script setup lang="ts">
import {useCanvasStore} from '../stores/canvasStore.js';

const canvasStore = useCanvasStore();
</script>

<template>
    <div class="flex flex-col gap-4 p-4">
        <div>zoomLevel: {{ canvasStore.zoomLevel.toFixed(3) }}</div>
    </div>
    <div class="flex flex-col gap-4 p-4">
        <div>canvasTranslateX: {{ canvasStore.canvasTranslateX.toFixed(3) }}</div>
        <div>canvasTranslateY: {{ canvasStore.canvasTranslateY.toFixed(3) }}</div>
    </div>
    <div class="flex flex-col gap-4 p-4">
        <div>scaleRelatedX: {{ canvasStore.scaleRelatedX.toFixed(3) }}</div>
        <div>scaleRelatedY: {{ canvasStore.scaleRelatedY.toFixed(3) }}</div>
    </div>
    <div class="flex flex-col gap-4 p-4">
        <div>rectCenterX: {{ canvasStore.rectCenterX.toFixed(3) }}</div>
        <div>rectCenterY: {{ canvasStore.rectCenterY.toFixed(3) }}</div>
    </div>
    <div class="flex flex-col gap-4 p-4">
        <div>clientX: {{ canvasStore.clientX.toFixed(3) }}</div>
        <div>clientY: {{ canvasStore.clientY.toFixed(3) }}</div>
    </div>
    <div class="flex flex-col gap-4 p-4">
        <div>clientZoomedX: {{ canvasStore.clientZoomedX.toFixed(3) }}</div>
        <div>clientZoomedY: {{ canvasStore.clientZoomedY.toFixed(3) }}</div>
    </div>
    <div class="flex flex-col gap-4 p-4">
        <div>nextZoomManualLevel: {{ canvasStore.nextZoomManualLevel }}</div>
    </div>
</template>