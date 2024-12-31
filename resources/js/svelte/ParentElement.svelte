<script lang="ts">
    import {onMount} from "svelte";
    import {derived} from "svelte/store";
    import {
        addElement,
        elementIds,
        elementsStore,
        getElementStore,
        removeElement
    } from "@/js/svelte/Store/temporaryStore";
    import ChildElement from "@/js/svelte/ChildElement.svelte";

    const defaultElements = {
        'element1': {
            id: 'element1',
            title: 'Element 1',
            x: 10,
            y: 10,
        },
        'element2': {
            id: 'element2',
            title: 'Element 2',
            x: 20,
            y: 20,
        },
        'element3': {
            id: 'element3',
            title: 'Element 3',
            x: 30,
            y: 30,
        },
    };

    onMount(() => {
        Object.entries(defaultElements).forEach(([key, value]) => {
            addElement(value);
        });
    });

    const elementKeys = $derived($elementIds);

    const changeElement = (elementId) => {
        getElementStore(elementId).update((state) => {
            state.title = elementId + ' changed';
            state.x = state.x + 10;
            state.y = state.y + 10;
            return state;
        });
    };

    $inspect(elementsStore.elements);
</script>

<div>
    <div class="flex gap-2 m-3">
        <button class="p-3 border rounded-lg" onclick={()=>changeElement('element1')}>Change element 1</button>
        <button class="p-3 border rounded-lg" onclick={()=>changeElement('element2')}>Change element 2</button>
        <button class="p-3 border rounded-lg" onclick={()=>changeElement('element3')}>Change element 3</button>
    </div>
    <div class="flex p-3">Parent Element</div>
    <div class="flex flex-col">
        {#each elementKeys as key (key)}
            {#if key}
                <ChildElement id={key} removeElement={removeElement}/>
            {/if}
        {/each}
    </div>
</div>
