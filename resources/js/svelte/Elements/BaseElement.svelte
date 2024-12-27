<script lang="ts">
    import {DebugColor} from "@/js/stores/DebugEnums";
    import DebugDot from "@/js/svelte/Debug/DebugDot.svelte";
    import {ButtonGroup} from "flowbite-svelte";
    import ElementHeader from "@/js/svelte/Elements/ElementHeader.svelte";
    import {onMount} from "svelte";
    import {elementsStore} from "@/js/svelte/Store/store";

    let elementRef;
    let {element} = $props();

    let observer;
    onMount(() => {
        if (elementRef) {
            observer = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    elementsStore.update(state => {
                        state[element.id] = {
                            ...state[element.id],
                            w: entry.contentRect.width,
                            h: entry.contentRect.height,
                        };
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

    const onDragHeader = (data) => {
        console.log('onDragHeader:', data);
    };

    // const centerElement = () => {
    //     store.update(state => ({
    //         ...state,
    //         elements: {
    //             ...state.elements,
    //             [$element.id]: {
    //                 ...state.elements[$element.id],
    //                 x: 0,
    //                 y: 0,
    //             },
    //         },
    //     }));
    // };
    //
    // const deleteElement = () => {
    //     store.update((state) => {
    //         const {[$element.id]: _, ...newElements} = state.elements;
    //         return {...state, elements: newElements};
    //     });
    // };

    // onMount(() => {
    //     console.log('BaseElements mounted:');
    //     return () => {
    //         console.log('BaseElements unmounted:');
    //     };
    // });
    // onDestroy(() => {
    //     console.log('BaseElements destroyed');
    // });
    // $effect.pre(() => {
    //     console.log('BaseElements component is about to update');
    //     tick().then(() => {
    //         console.log('BaseElements component just updated');
    //     });
    // });

    // $inspect(elementId);
    // $inspect(elementStore);
</script>

<div bind:this={elementRef} class="absolute box-border top-0 left-0 select-none">
    <DebugDot color={DebugColor.Green} size="1"/>
    <div
        class="border rounded-lg bg-white border-gray-200 dark:bg-gray-700 dark:border-gray-600 shadow shadow-lg">
        <ElementHeader element={element} title={element.type} onDragHeader={onDragHeader}/>
        <div class="p-2 flex flex-row justify-between gap-2 border-b border-gray-200 dark:border-gray-600">
            <div class="input-action-ports">
                <slot name="inputActionPorts"></slot>
            </div>
            <div class="output-action-ports">
                <slot name="outputActionPorts"></slot>
            </div>
        </div>
        <div class="p-2 flex flex-row justify-between gap-2 border-b border-gray-200 dark:border-gray-600">
            <div class="input-data-ports">
                <slot name="inputDataPorts"></slot>
            </div>
            <div class="output-data-ports">
                <slot name="outputDataPorts"></slot>
            </div>
        </div>
        <div class="border-gray-200 dark:border-gray-700 p-1.5">
            <div>x: { Math.round(element.x) }</div>
            <div>y: { Math.round(element.y) }</div>
            <div>w: { Math.round(element.w) }</div>
            <div>h: { Math.round(element.h) }</div>
            <slot></slot>
        </div>
        <div class="p-2 w-full flex justify-end">
            <ButtonGroup>
                <!--                <Button onclick={centerElement} size="xs"-->
                <!--                        class="focus:ring-0 focus:outline-none bg-gray-200 text-primary-700 dark:text-white dark:border-gray-500 dark:bg-gray-500">-->
                <!--                    Center-->
                <!--                </Button>-->
                <!--                <Button onclick={deleteElement} color="red" size="xs"-->
                <!--                        class="focus:ring-0 focus:outline-none">Delete-->
                <!--                </Button>-->
            </ButtonGroup>
        </div>
    </div>
</div>
