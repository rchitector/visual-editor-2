<script lang="ts">
    import DebugDot from "@/js/svelte/Debug/DebugDot";
    import {DebugColor} from "@/js/components/Debug/DebugEnums";
    import BaseElement from "@/js/svelte/Elements/BaseElement.svelte";
    import Port from "@/js/svelte/Elements/Ports/Port.svelte";
    import {ColorName, ElementTypeColor, PortType} from "@/js/stores/constants";
    import {filterAndGroupPortsByType, portsStore} from "@/js/svelte/Store/store";

    let {element} = $props();
    let elementRef;

    const {
        actionOutputs,
        actionInputs,
        dataOutputs,
        dataInputs
    } = filterAndGroupPortsByType($portsStore, element.ports);

    // onMount(() => {
    //     let observer;
    //     if (elementRef) {
    //         observer = new ResizeObserver((entries) => {
    //             for (const entry of entries) {
    //                 console.log('entry.contentRect:', entry.contentRect);
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

<div class="absolute left-0 top-0 border rounded-lg"
     bind:this={elementRef}
     style:transform={`matrix(1,0,0,1,${element.x},${element.y})`}
>
    <DebugDot size="1" color={DebugColor.Green}/>
    <BaseElement element={element}>
        {#snippet inputActionPorts()}
            {#each Object.values(actionInputs).filter(port => port.type === PortType.ActionInput) as port}
                <Port port={port} baseColor={ColorName[ElementTypeColor[element.type]]}/>
            {/each}
        {/snippet}
        {#snippet outputActionPorts()}
            {#each Object.values(actionOutputs).filter(port => port.type === PortType.ActionOutput) as port}
                <Port port={port} baseColor={ColorName[ElementTypeColor[element.type]]}/>
            {/each}
        {/snippet}
        {#snippet inputDataPorts()}
            {#each Object.values(dataInputs).filter(port => port.type === PortType.DataInput) as port}
                <Port port={port} baseColor={ColorName[ElementTypeColor[element.type]]}/>
            {/each}
        {/snippet}
        {#snippet outputDataPorts()}
            {#each Object.values(dataOutputs).filter(port => port.type === PortType.DataOutput) as port}
                <Port port={port} baseColor={ColorName[ElementTypeColor[element.type]]}/>
            {/each}
        {/snippet}
        <div>Content</div>
    </BaseElement>
</div>
