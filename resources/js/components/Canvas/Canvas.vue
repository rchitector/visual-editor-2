<script lang="ts" setup>
import {onMounted, onUnmounted, ref} from 'vue';
import CanvasZoomControl from "@/js/components/Controls/CanvasZoomControl.vue";
import {v4 as uuidv4} from "uuid";
import CanvasBackground from "@/js/components/Canvas/CanvasBackground.vue";
import CanvasItems from "@/js/components/Canvas/CanvasItems.vue";
import DebugInfo from "@/js/components/Debug/DebugInfo.vue";
import {useStore} from "@/js/stores/store";


const store = useStore();

const globalBoxRef = ref<HTMLDivElement | null>(null);

const onUpdateWindowSize = () => {
    if (globalBoxRef.value) {
        const rect = globalBoxRef.value.getBoundingClientRect();
        store.updateCanvasBoxRect(rect);
    }
};

onMounted(() => {
    onUpdateWindowSize();
    window.addEventListener('resize', onUpdateWindowSize);
    document.addEventListener('mousemove', onPointMove);
    document.addEventListener('touchmove', onPointMove);
    document.addEventListener('mouseup', onPointUp);
    document.addEventListener('touchend', onPointUp);
    // store.initRandomElements();
    store.zoomFit();
});

onUnmounted(() => {
    window.removeEventListener('resize', onUpdateWindowSize);
    document.removeEventListener('mousemove', onPointMove);
    document.removeEventListener('touchmove', onPointMove);
    document.removeEventListener('mouseup', onPointUp);
    document.removeEventListener('touchend', onPointUp);
});


const onContextMenu = (event: MouseEvent) => {
    event.preventDefault();
};

const onPointDown = (event: MouseEvent | TouchEvent) => {
    if (event.target === globalBoxRef.value) {
        const point = 'touches' in event ? event.touches[0] : event;
        store.dragging.is = true;
        store.lastMouseX = point.clientX;
        store.lastMouseY = point.clientY;
        store.startPoint.x = point.clientX;
        store.startPoint.y = point.clientY;
    }
};

const onPointMove = (event: MouseEvent | TouchEvent) => {
    const point = 'touches' in event ? event.touches[0] : event;

    if (globalBoxRef.value) {
        store.clientX = point.clientX - globalBoxRef.value.getBoundingClientRect().left;
        store.clientY = point.clientY - globalBoxRef.value.getBoundingClientRect().top;
    }

    if (store.dragging.is) {
        if (store.lastMouseX !== null) {
            store.canvasTranslateX += (point.clientX - store.lastMouseX);
        }
        if (store.lastMouseY !== null) {
            store.canvasTranslateY += (point.clientY - store.lastMouseY);
        }
        store.lastMouseX = point.clientX;
        store.lastMouseY = point.clientY;
    }
    if (store.dragging.element !== null) {
        if (store.lastMouseX !== null) {
            store.dragging.element.x = (store.dragging.element.x + (point.clientX - store.lastMouseX) / (store.zoom.value / 100));
        }
        if (store.lastMouseY !== null) {
            store.dragging.element.y = (store.dragging.element.y + (point.clientY - store.lastMouseY) / (store.zoom.value / 100));
        }
        store.lastMouseX = point.clientX;
        store.lastMouseY = point.clientY;
    }
};

const onPointUp = (event: MouseEvent | TouchEvent) => {
    // store.renderAllItemsRect();
    if (globalBoxRef.value) {
        const point = 'touches' in event ? event.touches[0] : event;
        const rect = globalBoxRef.value.getBoundingClientRect();
        const relatedX = point.clientX - rect.left - store.canvasTranslateX;
        const relatedY = point.clientY - rect.top - store.canvasTranslateY;
        if ((store.startPoint.x === point.clientX && store.startPoint.y === point.clientY)) {
            store.items.push({
                id: uuidv4(),
                onTop: false,
                x: relatedX / (store.zoom.value / 100),
                y: relatedY / (store.zoom.value / 100),
                w: 0,
                h: 0,
                ports: {
                    in: [],
                    out: [],
                }
            });
        }
    }
    store.dragging.is = false;
    store.dragging.element = null;
    store.lastMouseX = null;
    store.lastMouseY = null;
    store.startPoint.x = null;
    store.startPoint.y = null;
};

const onWheel = (event: WheelEvent) => {
    event.preventDefault();
    if (globalBoxRef.value) {
        const rect = globalBoxRef.value.getBoundingClientRect();
        const scaleRelatedX = event.clientX - rect.left;
        const scaleRelatedY = event.clientY - rect.top;
        const vector = Math.sign(event.deltaY);
        if (vector > 0) {
            store.zoomOut(scaleRelatedX, scaleRelatedY);
        } else if (vector < 0) {
            store.zoomIn(scaleRelatedX, scaleRelatedY);
        }
    }
};
</script>
<template>
    <div ref="globalBoxRef"
         class="overflow-hidden relative w-full h-full bg-gray-50 dark:bg-gray-800"
         :style="store.canvasBoxStyle"
         @contextmenu="onContextMenu"
         @mousedown="onPointDown($event)"
         @touchstart="onPointDown($event)"
         @wheel="onWheel"
    >
        <CanvasBackground/>
        <CanvasItems/>
        <CanvasZoomControl/>
        <DebugInfo/>
    </div>
</template>