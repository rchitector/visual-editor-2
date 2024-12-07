<script setup lang="ts">
import {DebugColor} from "@/js/components/Debug/DebugEnums";
import DebugDot from "@/js/components/Debug/DebugDot.vue";
import {vElementSize} from '@vueuse/components'
import {useStore} from "@/js/stores/store";
import {Element} from "@/js/interfaces";
import ElementHeader from "@/js/components/Elements/ElementHeader.vue";

const store = useStore();
const props = defineProps<{ element: Element; }>();
const onResize = ({width, height}: { width: number, height: number }) => {
    props.element.w = width;
    props.element.h = height;
};
</script>

<template>
    <div :key="props.element.id"
         v-element-size="onResize"
         :style="{ transform: `matrix(1, 0, 0, 1, ${props.element.x}, ${props.element.y})` }"
         class="absolute box-border top-0 left-0 select-none"
         @mousedown="onStartDragItem"
         @touchstart="onStartDragItem"
    >
        <DebugDot :show="true" :color="DebugColor.Green" :size="1"/>
        <div
            class="p-0.5 border rounded-lg bg-white border-gray-200 dark:bg-gray-700 dark:border-gray-600 shadow shadow-lg">
            <ElementHeader :element="props.element" :title="props.element.type"/>
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
                <div>x: {{ props.element.x }}</div>
                <div>y: {{ props.element.y }}</div>
            </div>
        </div>
    </div>

</template>
