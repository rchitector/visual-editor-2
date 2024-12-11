<script lang="ts">
    import {DebugColor} from "@/js/components/Debug/DebugEnums";
    import DebugDot from "@/js/svelte/Debug/DebugDot.svelte";
    import ElementHeader from "@/js/svelte/Elements/ElementHeader.svelte";
    import {onMount} from "svelte";

    let {element, children, inputActionPorts, outputActionPorts, inputDataPorts, outputDataPorts} = $props();
    let elementRef;
    let observer;

    onMount(() => {
        if (elementRef) {
            observer = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    // console.log('entry.contentRect:', entry.contentRect);
                }
            });
            observer.observe(elementRef);
        }
        return () => {
            if (observer) {
                observer.unobserve(elementRef);
                observer.disconnect();
                observer = null;
            }
        };
    });

    const onDragHeader = (data) => {
        // console.log('onDragHeader:', element);
    };
</script>

<div bind:this={elementRef} class="absolute box-border top-0 left-0 select-none">
    <DebugDot color={DebugColor.Green} size="1"/>
    <div
        class="p-0.5 border rounded-lg bg-white border-gray-200 dark:bg-gray-700 dark:border-gray-600 shadow shadow-lg">
        <ElementHeader element={element} title={element.type} onDragHeader={onDragHeader}/>
        <div class="p-2 flex flex-row justify-between gap-2 border-b border-gray-200 dark:border-gray-600">
            <div class="input-action-ports">
                {@render inputActionPorts?.()}
            </div>
            <div class="output-action-ports">
                {@render outputActionPorts?.()}
            </div>
        </div>
        <div class="p-2 flex flex-row justify-between gap-2 border-b border-gray-200 dark:border-gray-600">
            <div class="input-data-ports">
                {@render inputDataPorts?.()}
            </div>
            <div class="output-data-ports">
                {@render outputDataPorts?.()}
            </div>
        </div>
        <div class="border-gray-200 dark:border-gray-700 p-1.5">
            {@render children?.()}
            <!--            <div>x: { element.x.toFixed(2) }</div>-->
            <!--            <div>y: { element.y.toFixed(2) }</div>-->
            <!--            <div>w: { element.w.toFixed(2) }</div>-->
            <!--            <div>h: { element.h.toFixed(2) }</div>-->
        </div>
    </div>
</div>
