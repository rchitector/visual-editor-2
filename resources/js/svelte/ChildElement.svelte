<script lang="ts">
    import {getElementStore, removeElement} from "@/js/svelte/Store/temporaryStore";

    const {id} = $props();

    const elementStore = getElementStore(id);

    $inspect($elementStore).with((event, value) => {
        console.log('ChildElement $elementStore:', event, value);
    });
</script>

{#if $elementStore}
    <div class="p-3 m-3 border rounded-lg gap-4 flex">
        <div>ID: {id}</div>
        <div>element ID: {$elementStore.id}</div>
        <div>Title: {$elementStore.title}</div>
        <div>X: {$elementStore.x}</div>
        <div>Y: {$elementStore.y}</div>
        <button onclick={()=>removeElement($elementStore.id)}>Delete</button>
    </div>
{/if}
