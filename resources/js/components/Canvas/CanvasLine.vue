<script lang="ts" setup>
import {Line} from "@/js/interfaces";
import {computed, onMounted, onUnmounted, ref} from "vue";
import {useStore} from "@/js/stores/store";

const props = defineProps<{ line: Line }>();

const store = useStore();

let startX = ref(props.line.startX);
let endX = ref(props.line.endX);
let startY = ref(props.line.startY);
let endY = ref(props.line.endY);

onMounted(() => {
    document.addEventListener('mousedown', mouseDownHandler);
});

onUnmounted(() => {
    document.removeEventListener('mousedown', mouseDownHandler);
});

const mouseDownHandler = (event: MouseEvent | TouchEvent) => {
    // const point = 'touches' in event ? event.touches[0] : event;
    // console.log('event:', point.clientX, point.clientY);
    // startX.value = (store.canvasPointMatrix.x - store.canvasMatrix.x) / store.canvasMatrix.scale;
    // startY.value = (store.canvasPointMatrix.y - store.canvasMatrix.y) / store.canvasMatrix.scale;
    // document.addEventListener('mousemove', mouseMoveHandler);
    // document.addEventListener('mouseup', mouseUpHandler);
};
const mouseUpHandler = (event: MouseEvent | TouchEvent) => {
    // document.removeEventListener('mousemove', mouseMoveHandler);
    // document.removeEventListener('mouseup', mouseUpHandler);
};
const mouseMoveHandler = (event: MouseEvent | TouchEvent) => {
    // endX.value = (store.canvasPointMatrix.x - store.canvasMatrix.x) / store.canvasMatrix.scale;
    // endY.value = (store.canvasPointMatrix.y - store.canvasMatrix.y) / store.canvasMatrix.scale;
}

const strokeWidth = 4;
const strokePadding = 2;
const padding = 10;
const width = computed(() => Math.abs(endX.value - startX.value));
const height = computed(() => Math.abs(endY.value - startY.value));

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
const lineStyle = computed(() => {
    return {
        transform: `matrix(1,0,0,1,${Math.min(startX.value, endX.value)},${Math.min(startY.value, endY.value)})`,
        marginTop: `-${strokePadding}px`,
        marginRight: `-${strokePadding}px`,
        marginBottom: `-${strokePadding}px`,
        marginLeft: `-${strokePadding}px`,
    };
});
</script>

<template>
    <div :data-id="props.line.id" class="line-box absolute left-0 top-0 pointer-events-all">
        <svg :height="padding*2"
             :style="{ transform: `matrix(1, 0, 0, 1, ${startX - padding}, ${startY - padding})` }"
             :viewBox="`0 0 ${padding*2} ${padding*2}`"
             :width="padding*2"
             class="line-start-point absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2"
             data-is-draggable="true" data-type="line-start-point"
             xmlns="http://www.w3.org/2000/svg"
        >
            <circle :cx="padding" :cy="padding" :r="padding" fill="#3b82f6"/>
        </svg>
        <svg :height="padding*2"
             :style="{ transform: `matrix(1, 0, 0, 1, ${endX - padding}, ${endY - padding})` }"
             :viewBox="`0 0 ${padding*2} ${padding*2}`"
             :width="padding*2"
             class="line-end-point absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2"
             data-is-draggable="true" data-type="line-end-point"
             xmlns="http://www.w3.org/2000/svg"
        >
            <circle :cx="padding" :cy="padding" :r="padding" fill="#3b82f6"/>
        </svg>
        <svg :height="height + strokePadding*2"
             :style="lineStyle"
             :viewBox="`-${strokePadding} -${strokePadding} ${width + strokePadding*2} ${height + strokePadding*2}`"
             :width="width + strokePadding*2"
             xmlns="http://www.w3.org/2000/svg"
        >
            <rect :height="height" :width="width" fill="#ef444433"/>
            <line :stroke-width="strokeWidth"
                  :x1="cx1"
                  :x2="cx2"
                  :y1="cy1"
                  :y2="cy2" stroke="white" stroke-linecap="round"/>
        </svg>
    </div>
</template>
