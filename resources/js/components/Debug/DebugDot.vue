<script setup lang="ts">
import {DebugColor} from "@/js/components/Debug/DebugEnums";
import {useStore} from "@/js/stores/store";

interface Props {
    color?: string;
    size?: number;
    x?: number;
    y?: number;
}

const props = withDefaults(defineProps<Props>(), {
    color: DebugColor.Red,
    size: 2,
    x: 0,
    y: 0,
});

const store = useStore();
</script>
<template>
    <div v-if="store.debug"
         :style="{
            backgroundColor: props.color,
            transform: `matrix(1, 0, 0, 1, ${props.x}, ${props.y})`,
            width: Number(props.size)/4+'rem',
            height: Number(props.size)/4+'rem',
            marginLeft: '-'+Number(props.size)/8+'rem',
            marginTop: '-'+Number(props.size)/8+'rem',
         }"
         class="z-[99999] pointer-events-none absolute top-0 left-0 select-none rounded-full">
    </div>
</template>