<script setup lang="ts">
import {computed, inject, onMounted, ref} from "vue";
import {ColorName, PortType} from "@/js/stores/constants";
import {Port} from "@/js/interfaces";
import {useStore} from "@/js/stores/store";
import DebugDot from "@/js/components/Debug/DebugDot.vue";
import {DebugColor} from "@/js/components/Debug/DebugEnums";

const store = useStore();
const props = defineProps<{ port: Port, type: PortType, active: boolean, disabled: boolean, baseColor: ColorName }>();
const iconRef = ref(null);

const resizeParentHandler = inject('resizeParentHandler');

const updateBoundingBox = (message) => {
    // console.log('>>> message:', message);
    if (iconRef.value) {
        const rect = iconRef.value.getBoundingClientRect();
        props.port.connection = store.documentPointToRelatedToCanvasZeroPoint(rect.x, rect.y);
        // console.log('props.port.title:', props.port.title);
        // console.log('props.port.connection:', props.port.connection.x, props.port.connection.y);
        // store.updateMainBoxRect(iconRef.value.getBoundingClientRect());
    }
};

onMounted(() => {
    updateBoundingBox('onMounted');
    console.log('onMounted props.port.index:', props.port.index);
    resizeParentHandler.value = () => {
        console.log('resizeParentHandler props.port.index:', props.port.index);
        updateBoundingBox(`Ресайз произошел! Это дочерний компонент. ${props.port.index}`);
    };
});

const dynamicClass = computed(() => {
    let className = 'stroke-current';
    if (props.active) {
        if (props.disabled) {
            className += ` text-gray-400 hover:text-gray-400 dark:text-gray-600 dark:hover:text-gray-600`;
            className += ` fill-gray-400 hover:fill-gray-400 dark:fill-gray-600 dark:hover:fill-gray-600`;
        } else {
            className += ` text-${props.baseColor}-400 hover:text-${props.baseColor}-500 dark:text-${props.baseColor}-500 dark:hover:text-${props.baseColor}-700`;
            className += ` fill-${props.baseColor}-400 hover:fill-${props.baseColor}-500 dark:fill-${props.baseColor}-500 dark:hover:fill-${props.baseColor}-700`;
        }
    } else {
        if (props.disabled) {
            className += ` text-gray-400 hover:text-gray-400 dark:text-gray-600 dark:hover:text-gray-600`;
            className += ` fill-none`;
        } else {
            className += ` text-${props.baseColor}-400 hover:text-${props.baseColor}-500 dark:text-${props.baseColor}-500 dark:hover:text-${props.baseColor}-700`;
            className += ` fill-none`;
        }
    }
    return className;
});
</script>

<template>
    <div class="relative" :data-x="props.port.connection.x" :data-y="props.port.connection.y">
        <div ref="iconRef"
             class="absolute w-0 h-0 top-1/2"
             :class="{
                'left-0' : props.type === PortType.ActionInput || props.type === PortType.DataInput,
                'right-0' : props.type === PortType.ActionOutput || props.type === PortType.DataOutput,
             }"
        >
            <DebugDot :show="true" :color="DebugColor.Orange" :size="3"/>
        </div>
        <svg v-if="props.type === PortType.ActionInput || props.type === PortType.ActionOutput"
             xmlns="http://www.w3.org/2000/svg"
             viewBox="4 3.5 16 17"
             stroke-width="2"
             style="width: 13px;height: 14px;"
             :class="dynamicClass">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"/>
        </svg>
        <svg v-if="props.type === PortType.DataInput || props.type === PortType.DataOutput"
             xmlns="http://www.w3.org/2000/svg"
             viewBox="0 0 14 14"
             stroke-width="2"
             style="width:14px;height:14px;"
             :class="dynamicClass">
            <circle cx="7" cy="7" r="5.5"/>
        </svg>
    </div>
</template>
