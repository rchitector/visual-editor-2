<script setup lang="ts">

import BaseItem from "@/js/components/Items/BaseItem.vue";
import {useStore} from "@/js/stores/store";
import {Item} from "@/js/interfaces";
import {ColorName, PortType} from "@/js/stores/constants";
import Port from "@/js/components/Items/Ports/Port.vue";

const store = useStore();

const props = defineProps<{ item: Item; }>();
</script>

<template>
    <BaseItem :item="props.item" :key="props.item.id">
        <template v-slot:inputActionPorts>
            <Port :type="PortType.ActionInput" title="Action 2 Start" :active="false" :disabled="false"
                  :baseColor="ColorName.green"/>
        </template>
        <template v-slot:outputActionPorts>
            <Port :type="PortType.ActionOutput" title="Action 2 Finish" :active="false" :disabled="false"
                  :baseColor="ColorName.green"/>
        </template>
    </BaseItem>
</template>
