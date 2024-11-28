<script setup lang="ts">
import {useCanvasStore} from "@/js/stores/canvasStore";

const canvasStore = useCanvasStore();
</script>

<template>
    <svg class="absolute left-0 top-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <pattern id="grid-pattern" patternUnits="userSpaceOnUse"
                 :x="canvasStore.matrix.x"
                 :y="canvasStore.matrix.y"
                 :width="canvasStore.baseCellSize * canvasStore.matrix.scale"
                 :height="canvasStore.baseCellSize * canvasStore.matrix.scale">
            <line :opacity="Math.min(canvasStore.matrix.scale, 1)" class="stroke-gray-200 dark:stroke-gray-700" x1="0" y1="0" x2="100" y2="0"></line>
            <line :opacity="Math.min(canvasStore.matrix.scale, 1)" class="stroke-gray-200 dark:stroke-gray-700" x1="0" y1="0" x2="0" y2="100"></line>
        </pattern>
        <rect fill="url(#grid-pattern)" width="100%" height="100%"></rect>
    </svg>
</template>