<script setup lang="ts">
import CanvasLine from "@/js/components/Canvas/CanvasLine.vue";
import {onMounted} from "vue";
import {v4 as uuidv4} from "uuid";
import {useStore} from "@/js/stores/store";

const store = useStore();

onMounted(() => {
    console.log('store.lines.length:', store.lines.length);
    store.lines.push({
        id: uuidv4(),
        startId: uuidv4(),
        startX: 20,
        startY: 30,
        endId: uuidv4(),
        endX: 80,
        endY: 60,
    });
})
</script>

<template>
    <div id="canvas-lines"
         :style="{ transform: `matrix(${store.zoom.value / 100}, 0, 0, ${store.zoom.value / 100}, ${store.canvasTranslateX}, ${store.canvasTranslateY})` }"
         class="relative top-0 left-0 select-none inset-0 w-0 h-0">
        <CanvasLine v-for="line in store.lines" :key="line.id" :line="line"/>
    </div>
</template>