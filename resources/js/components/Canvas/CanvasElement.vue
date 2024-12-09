<script lang="ts" setup>
import {Element} from '@/js/interfaces'
import {useStore} from '@/js/stores/store';
import BaseElement from "@/js/components/Elements/BaseElement.vue";
import {ColorName, ElementTypeColor, PortType} from "@/js/stores/constants";
import Port from "@/js/components/Elements/Ports/Port.vue";

const store = useStore();

const props = defineProps<{ element: Element; }>();
</script>
<template>
    <BaseElement :element="props.element" :key="props.element.id">
        <template v-slot:inputActionPorts>
            <Port
                v-for="[key, port] in Object.entries(props.element.ports).filter( ([key, port]) => port.type === PortType.ActionInput )"
                :key="key"
                :port="port"
                :baseColor="ColorName[ElementTypeColor[props.element.type]]"/>
        </template>
        <template v-slot:outputActionPorts>
            <Port
                v-for="[key, port] in Object.entries(props.element.ports).filter( ([key, port]) => port.type === PortType.ActionOutput )"
                :key="key"
                :port="port"
                :baseColor="ColorName[ElementTypeColor[props.element.type]]"/>
        </template>
        <template v-slot:inputDataPorts>
            <Port
                v-for="[key, port] in Object.entries(props.element.ports).filter( ([key, port]) => port.type === PortType.DataInput )"
                :key="key"
                :port="port"
                :baseColor="ColorName[ElementTypeColor[props.element.type]]"/>
        </template>
        <template v-slot:outputDataPorts>
            <Port
                v-for="[key, port] in Object.entries(props.element.ports).filter( ([key, port]) => port.type === PortType.DataOutput )"
                :key="key"
                :port="port"
                :baseColor="ColorName[ElementTypeColor[props.element.type]]"/>
        </template>
        <div>Content</div>
    </BaseElement>
</template>
