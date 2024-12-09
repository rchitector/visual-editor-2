<script setup lang="ts">
import {ColorName, PortType} from "@/js/stores/constants";
import PortIcon from "@/js/components/Icons/PortIcon.vue";
import {Port} from "@/js/interfaces";

const props = defineProps<{ port: Port, baseColor: ColorName }>();
</script>

<template>
    <div class="relative port whitespace-nowrap relative">
        <div>{{ props.port.title }}</div>
        <div
            :class="{
                '-left-7': props.port.type === PortType.ActionInput || props.port.type === PortType.DataInput,
                '-right-7': props.port.type === PortType.ActionOutput || props.port.type === PortType.DataOutput,
            }"
            class="absolute top-1 pointer-events-auto">
            <PortIcon
                :port="props.port"
                :type="props.port.type"
                :active="props.port.active"
                :disabled="props.port.disabled"
                :baseColor="props.baseColor"/>
        </div>
    </div>
</template>
