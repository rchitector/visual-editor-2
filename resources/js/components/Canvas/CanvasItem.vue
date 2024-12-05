<script lang="ts" setup>
import {Item} from '@/js/interfaces'
import {useStore} from '@/js/stores/store';
import {ItemTypes} from "@/js/stores/constants";
import StartItem from "@/js/components/Items/items/StartItem.vue";
import FinishItem from "@/js/components/Items/items/FinishItem.vue";
import Action1Item from "@/js/components/Items/items/Action1Item.vue";
import Action2Item from "@/js/components/Items/items/Action2Item.vue";

const store = useStore();

const props = defineProps<{ item: Item; }>();


</script>
<template>

    <StartItem v-if="props.item.type == ItemTypes.Start" :item="props.item" :key="props.item.id"/>
    <FinishItem v-if="props.item.type == ItemTypes.Finish" :item="props.item" :key="props.item.id"/>
    <Action1Item v-if="props.item.type == ItemTypes.Action1" :item="props.item" :key="props.item.id"/>
    <Action2Item v-if="props.item.type == ItemTypes.Action2" :item="props.item" :key="props.item.id"/>
</template>
