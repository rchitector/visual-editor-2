<script lang="ts" setup>
import {useStore} from "@/js/stores/store";
import CanvasElement from "@/js/components/Canvas/CanvasElement.vue";
import {DebugColor} from "@/js/components/Debug/DebugEnums";
import DebugDot from "@/js/components/Debug/DebugDot.vue";

const store = useStore();
</script>

<template>
    <div id="canvas" :style="store.canvasMatrixStyle" class="relative top-0 left-0 select-none inset-0 w-0 h-0">
        <DebugDot :show="true" :color="DebugColor.Red" :size="2"/>
        <CanvasElement v-for="element in store.elements" :key="element.id" :element="element"/>
    </div>
</template>
