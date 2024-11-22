<script setup>
    import { useCanvasStore } from '../stores/canvasStore';
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