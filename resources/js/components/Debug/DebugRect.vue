<script setup lang="ts">
import {DebugColor} from "@/js/components/Debug/DebugEnums";
import {useStore} from "@/js/stores/store";

const store = useStore();

interface Props {
    color?: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    size?: number;
    text?: string;
}

const props = withDefaults(defineProps<Props>(), {
    color: DebugColor.Red,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    size: 2,
    text: '',
});
</script>

<template>
    <div v-if="store.debug && props.width > 0 && props.height > 0 "
         class="z-[99999] pointer-events-none absolute select-none border-2"
         :style="{
             transform: `matrix(1, 0, 0, 1, ${props.x}, ${props.y}`, width: `${props.width}px`, height: `${props.height}px`,
             borderColor: props.color,
         }"
    >
        <div v-if="store.debug"
             class="opacity-50 box-border select-none inline-block relative top-0 left-0 text-white text-nowrap"
             :style="{ backgroundColor: props.color }"
        >{{ props.text }}: (x:{{ props.x.toFixed(2) }} y:{{ props.y.toFixed(2) }} width:{{ props.width.toFixed(2) }} height:{{ props.height.toFixed(2) }})
        </div>
    </div>
    <div v-if="store.debug"
         :style="{
            backgroundColor: props.color,
            transform: `matrix(1, 0, 0, 1, ${(props.x * 2 + props.width) / 2}, ${(props.y*2 + props.height) / 2})`,
            width: props.size/4+'rem',
            height: props.size/4+'rem',
            marginLeft: '-'+props.size/8+'rem',
            marginTop: '-'+props.size/8+'rem',
         }"
         class="z-[99999] pointer-events-none absolute select-none rounded-full">
        <div v-if="store.debug"
             class="opacity-50  box-border select-none inline-block relative text-white text-nowrap"
             :style="{ backgroundColor: props.color, top: `0.25rem`, left: `0.25rem` }"
        >{{ props.text }}: center (x:{{ ((props.x * 2 + props.width) / 2).toFixed(2) }} y:{{ ((props.y * 2 + props.height) / 2).toFixed(2) }})
        </div>
    </div>

</template>