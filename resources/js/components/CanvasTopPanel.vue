<script setup>
    import { useCanvasStore } from '../stores/canvasStore';
    const canvasStore = useCanvasStore();
</script>

<template>
    <div class="flex gap-4">
        <button @click="canvasStore.initRandomElements"  type="button" class="px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Regenerate Elements</button>
    </div>
</template>