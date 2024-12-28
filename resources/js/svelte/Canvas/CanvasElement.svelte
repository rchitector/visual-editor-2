<script lang="ts">
    import DebugDot from "@/js/svelte/Debug/DebugDot";
    import {DebugColor} from "@/js/stores/DebugEnums";
    import BaseElement from "@/js/svelte/Elements/BaseElement.svelte";
    import {getElementStore} from "@/js/stores/elementsStore";
    import {getPortStore} from "@/js/stores/portsStore";
    import Port from "@/js/svelte/Elements/Ports/Port.svelte";

    const {id} = $props();

    const elementStore = getElementStore(id);

    $inspect($elementStore).with((event, value) => {
        console.log('CanvasElement', event, value?.id);
    });

    // let elementRef;
    // onMount(() => {
    //     let observer;
    //     if (elementRef) {
    //         observer = new ResizeObserver((entries) => {
    //             for (const entry of entries) {
    //                 console.log('CanvasElement contentRect:', entry.contentRect);
    //             }
    //         });
    //         observer.observe(elementRef);
    //     }
    //     return () => {
    //         if (observer) {
    //             observer.disconnect();
    //             observer = null;
    //         }
    //     };
    // });
</script>
<!--bind:this={elementRef}-->
{#if $elementStore}
    <div class="absolute left-0 top-0 border rounded-lg"
         style:transform={`matrix(1,0,0,1,${$elementStore.x},${$elementStore.y})`}
    >
        <DebugDot size="1" color={DebugColor.Green}/>
        <BaseElement id={id}>
            {#snippet inputActionPorts()}
                {#each $elementStore.ports.action.inputs as portId}
                    <Port port={getPortStore(portId)}/>
                {/each}
            {/snippet}
            {#snippet outputActionPorts()}
                {#each $elementStore.ports.action.outputs as portId}
                    <Port port={getPortStore(portId)}/>
                {/each}
            {/snippet}
            {#snippet inputDataPorts()}
                {#each $elementStore.ports.data.inputs as portId}
                    <Port port={getPortStore(portId)}/>
                {/each}
            {/snippet}
            {#snippet outputDataPorts()}
                {#each $elementStore.ports.data.outputs as portId}
                    <Port port={getPortStore(portId)}/>
                {/each}
            {/snippet}
            <div>Content</div>
        </BaseElement>
    </div>
{/if}
