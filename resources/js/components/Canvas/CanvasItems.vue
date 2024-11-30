<script setup lang="ts">
import CanvasItem from "@/js/components/Canvas/CanvasItem.vue";
import {useStore} from "@/js/stores/store";
import CanvasItemsControl from "@/js/components/Controls/CanvasItemsControl.vue";
import CanvasLine from "@/js/components/Canvas/CanvasLine.vue";

const store = useStore();
</script>

<template>
    <div id="canvas"
         :style="{ transform: `matrix(${store.zoom.value / 100}, 0, 0, ${store.zoom.value / 100}, ${store.canvasTranslateX}, ${store.canvasTranslateY})` }"
         class="relative top-0 left-0 select-none inset-0 w-0 h-0">
        <div v-if="store.debug" class="w-2 h-2 rounded-full absolute left-0 top-0 bg-red-500 -ml-1 -mt-1"></div>
        <CanvasItem v-for="item in store.items" :key="item.id" :item="item"/>
        <CanvasLine v-for="line in store.lines" :key="line.id" :line="line"/>
    </div>
    <CanvasItemsControl/>
</template>