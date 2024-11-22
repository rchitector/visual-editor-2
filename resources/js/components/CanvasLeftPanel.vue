<script setup lang="ts">
    import { useCanvasStore } from '../stores/canvasStore.js';
    const canvasStore = useCanvasStore();
</script>

<template>
    <div class="flex flex-col gap-4 p-4">
        <div>canvasTranslateX: {{ canvasStore.canvasTranslateX }}</div>
        <div>canvasTranslateY: {{ canvasStore.canvasTranslateY }}</div>
        <div>canvasScale: {{ canvasStore.canvasScale }}</div>
        <div>isDraggingCanvas: {{ canvasStore.isDraggingCanvas }}</div>
    </div>
</template>