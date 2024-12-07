<script setup lang="ts">

import {ColorName, PortType} from "@/js/stores/constants";
import ActionIcon from "@/js/components/Items/Icons/ActionIcon.vue";

const props = defineProps<{
    title: string,
    type: PortType,
    active: boolean,
    disabled: boolean,
    baseColor: ColorName
}>();

const onInputPortPointDown = (event) => {
    const point = 'changedTouches' in event ? event.changedTouches[0] : event;
    console.log('Down point:', point);
    document.addEventListener('mousemove', onInputPortPointMove);
    document.addEventListener('touchmove', onInputPortPointMove);
    document.addEventListener('mouseup', onInputPortPointUp);
    document.addEventListener('touchend', onInputPortPointUp);
};
const onInputPortPointMove = (event: MouseEvent | TouchEvent) => {
    // const point = 'changedTouches' in event ? event.changedTouches[0] : event;
    // console.log('Move point:', point);
};
const onInputPortPointUp = (event: MouseEvent | TouchEvent) => {
    const point = 'changedTouches' in event ? event.changedTouches[0] : event;
    console.log('Up point:', point);
    document.removeEventListener('mousemove', onInputPortPointMove);
    document.removeEventListener('touchmove', onInputPortPointMove);
    document.removeEventListener('mouseup', onInputPortPointUp);
    document.removeEventListener('touchend', onInputPortPointUp);
};

const onOutputPortPointDown = (event) => {
    const point = 'changedTouches' in event ? event.changedTouches[0] : event;
    console.log('Down point:', point);
    document.addEventListener('mousemove', onOutputPortPointMove);
    document.addEventListener('touchmove', onOutputPortPointMove);
    document.addEventListener('mouseup', onOutputPortPointUp);
    document.addEventListener('touchend', onOutputPortPointUp);
};
const onOutputPortPointMove = (event: MouseEvent | TouchEvent) => {
    // const point = 'changedTouches' in event ? event.changedTouches[0] : event;
    // console.log('Move point:', point);
};
const onOutputPortPointUp = (event: MouseEvent | TouchEvent) => {
    const point = 'changedTouches' in event ? event.changedTouches[0] : event;
    console.log('Up point:', point);
    document.removeEventListener('mousemove', onOutputPortPointMove);
    document.removeEventListener('touchmove', onOutputPortPointMove);
    document.removeEventListener('mouseup', onOutputPortPointUp);
    document.removeEventListener('touchend', onOutputPortPointUp);
};
</script>

<template>
    <div class="relative port">
        <div>{{ props.title }}</div>
        <div v-if="props.type == PortType.Input"
             @mousedown="onInputPortPointDown"
             class="absolute top-1 -left-7 pointer-events-auto">
            <ActionIcon :active="props.active" :disabled="props.disabled" :baseColor="props.baseColor"/>
        </div>
        <div v-if="props.type == PortType.Output"
             @mousedown="onOutputPortPointDown"
             class="absolute top-1 -right-7 pointer-events-auto">
            <ActionIcon :active="props.active" :disabled="props.disabled" :baseColor="props.baseColor"/>
        </div>
    </div>
</template>
