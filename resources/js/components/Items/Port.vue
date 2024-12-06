<script setup lang="ts">

import {ColorName, PortType} from "@/js/stores/constants";
import {onMounted, onUnmounted} from "vue";
import ActionIcon from "@/js/components/Items/Icons/ActionIcon.vue";

const props = defineProps<{
    title: string,
    type: PortType,
    active: boolean,
    disabled: boolean,
    baseColor: ColorName
}>();

onMounted(() => {
    document.addEventListener('mousedown', onDocumentPointDown);
    document.addEventListener('touchstart', onDocumentPointDown);
});

onUnmounted(() => {
    document.removeEventListener('mousedown', onDocumentPointDown);
    document.removeEventListener('touchstart', onDocumentPointDown);
    stopListenMoving();
});

const startListenMoving = () => {
    document.addEventListener('mousemove', onDocumentPointMove);
    document.addEventListener('touchmove', onDocumentPointMove);
    document.addEventListener('mouseup', onDocumentPointUp);
    document.addEventListener('touchend', onDocumentPointUp);
};
const stopListenMoving = () => {
    document.removeEventListener('mousemove', onDocumentPointMove);
    document.removeEventListener('touchmove', onDocumentPointMove);
    document.removeEventListener('mouseup', onDocumentPointUp);
    document.removeEventListener('touchend', onDocumentPointUp);
};
const onDocumentPointDown = (event: MouseEvent | TouchEvent) => {
    // 'data-dropable-action-port'
    console.log('event.target:', event.target);
    console.log('event.target.closest([data-draggable-action-port]):', event.target.closest('[data-draggable-action-port]'));
    if (event.target.closest('[data-draggable-action-port]')) {
        startListenMoving();
    }
};
const onDocumentPointMove = (event: MouseEvent | TouchEvent) => {
    const point = 'changedTouches' in event ? event.changedTouches[0] : event;
    console.log('point:', point);
    // store.dragging.element.x = point.clientX - store.dragging.startPoint.x;
    // store.dragging.element.y = point.clientY - store.dragging.startPoint.y;
};
const onDocumentPointUp = (event: MouseEvent | TouchEvent) => {
    stopListenMoving();
};
</script>

<template>
    <div class="relative port">
        <div>{{ props.title }}</div>
        <div v-if="props.type == PortType.Input" class="absolute top-1 -left-7 pointer-events-auto">
            <ActionIcon :active="props.active" :disabled="props.disabled" :baseColor="props.baseColor"/>
        </div>
        <div v-if="props.type == PortType.Output" class="absolute top-1 -right-7 pointer-events-auto">
            <ActionIcon :active="props.active" :disabled="props.disabled" :baseColor="props.baseColor"/>
        </div>
    </div>
</template>
