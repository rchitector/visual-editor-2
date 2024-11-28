<script setup lang="ts">
import CanvasItem from "@/js/components/Canvas/CanvasItem.vue";
import {useCanvasStore} from "@/js/stores/canvasStore";

const canvasStore = useCanvasStore();
</script>

<template>
    <div id="canvas"
         :style="{ transform: `matrix(${canvasStore.zoomLevel / 100}, 0, 0, ${canvasStore.zoomLevel / 100}, ${canvasStore.canvasTranslateX}, ${canvasStore.canvasTranslateY})` }"
         class="relative top-0 left-0 select-none inset-0 w-0 h-0">
        <div v-if="canvasStore.debug" class="w-2 h-2 rounded-full absolute left-0 top-0 bg-red-500 -ml-1 -mt-1"></div>
        <CanvasItem v-for="item in canvasStore.items" :key="item.id" :item="item"/>
    </div>
</template>