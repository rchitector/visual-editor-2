<script lang="ts">
    import DebugDot from "@/js/svelte/Debug/DebugDot";
    import {DebugColor} from "@/js/stores/DebugEnums";
    import BaseElement from "@/js/svelte/Elements/BaseElement.svelte";
    import {getElementStore} from "@/js/stores/elementsStore";
    import Port from "@/js/svelte/Elements/Ports/Port.svelte";
    import {getPortStore} from "@/js/stores/portsStore";
    import {documentPointToRelatedToCanvasZeroPoint} from "@/js/svelte/Store/store";

    const {id} = $props();

    const elementStore = getElementStore(id);
    let elementRef;

    // $inspect($elementStore).with((event, value) => {
    //     console.log('CanvasElement', event, value?.id);
    // });

    $effect(() => {
        // console.log('id:', id);
        for (const portId of $elementStore.ports.action.inputs) {
            getPortStore(portId).update((state) => {
                if (state.ref) {
                    const rect = state.ref.getBoundingClientRect();
                    state.connection = documentPointToRelatedToCanvasZeroPoint(rect.x, rect.y);
                }
                return state;
            });
        }
        for (const portId of $elementStore.ports.action.outputs) {
            getPortStore(portId).update((state) => {
                if (state.ref) {
                    const rect = state.ref.getBoundingClientRect();
                    state.connection = documentPointToRelatedToCanvasZeroPoint(rect.x, rect.y);
                }
                return state;
            });
        }
        for (const portId of $elementStore.ports.data.inputs) {
            getPortStore(portId).update((state) => {
                if (state.ref) {
                    const rect = state.ref.getBoundingClientRect();
                    state.connection = documentPointToRelatedToCanvasZeroPoint(rect.x, rect.y);
                }
                return state;
            });
        }
        for (const portId of $elementStore.ports.data.outputs) {
            getPortStore(portId).update((state) => {
                if (state.ref) {
                    const rect = state.ref.getBoundingClientRect();
                    state.connection = documentPointToRelatedToCanvasZeroPoint(rect.x, rect.y);
                }
                return state;
            });
        }
    });
</script>
{#if $elementStore}
    <div class="absolute left-0 top-0 border rounded-lg"
         bind:this={elementRef}
         style:transform={`matrix(1,0,0,1,${$elementStore.x},${$elementStore.y})`}
    >
        <DebugDot size="1" color={DebugColor.Green}/>
        <BaseElement id={id}>
            {#snippet inputActionPorts()}
                {#each $elementStore.ports.action.inputs as portId}
                    <Port id={portId}/>
                {/each}
            {/snippet}
            {#snippet outputActionPorts()}
                {#each $elementStore.ports.action.outputs as portId}
                    <Port id={portId}/>
                {/each}
            {/snippet}
            {#snippet inputDataPorts()}
                {#each $elementStore.ports.data.inputs as portId}
                    <Port id={portId}/>
                {/each}
            {/snippet}
            {#snippet outputDataPorts()}
                {#each $elementStore.ports.data.outputs as portId}
                    <Port id={portId}/>
                {/each}
            {/snippet}
            <div>Content</div>
        </BaseElement>
    </div>
{/if}
