<script lang="ts" setup>
import {onMounted, onUnmounted, ref} from 'vue';
import CanvasZoomControl from "@/js/components/Controls/CanvasZoomControl.vue";
import CanvasBackground from "@/js/components/Canvas/CanvasBackground.vue";
import CanvasItems from "@/js/components/Canvas/CanvasElements.vue";
import DebugInfo from "@/js/components/Debug/DebugInfo.vue";
import CanvasItemsControl from "@/js/components/Controls/CanvasItemsControl.vue";
import {useStore} from "@/js/stores/store";
import {DraggingTypes} from "@/js/stores/constants";

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

        // store.setZoom(50);
        // store.moveZeroTo(100, 100);
        // store.moveZeroToCenter();

        store.createStartElement(store.mainBoxRect.x + 200, store.mainBoxRect.y + 200);
        store.createStartElement(store.mainBoxRect.x + 700, store.mainBoxRect.y + 200);
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
    store.onMainBoxWheel(event.deltaY, event.clientX, event.clientY);
};

// const onMainBoxPointDown = (event: MouseEvent | TouchEvent) => {
//     if (event.target === mainBoxRef.value) {
//         document.addEventListener('mousemove', onDocumentPointMove);
//         document.addEventListener('mouseup', onDocumentPointUp);
//         document.addEventListener('touchmove', onDocumentPointMove);
//         document.addEventListener('touchend', onDocumentPointUp);
//
//         const point = 'changedTouches' in event ? event.changedTouches[0] : event;
//         store.clearDragging();
//         store.dragging.type = DraggingTypes.Canvas;
//         store.dragging.element = store.canvasMatrix;
//         store.dragging.startPoint = {
//             x: point.clientX - store.canvasMatrix.x,
//             y: point.clientY - store.canvasMatrix.y
//         };
//     }
// };
// const onDocumentPointMove = (event: MouseEvent | TouchEvent) => {
//     const point = 'changedTouches' in event ? event.changedTouches[0] : event;
//     store.dragging.element.x = point.clientX - store.dragging.startPoint.x;
//     store.dragging.element.y = point.clientY - store.dragging.startPoint.y;
// };
//
// const onDocumentPointUp = (event: MouseEvent | TouchEvent) => {
//     // const point = 'changedTouches' in event ? event.changedTouches[0] : event;
//     document.removeEventListener('mousemove', onDocumentPointMove);
//     document.removeEventListener('touchmove', onDocumentPointMove);
//     document.removeEventListener('mouseup', onDocumentPointUp);
//     document.removeEventListener('touchend', onDocumentPointUp);
//     store.clearDragging();
// };

const startDragging = (event) => {
    if (event.target === mainBoxRef.value) {
        const offsetX = event.clientX - store.canvasMatrix.x;
        const offsetY = event.clientY - store.canvasMatrix.y;
        const move = (e) => {
            store.canvasMatrix.x = e.clientX - offsetX;
            store.canvasMatrix.y = e.clientY - offsetY;
        }
        const stop = () => {
            window.removeEventListener('mousemove', move);
            window.removeEventListener('mouseup', stop);
        }
        window.addEventListener('mousemove', move);
        window.addEventListener('mouseup', stop);
    }
};
</script>
<template>
    <div id="main-box"
         ref="mainBoxRef"
         :data-type="DraggingTypes.Canvas"
         class="relative w-full h-full overflow-hidden border-0 box-border bg-gray-50 dark:bg-gray-800"
         @contextmenu="onMainBoxContextMenu"
         @mousedown="startDragging"
         @wheel="onMainBoxWheel"
    >
        <CanvasBackground/>
        <!--        <CanvasLines/>-->
        <CanvasItems/>
    </div>
    <CanvasItemsControl/>
    <CanvasZoomControl/>
    <DebugInfo v-if="store.debug"/>
</template>
