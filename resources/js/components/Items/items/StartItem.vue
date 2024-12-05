<script setup lang="ts">
import BaseItem from "@/js/components/Items/BaseItem.vue";
import {useStore} from "@/js/stores/store";
import {Item} from "@/js/interfaces";
import Port from "@/js/components/Items/Port.vue";
import {PortType} from "@/js/stores/constants";

const store = useStore();

const props = defineProps<{ item: Item; }>();
</script>

<template>
    <BaseItem :item="props.item" :key="props.item.id">
        <template v-slot:outputPorts>
            <Port :type="PortType.Output" title="Start"/>
        </template>
        <!--        <div class="mt-2 flex gap-2">-->
        <!--            <button class="border p-1 rounded" @click="()=>store.moveCanvasItemToCenter(props.item.id)">Center</button>-->
        <!--            <button class="border p-1 rounded bg-red-800" @click="()=>store.deleteCanvasItem(props.item.id)">Delete-->
        <!--            </button>-->
        <!--        </div>-->
    </BaseItem>
</template>
