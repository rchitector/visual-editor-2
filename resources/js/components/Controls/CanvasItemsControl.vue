<script setup lang="ts">
import {useStore} from "@/js/stores/store";
import {ItemTypes} from "@/js/stores/constants";
import {onMounted, onUnmounted} from 'vue';
import {DebugColor} from "@/js/components/Debug/DebugEnums";

const store = useStore();

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
        store.setCanvasItemTypeActive(null);
    }
}

const itemTypeColor = (itemType: ItemTypes) => {
    switch (itemType) {
        case ItemTypes.Start:
            return rgbToHex(DebugColor.Red);
        case ItemTypes.End:
            return rgbToHex(DebugColor.Green);
        case ItemTypes.Action1:
            return rgbToHex(DebugColor.Blue);
        case ItemTypes.Action2:
            return rgbToHex(DebugColor.Orange);
    }
    return '';
};

const rgbToHex = (rgbString: string) => {
    const rgbValues: RegExpMatchArray | null = rgbString.match(/\d+/g);
    const hex = rgbValues?.map(value => {
        const hexValue = parseInt(value).toString(16);
        return hexValue.padStart(2, '0');
    });
    if (hex) {
        return `#${hex.join('')}`;
    }
    return '';
}

</script>
<template>
    <div v-if="store.itemType"
         class="absolute left-0 top-0 w-0 h-0"
         :style="{
             color: itemTypeColor(store.itemType),
             transform: `matrix(${store.canvasPointMatrix.scale}, 0, 0, ${store.canvasPointMatrix.scale}, ${store.canvasPointMatrix.x}, ${store.canvasPointMatrix.y})`
         }"
    >
        <!--        <div class="pointer-events-none absolute rounded-lg border border-gray-200 dark:border-gray-700 p-2 bg-white dark:bg-gray-800 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">-->
        <!--            <div>{{ store.canvasPointMatrix.x }}:{{ store.canvasPointMatrix.y }}</div>-->
        <!--        </div>-->
        <div class="pointer-events-none absolute rounded-lg border border-gray-200 dark:border-gray-700 p-2 bg-white dark:bg-gray-800">
            <div>{{ store.canvasPointMatrix.x }}:{{ store.canvasPointMatrix.y }}</div>
        </div>
    </div>
    <div class="absolute left-5 top-5 rounded-lg border border-gray-200 dark:border-gray-700 p-2 bg-white dark:bg-gray-800">
        <div class="gap-1 flex items-center">
            <button @click="()=>store.setCanvasItemTypeActive(ItemTypes.Start)"
                    type="button"
                    :style="{ color: itemTypeColor(ItemTypes.Start) }"
                    class="p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 group">
                Start
            </button>
            <button @click="()=>store.setCanvasItemTypeActive(ItemTypes.End)"
                    type="button"
                    :style="{ color: itemTypeColor(ItemTypes.End) }"
                    class="p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 group">
                End
            </button>
            <button @click="()=>store.setCanvasItemTypeActive(ItemTypes.Action1)"
                    type="button"
                    :style="{ color: itemTypeColor(ItemTypes.Action1) }"
                    class="p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 group">
                Action 1
            </button>
            <button @click="()=>store.setCanvasItemTypeActive(ItemTypes.Action2)"
                    type="button"
                    :style="{ color: itemTypeColor(ItemTypes.Action2) }"
                    class="p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 group">
                Action 2
            </button>
        </div>
    </div>
</template>