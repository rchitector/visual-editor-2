<script setup lang="ts">
import {DebugColor} from "@/js/components/Debug/DebugEnums";
import DebugDot from "@/js/components/Debug/DebugDot.vue";
import {useStore} from "@/js/stores/store";
import {Element} from "@/js/interfaces";
import ElementHeader from "@/js/components/Elements/ElementHeader.vue";
import {onMounted, onUnmounted, provide, ref} from 'vue';

const store = useStore();
const props = defineProps<{ element: Element; }>();
const elementRef = ref(null);
const resizeHandler = ref(null);
let resizeObserver;

const handleResize = () => {
    if (elementRef.value) {
        console.log('--- handleResize ---');
        const rect = elementRef.value.getBoundingClientRect();
        props.element.w = rect.width;
        props.element.h = rect.height;
    }

    resizeHandler.value && resizeHandler.value();
};

provide('resizeParentHandler', resizeHandler);

onMounted(() => {
    if (elementRef.value) {
        resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(elementRef.value);
    }
});

onUnmounted(() => {
    if (resizeObserver) {
        resizeObserver.disconnect();
    }
});

const onDrag = (data) => {
    resizeHandler.value && resizeHandler.value();
};
</script>

<template>
    <div :key="props.element.id"
         ref="elementRef"
         :style="{ transform: `matrix(1, 0, 0, 1, ${props.element.x}, ${props.element.y})` }"
         class="absolute box-border top-0 left-0 select-none"
         @mousedown="onStartDragItem"
         @touchstart="onStartDragItem"
    >
        <DebugDot :show="true" :color="DebugColor.Green" :size="1"/>
        <div
            class="p-0.5 border rounded-lg bg-white border-gray-200 dark:bg-gray-700 dark:border-gray-600 shadow shadow-lg">
            <ElementHeader :onDrag="onDrag" :element="props.element" :title="props.element.type"/>
            <div class="p-2 flex flex-row justify-between gap-2 border-b border-gray-200 dark:border-gray-600">
                <div class="input-action-ports">
                    <slot name="inputActionPorts"></slot>
                </div>
                <div class="output-action-ports">
                    <slot name="outputActionPorts"></slot>
                </div>
            </div>
            <div class="p-2 flex flex-row justify-between gap-2 border-b border-gray-200 dark:border-gray-600">
                <div class="input-data-ports">
                    <slot name="inputDataPorts"></slot>
                </div>
                <div class="output-data-ports">
                    <slot name="outputDataPorts"></slot>
                </div>
            </div>
            <div class="border-gray-200 dark:border-gray-700 p-1.5">
                <slot></slot>
                <div>x: {{ props.element.x.toFixed(2) }}</div>
                <div>y: {{ props.element.y.toFixed(2) }}</div>
                <div>w: {{ props.element.w.toFixed(2) }}</div>
                <div>h: {{ props.element.h.toFixed(2) }}</div>
            </div>
        </div>
    </div>

</template>
