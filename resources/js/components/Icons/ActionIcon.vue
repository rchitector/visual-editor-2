<script setup lang="ts">
import {computed} from "vue";
import {ColorName} from "@/js/stores/constants";

const props = defineProps<{ active: boolean, disabled: boolean, baseColor: ColorName }>();

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
    <svg xmlns="http://www.w3.org/2000/svg"
         viewBox="4 3.5 16 17"
         stroke-width="2"
         style="width: 13px;height: 14px;"
         :class="dynamicClass">
        <path stroke-linecap="round" stroke-linejoin="round"
              d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"/>
    </svg>
</template>
