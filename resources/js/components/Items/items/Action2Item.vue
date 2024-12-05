<script setup lang="ts">

import BaseItem from "@/js/components/Items/BaseItem.vue";
import {useStore} from "@/js/stores/store";
import {Item} from "@/js/interfaces";
import {PortType} from "@/js/stores/constants";
import Port from "@/js/components/Items/Port.vue";

const store = useStore();

const props = defineProps<{ item: Item; }>();
</script>

<template>
    <BaseItem :item="props.item" :key="props.item.id">
        <template v-slot:inputPorts>
            <Port :type="PortType.Input" title="Action 2 Start"/>
        </template>
        <template v-slot:outputPorts>
            <Port :type="PortType.Output" title="Action 2 Finish"/>
        </template>
    </BaseItem>
</template>
