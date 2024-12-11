<script lang="ts">
    import DebugDot from "@/js/svelte/Debug/DebugDot.svelte";
    import {DebugColor} from "@/js/components/Debug/DebugEnums";
    import {onMount} from 'svelte';

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
     style={`transform: matrix(1,0,0,1,${element.x},${element.y});`}
>
    <DebugDot size="1" color={DebugColor.Green}/>
    <div class="whitespace-nowrap">{element.id}</div>
    <div>{element.x}:{element.y}</div>
    <div>{Math.round(size.width)}:{Math.round(size.height)}</div>
</div>
