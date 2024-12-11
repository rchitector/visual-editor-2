<script lang="ts">
    import DebugDot from "@/js/svelte/Debug/DebugDot.svelte";
    import {DebugColor} from "@/js/components/Debug/DebugEnums";
    import {onMount} from 'svelte';
    import BaseElement from "@/js/svelte/Elements/BaseElement.svelte";
    import Port from "@/js/svelte/Elements/Ports/Port.svelte";
    import {ColorName, ElementTypeColor, PortType} from "@/js/stores/constants";

    let {element} = $props();
    let elementRef;
    let observer;
    let size = $state({width: 0, height: 0});

    onMount(() => {
        if (elementRef) {
            observer = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    size = {
                        width: entry.contentRect.width,
                        height: entry.contentRect.height,
                    };
                }
            });
            observer.observe(elementRef);
        }
        return () => {
            if (observer) {
                observer.disconnect();
                observer = null;
            }
        };
    });
</script>

<div bind:this={elementRef}
     class="absolute left-0 top-0 border rounded-lg"
     style:transform={`matrix(1,0,0,1,${element.x},${element.y})`}
>
    <DebugDot size="1" color={DebugColor.Green}/>
    <BaseElement element={element}>
        {#snippet inputActionPorts()}
            {#each Object.values(element.ports).filter(port => port.type === PortType.ActionInput) as port}
                <Port port={port} baseColor={ColorName[ElementTypeColor[element.type]]}/>
            {/each}
        {/snippet}
        {#snippet outputActionPorts()}
            {#each Object.values(element.ports).filter(port => port.type === PortType.ActionOutput) as port}
                <Port port={port} baseColor={ColorName[ElementTypeColor[element.type]]}/>
            {/each}
        {/snippet}
        {#snippet inputDataPorts()}
            {#each Object.values(element.ports).filter(port => port.type === PortType.DataInput) as port}
                <Port port={port} baseColor={ColorName[ElementTypeColor[element.type]]}/>
            {/each}
        {/snippet}
        {#snippet outputDataPorts()}
            {#each Object.values(element.ports).filter(port => port.type === PortType.DataOutput) as port}
                <Port port={port} baseColor={ColorName[ElementTypeColor[element.type]]}/>
            {/each}
        {/snippet}
        <div>Content</div>
    </BaseElement>
</div>
