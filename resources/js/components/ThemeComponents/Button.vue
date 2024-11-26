<script setup lang="ts">
import {defineProps} from 'vue';

const props = defineProps({
    onClick: Function,
    active: Boolean,
    value: String | Number,
});
</script>

<template>
    <div>
        <button @click="(e)=>props.onClick(value, e)" type="button"
                class="flex items-center gap-2 p-2 rounded-lg group font-medium outline-none text-white dark:text-white"
                :class="
                    props.active
                    // ?'bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700'
                    ?'bg-gray-100 dark:bg-gray-700'
                    :'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                ">
            <slot></slot>
        </button>
    </div>
</template>