<script lang="ts" setup>
import {onMounted, onUnmounted, ref} from 'vue';
import CanvasZoomControl from "@/js/components/Controls/CanvasZoomControl.vue";
import CanvasBackground from "@/js/components/Canvas/CanvasBackground.vue";
import CanvasItems from "@/js/components/Canvas/CanvasItems.vue";
import DebugInfo from "@/js/components/Debug/DebugInfo.vue";
import CanvasItemsControl from "@/js/components/Controls/CanvasItemsControl.vue";
import {useStore} from "@/js/stores/store";
import {DraggingTypes, ItemTypes} from "@/js/stores/constants";
import {v4 as uuidv4} from "uuid";

const store = useStore();
const mainBoxRef = ref<HTMLDivElement | null>(null);

const resizeObserver = new ResizeObserver((entries) => {
    for (let entry of entries) {
        store.updateMainBoxRect(mainBoxRef.value.getBoundingClientRect());
    }
});

onMounted(() => {
    if (mainBoxRef.value) {
        resizeObserver.observe(mainBoxRef.value);

        store.updateMainBoxRect(mainBoxRef.value.getBoundingClientRect());

        store.moveZeroTo(100, 100);
        // store.moveZeroToCenter();

        store.items.push({
            id: uuidv4(),
            x: 100,
            y: 100,
            w: 0,
            h: 0,
            onTop: true,
            type: ItemTypes.Start,
        });

        store.items.push({
            id: uuidv4(),
            x: 400,
            y: 100,
            w: 0,
            h: 0,
            onTop: true,
            type: ItemTypes.Action1,
        });

        store.items.push({
            id: uuidv4(),
            x: 700,
            y: 100,
            w: 0,
            h: 0,
            onTop: true,
            type: ItemTypes.End,
        });
    }
});

onUnmounted(() => {
    if (mainBoxRef.value) {
        resizeObserver.unobserve(mainBoxRef.value);
    }
});

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
        store.dragging.startPoint = {
            x: point.clientX - store.canvasMatrix.x,
            y: point.clientY - store.canvasMatrix.y
        };
    }
};
const onDocumentPointMove = (event: MouseEvent | TouchEvent) => {
    const point = 'changedTouches' in event ? event.changedTouches[0] : event;
    store.dragging.element.x = point.clientX - store.dragging.startPoint.x;
    store.dragging.element.y = point.clientY - store.dragging.startPoint.y;
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
