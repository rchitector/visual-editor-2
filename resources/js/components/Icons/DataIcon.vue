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
         viewBox="0 0 14 14"
         stroke-width="2"
         style="width:14px;height:14px;"
         :class="dynamicClass">
        <circle cx="7" cy="7" r="5.5"/>
    </svg>
</template>
