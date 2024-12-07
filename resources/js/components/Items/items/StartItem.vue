<script setup lang="ts">
import BaseItem from "@/js/components/Items/BaseItem.vue";
import {useStore} from "@/js/stores/store";
import {Item} from "@/js/interfaces";
import Port from "@/js/components/Items/Ports/Port.vue";
import {ColorName, PortType} from "@/js/stores/constants";

const store = useStore();

const props = defineProps<{ item: Item; }>();
</script>

<template>
    <BaseItem :item="props.item" :key="props.item.id">
        <template v-slot:outputActionPorts>
            <Port :type="PortType.ActionOutput" title="Start" :active="true" :disabled="false"
                  :baseColor="ColorName.green"/>
        </template>
    </BaseItem>
</template>
