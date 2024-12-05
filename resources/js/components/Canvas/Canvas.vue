<script lang="ts" setup>
import {onMounted, onUnmounted, ref} from 'vue';
import CanvasZoomControl from "@/js/components/Controls/CanvasZoomControl.vue";
import CanvasBackground from "@/js/components/Canvas/CanvasBackground.vue";
import CanvasItems from "@/js/components/Canvas/CanvasItems.vue";
import DebugInfo from "@/js/components/Debug/DebugInfo.vue";
import CanvasItemsControl from "@/js/components/Controls/CanvasItemsControl.vue";
import {useStore} from "@/js/stores/store";
import {DraggingTypes} from "@/js/stores/constants";

const store = useStore();

const mainBoxRef = ref<HTMLDivElement | null>(null);

onMounted(() => {
    onWindowSizeUpdate();
    window.addEventListener('resize', onWindowSizeUpdate);
    // store.zoomFit();
});

onUnmounted(() => {
    window.removeEventListener('resize', onWindowSizeUpdate);
});

const onWindowSizeUpdate = () => {
    if (mainBoxRef.value) {
        const rect = mainBoxRef.value.getBoundingClientRect();
        store.updateMainBoxRect(rect);
    }
};

const onMainBoxContextMenu = (event: MouseEvent) => {
    if (event.target === mainBoxRef.value) {
        event.preventDefault();
    }
};

const onMainBoxWheel = (event: WheelEvent) => {
    event.preventDefault();
    // if (event.target === mainBoxRef.value) {
    store.onMainBoxWheel(event.deltaY, event.clientX, event.clientY);
    // }
};

const onMainBoxPointDown = (event: MouseEvent | TouchEvent) => {
    if (event.target === mainBoxRef.value) {
        document.addEventListener('mousemove', onDocumentPointMove);
        document.addEventListener('mouseup', onDocumentPointUp);
        document.addEventListener('touchmove', onDocumentPointMove);
        document.addEventListener('touchend', onDocumentPointUp);

        const point = 'changedTouches' in event ? event.changedTouches[0] : event;
        store.clearDragging();
        store.dragging.type = DraggingTypes.Canvas;
        store.dragging.element = store.canvasMatrix;
        const mainBoxPoint = store.getMainBoxPoint(point.clientX, point.clientY);
        store.dragging.pointerShift = {
            x: mainBoxPoint.x - store.dragging.element.x,
            y: mainBoxPoint.y - store.dragging.element.y,
        };
    }
};
const onDocumentPointMove = (event: MouseEvent | TouchEvent) => {
    const point = 'changedTouches' in event ? event.changedTouches[0] : event;
    const mainBoxPoint = store.getMainBoxPoint(point.clientX, point.clientY);
    store.dragging.element.x = mainBoxPoint.x - store.dragging.pointerShift.x;
    store.dragging.element.y = mainBoxPoint.y - store.dragging.pointerShift.y;
};
const onDocumentPointUp = (event: MouseEvent | TouchEvent) => {
    // const point = 'changedTouches' in event ? event.changedTouches[0] : event;
    document.removeEventListener('mousemove', onDocumentPointMove);
    document.removeEventListener('touchmove', onDocumentPointMove);
    document.removeEventListener('mouseup', onDocumentPointUp);
    document.removeEventListener('touchend', onDocumentPointUp);
    store.clearDragging();
};
</script>
<template>
    <div id="main-box"
         ref="mainBoxRef"
         :data-type="DraggingTypes.Canvas"
         class="relative w-full h-full overflow-hidden border-0 box-border bg-gray-50 dark:bg-gray-800"
         @contextmenu="onMainBoxContextMenu"
         @mousedown="onMainBoxPointDown"
         @touchstart="onMainBoxPointDown"
         @wheel="onMainBoxWheel"
    >
        <CanvasBackground/>
        <!--        <CanvasLines/>-->
        <CanvasItems/>
    </div>
    <CanvasItemsControl/>
    <CanvasZoomControl/>
    <DebugInfo/>
</template>
