<script setup lang="ts">
import {useCanvasStore} from "@/js/stores/canvasStore";
import {onMounted, onUnmounted, ref} from 'vue';
import Button from "@/js/components/ThemeComponents/Button.vue";
import {defineProps} from 'vue';
import {v4 as uuidv4} from "uuid";
import {getRandomIntInclusive} from "@/js/helper";

const canvasStore = useCanvasStore();

const pointerCursor = ref<HTMLDivElement | null>(null);
const pointerCursorLayer = ref<HTMLDivElement | null>(null);

const props = defineProps({
    canvasBoxRef: HTMLDivElement | null,
    canvasRef: HTMLDivElement | null,
});

let rect = null;

const handleKeydown = (event) => {
    console.log(`key: ${event.key}, code: ${event.code}`);
    console.log('ctrlKey:', event.ctrlKey);
    if (event.code == 'Escape') {
        handleClearNewItemActive();
    }
}

const handleClearNewItemActive = () => {
    console.log('handleClearNewItemActive:');
    if (pointerCursorLayer && pointerCursorLayer.value) {
        rect = null;
        pointerCursorLayer.value.removeEventListener('mousemove', handleMouseMove);
        pointerCursorLayer.value.removeEventListener('click', handleClick);
        pointerCursorLayer.value.removeEventListener('touchend', handleTouchEnd);
        canvasStore.setNewItemActive(null);
    }
}

const handleSetNewItemActive = (newItemId, event) => {
    console.log('newItemId, event:', newItemId, event);
    console.log('props.canvasBoxRef:', props.canvasBoxRef);
    if (pointerCursorLayer && pointerCursorLayer.value && props.canvasBoxRef) {
        rect = props.canvasBoxRef.getBoundingClientRect();
        pointerCursorLayer.value.addEventListener('mousemove', handleMouseMove);
        pointerCursorLayer.value.addEventListener('click', handleClick);
        pointerCursorLayer.value.addEventListener('touchend', handleTouchEnd);
        canvasStore.setNewItemActive(newItemId);
        movePointerCursorTo(event.clientX, event.clientY);
    }
}

const movePointerCursorTo = (x: number, y: number) => {
    if (pointerCursor && pointerCursor.value && rect) {
        console.log('rect.x:', rect.x);
        pointerCursor.value.style.transform = `matrix(1, 0, 0, 1, ${x - rect.x}, ${y - rect.y})`;
        pointerCursor.value.innerText = `${x - rect.x}, ${y - rect.y}`
    }
}

const handleMouseMove = (event) => {
    movePointerCursorTo(event.clientX, event.clientY);
}
const handleClick = (event) => {
    if (pointerCursor && pointerCursor.value && rect) {
        console.log('pointerCursor.value.style.transform:', pointerCursor.value.style.transform);
        addNewItem(0, 0);
    }
    handleClearNewItemActive();
}
const handleTouchEnd = (event) => {
    if (pointerCursor && pointerCursor.value && rect) {
        console.log('pointerCursor.value.style.transform:', pointerCursor.value.style.transform);
    }
    handleClearNewItemActive();
}

const addNewItem = (x: number, y: number) => {
    canvasStore.items.push({
        id: uuidv4(),
        onTop: true,
        x: x,
        y: y,
        w: 0,
        h: 0,
        ports: {
            in: [],
            out: [],
        }
    });
};

onMounted(() => {
    window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
    <div ref="pointerCursorLayer" class="absolute w-full h-full left-0 top-0" :class="rect?'':'hidden'">
        <div ref="pointerCursor" id="pointerCursor" class="pointer-events-none relative w-2 h-2 -ml-1 -mt-1 top-0 left-0 rounded-full bg-red-500"></div>
    </div>
    <div class="absolute gap-1 left-5 top-5 flex items-center rounded-lg border border-gray-200 dark:border-gray-700 p-2 bg-white dark:bg-gray-800">
        <Button :on-click="handleSetNewItemActive" :active="canvasStore.newItemActive==1" :value="1">Item 1</Button>
        <Button :on-click="handleSetNewItemActive" :active="canvasStore.newItemActive==2" :value="2">Item 2</Button>
    </div>
</template>