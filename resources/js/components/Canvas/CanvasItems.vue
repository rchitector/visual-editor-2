<script lang="ts" setup>
import CanvasItem from "@/js/components/Canvas/CanvasItem.vue";
import {useStore} from "@/js/stores/store";

const store = useStore();
</script>

<template>
    <div id="canvas"
         :style="store.canvasMatrixStyle"
         class="relative top-0 left-0 select-none inset-0 w-0 h-0">
        <div v-if="store.debug" class="w-2 h-2 rounded-full absolute left-0 top-0 bg-red-500 -ml-1 -mt-1"></div>
        <CanvasItem v-for="item in store.items" :key="item.id" :item="item"/>
    </div>
</template>
