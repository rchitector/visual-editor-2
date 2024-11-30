<script setup lang="ts">
import {Line} from "@/js/interfaces";
import {computed, onMounted, onUnmounted, ref} from "vue";
import {useStore} from "@/js/stores/store";

const props = defineProps<{ line: Line }>();
console.log('props.line:', props.line.startX, props.line.endX, props.line.startY, props.line.endY);

const store = useStore();

let startX = ref(props.line.startX);
let endX = ref(props.line.endX);
let startY = ref(props.line.startY);
let endY = ref(props.line.endY);

console.log('startX:startY, endX:endY:', startX.value + ':' + startY.value, endX.value + ':' + endY.value);

onMounted(() => {
    document.addEventListener('mousemove', mousemoveHandler);
});

onUnmounted(() => {
    document.removeEventListener('mousemove', mousemoveHandler);
});

const mousemoveHandler = (e) => {
    endX.value = (store.canvasPointMatrix.x - store.canvasMatrix.x) / store.canvasMatrix.scale;
    endY.value = (store.canvasPointMatrix.y - store.canvasMatrix.y) / store.canvasMatrix.scale;
}

const width = computed(() => Math.abs(endX.value - startX.value));
const height = computed(() => Math.abs(endY.value - startY.value));

const x1 = computed(() => {
    return Math.min(startX.value, endX.value);
});
const y1 = computed(() => {
    return Math.min(startY.value, endY.value);
});
const x2 = computed(() => {
    return Math.max(startX.value, endX.value);
});
const y2 = computed(() => {
    return Math.max(startY.value, endY.value);
});
const cx1 = computed(() => {
    if (startX.value > endX.value) {
        return Math.abs(endX.value - startX.value);
    }
    return 0;
});
const cy1 = computed(() => {

    if (startY.value > endY.value) {
        return Math.abs(endY.value - startY.value);
    }
    return 0;
});
const cx2 = computed(() => {
    if (startX.value > endX.value) {
        return 0;
    }
    return Math.abs(endX.value - startX.value);
});
const cy2 = computed(() => {
    if (startY.value > endY.value) {
        return 0;
    }
    return Math.abs(endY.value - startY.value)
});
const style = computed(() => {
    return {
        // transform: `matrix(${store.canvasMatrix.scale},0,0,${store.canvasMatrix.scale},${Math.min(startX.value, endX.value)},${Math.min(startY.value, endY.value)})`
        transform: `matrix(1,0,0,1,${Math.min(startX.value, endX.value)},${Math.min(startY.value, endY.value)})`
    };
});
</script>

<template>
    <div class="line absolute left-0 top-0 w-full h-full">
        <svg xmlns="http://www.w3.org/2000/svg"
             :width="width"
             :height="height"
             :style="style"
             class="absolute top-0 left-0 pointer-events-none"
        >
            <rect height="100%" width="100%" fill="#ef444433"/>
            <line :x1="cx1"
                  :y1="cy1"
                  :x2="cx2"
                  :y2="cy2"
                  stroke="white" stroke-width="2"/>
            <circle :cx="cx1" :cy="cy1" r="10" fill="#3b82f699"/>
            <circle :cx="cx2" :cy="cy2" r="10" fill="#22c55e99"/>
            <circle :cx="cx1" :cy="cy1" r="4" fill="#3b82f6"/>
            <circle :cx="cx2" :cy="cy2" r="4" fill="#22c55e"/>
        </svg>
    </div>
</template>