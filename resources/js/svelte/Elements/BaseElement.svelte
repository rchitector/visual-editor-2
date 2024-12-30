<script lang="ts">
    import {DebugColor} from "@/js/stores/DebugEnums";
    import DebugDot from "@/js/svelte/Debug/DebugDot.svelte";
    import {Button, ButtonGroup} from "flowbite-svelte";
    import ElementHeader from "@/js/svelte/Elements/ElementHeader.svelte";
    import {onMount} from "svelte";
    import {getElementStore, removeElement} from "@/js/stores/elementsStore";
    import Port from "@/js/svelte/Elements/Ports/Port.svelte";

    const {id} = $props();
    const elementStore = getElementStore(id);
    let elementRef;

    let observer;
    onMount(() => {
        if (elementRef) {
            observer = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    getElementStore(id).update((state) => {
                        state.w = entry.contentRect.width;
                        state.h = entry.contentRect.height;
                        return state;
                    });
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

    const centerElement = () => {
        getElementStore(id).update((state) => {
            state.x = 0;
            state.y = 0;
            return state;
        });
    };
</script>

<div bind:this={elementRef} class="absolute box-border top-0 left-0 select-none">
    <DebugDot color={DebugColor.Green} size="1"/>
    <div
        class="bg-opacity-90 dark:bg-opacity-90 border rounded-lg bg-white border-gray-200 dark:bg-gray-700 dark:border-gray-600 shadow shadow-lg">
        <ElementHeader element={$elementStore} title={$elementStore.type}/>
        <div class="p-2 flex flex-row justify-between gap-2 border-b border-gray-200 dark:border-gray-600">
            <div class="input-action-ports">
                {#each $elementStore.ports.action.inputs as portId}
                    <Port id={portId}/>
                {/each}
            </div>
            <div class="output-action-ports">
                {#each $elementStore.ports.action.outputs as portId}
                    <Port id={portId}/>
                {/each}
            </div>
        </div>
        <div class="p-2 flex flex-row justify-between gap-2 border-b border-gray-200 dark:border-gray-600">
            <div class="input-data-ports">
                {#each $elementStore.ports.data.inputs as portId}
                    <Port id={portId}/>
                {/each}
            </div>
            <div class="output-data-ports">
                {#each $elementStore.ports.data.outputs as portId}
                    <Port id={portId}/>
                {/each}
            </div>
        </div>
        <div class="border-gray-200 dark:border-gray-700 p-1.5">
            <div>x: { Math.round($elementStore.x) }</div>
            <div>y: { Math.round($elementStore.y) }</div>
            <div>w: { Math.round($elementStore.w) }</div>
            <div>h: { Math.round($elementStore.h) }</div>
            <slot></slot>
        </div>
        <div class="p-2 w-full flex justify-end">
            <ButtonGroup>
                <Button onclick={centerElement} size="xs"
                        class="focus:ring-0 focus:outline-none bg-gray-200 text-primary-700 dark:text-white dark:border-gray-500 dark:bg-gray-500"
                >Center
                </Button>
                <Button onclick={()=>removeElement($elementStore.id)} color="red" size="xs"
                        class="focus:ring-0 focus:outline-none"
                >Delete
                </Button>
            </ButtonGroup>
        </div>
    </div>
</div>
