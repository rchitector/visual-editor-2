<script lang="ts" setup>
import {useStore} from "@/js/stores/store";
import {ColorName, ElementTypeColor, ItemTypes} from "@/js/stores/constants";
import {computed, onMounted, onUnmounted, ref} from 'vue';

const store = useStore();
const elementTypeRef = ref(null);
const relatedCoordinates = ref({x: 0, y: 0});

const elementType = computed(() => {
    return elementTypeRef.value
});
const pointCoordinates = computed(() => {
    return relatedCoordinates.value
});

onMounted(() => {
    window.addEventListener('keydown', handleKeydown);
});
onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown);
});

const handleKeydown = (event: KeyboardEvent) => {
    // console.log(`key: ${event.key}, code: ${event.code}`);
    // console.log('ctrlKey:', event.ctrlKey);
    if (event.code == 'Escape') {
        elementTypeRef.value = null;
    }
}

const onElementTypeClick = (event, type) => {
    const move = (e) => {
        relatedCoordinates.value = store.documentPointToRelatedToCanvasZeroPoint(e.clientX, e.clientY);
    }
    const stop = (e) => {
        relatedCoordinates.value = store.documentPointToRelatedToCanvasZeroPoint(e.clientX, e.clientY);
        store.createStartElementRelated(relatedCoordinates.value.x, relatedCoordinates.value.y);
        window.removeEventListener('mousemove', move)
        window.removeEventListener('mouseup', stop)
        elementTypeRef.value = null;
        relatedCoordinates.value = null;
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', stop)
    elementTypeRef.value = type;
    relatedCoordinates.value = store.documentPointToRelatedToCanvasZeroPoint(event.clientX, event.clientY);
};
</script>
<template>
    <div v-if="elementType"
         :style="{
             transform: `matrix(${store.canvasMatrix.scale}, 0, 0, ${store.canvasMatrix.scale}, ${pointCoordinates.x}, ${pointCoordinates.y})`
         }"
         :class="`text-${ElementTypeColor[elementType]}-500`"
         class="pointer-events-none absolute left-0 top-0 w-0 h-0">
        <div
            class="pointer-events-none absolute rounded-lg border border-gray-200 dark:border-gray-700 p-2 bg-white dark:bg-gray-800">
            <div>{{ pointCoordinates.x }}:{{ pointCoordinates.y }}</div>
        </div>
    </div>
    <div
        class="absolute left-5 top-5 rounded-lg border border-gray-200 dark:border-gray-700 p-2 bg-white dark:bg-gray-800">
        <div class="gap-1 flex items-center">
            <button
                :class="`text-${ColorName[ElementTypeColor.start]}-500`"
                class="p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 group"
                type="button"
                @click="onElementTypeClick($event, ItemTypes.Start)">Start
            </button>
            <button
                :class="`text-${ColorName[ElementTypeColor.action1]}-500`"
                class="p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 group"
                type="button"
                @click="onElementTypeClick($event, ItemTypes.Action1)">Action 1
            </button>
            <button
                :class="`text-${ColorName[ElementTypeColor.action2]}-500`"
                class="p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 group"
                type="button"
                @click="onElementTypeClick($event, ItemTypes.Action2)">Action 2
            </button>
            <button
                :class="`text-${ColorName[ElementTypeColor.finish]}-500`"
                class="p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 group"
                type="button"
                @click="onElementTypeClick($event, ItemTypes.Finish)">Finish
            </button>
        </div>
    </div>
</template>
