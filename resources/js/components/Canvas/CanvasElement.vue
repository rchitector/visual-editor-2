<script lang="ts" setup>
import {Element} from '@/js/interfaces'
import {useStore} from '@/js/stores/store';
import BaseElement from "@/js/components/Elements/BaseElement.vue";
import ActionPort from "@/js/components/Elements/Ports/ActionPort.vue";
import {ColorName, ItemTypeColor, PortType} from "@/js/stores/constants";
import DataPort from "@/js/components/Elements/Ports/DataPort.vue";

const store = useStore();

const props = defineProps<{ element: Element; }>();
</script>
<template>
    <BaseElement :element="props.element" :key="props.element.id">
        <template v-slot:inputActionPorts>
            <ActionPort
                v-for="[key, port] in Object.entries(props.element.ports).filter( ([key, port]) => port.type === PortType.ActionInput )"
                :key="key"
                :type="PortType.ActionInput"
                :title="port.title"
                :active="port.active ?? false"
                :disabled="port.disabled ?? true"
                :baseColor="ColorName[ItemTypeColor[props.element.type]]"/>
        </template>
        <template v-slot:outputActionPorts>
            <ActionPort
                v-for="[key, port] in Object.entries(props.element.ports).filter( ([key, port]) => port.type === PortType.ActionOutput )"
                :key="key"
                :type="PortType.ActionOutput"
                :title="port.title"
                :active="port.active ?? false"
                :disabled="port.disabled ?? true"
                :baseColor="ColorName[ItemTypeColor[props.element.type]]"/>
        </template>
        <template v-slot:inputDataPorts>
            <DataPort
                v-for="[key, port] in Object.entries(props.element.ports).filter( ([key, port]) => port.type === PortType.DataInput )"
                :key="key"
                :type="PortType.DataInput"
                :title="port.title"
                :active="port.active ?? false"
                :disabled="port.disabled ?? true"
                :baseColor="ColorName[ItemTypeColor[props.element.type]]"/>
        </template>
        <template v-slot:outputDataPorts>
            <DataPort
                v-for="[key, port] in Object.entries(props.element.ports).filter( ([key, port]) => port.type === PortType.DataOutput )"
                :key="key"
                :type="PortType.DataOutput"
                :title="port.title"
                :active="port.active ?? false"
                :disabled="port.disabled ?? true"
                :baseColor="ColorName[ItemTypeColor[props.element.type]]"/>
        </template>
        <div>Content</div>
    </BaseElement>
</template>
