<script lang="ts">
    import {PortType, TailwindColorHEX} from "@/js/stores/constants";
    import DebugDot from "@/js/svelte/Debug/DebugDot.svelte";

    export let port;
    export let baseColor;

    // const elementRect = getDerivedElementRectById(port.elementId);
    // const elementById = derived(store, $store => $store.elements[port.elementId]);

    // const unsubscribe = elementRect.subscribe(value => {
    //     console.log('Новое значение:', value);
    // });

    // console.log('-----port:', port.id);
    // console.log('-----port:', port.elementId);
    // console.log('-----port:', port.connection);
    let portIcon;
    // let elementById;
    // $: elementById = $store.elements[port.elementId];
    // $: if (elementById !== undefined) {
    //     if (portIcon) {
    //         console.log('Текущее значение elementById:', elementById);
    //         const rect = portIcon.getBoundingClientRect();
    //         console.log('rect:', rect);
    //         const connection = documentPointToRelatedToCanvasZeroPoint(rect.x, rect.y);
    //         console.log('connection:', connection);
    //         // store.update(currentState => {
    //         //     currentState.elements[elementById.id].ports[port.id] = {
    //         //         ...port,
    //         //         connection: {...connection},
    //         //     };
    //         //     return currentState;
    //         // });
    //
    //         // store.update(current => {
    //         //     current.level1.level2.level3 = 'changed';
    //         //     return current;
    //         // });
    //     }
    // }

    $: dynamicClass = (() => {
        let classes = 'stroke-current';
        if (port?.active) {
            if (port?.disabled) {
                classes += ` text-gray-400 hover:text-gray-400 dark:text-gray-600 dark:hover:text-gray-600`;
                classes += ` fill-gray-400 hover:fill-gray-400 dark:fill-gray-600 dark:hover:fill-gray-600`;
            } else {
                classes += ` text-${baseColor}-400 hover:text-${baseColor}-500 dark:text-${baseColor}-500 dark:hover:text-${baseColor}-700`;
                classes += ` fill-${baseColor}-400 hover:fill-${baseColor}-500 dark:fill-${baseColor}-500 dark:hover:fill-${baseColor}-700`;
                classes += ` cursor-pointer`;
            }
        } else {
            if (port?.disabled) {
                classes += ` text-gray-400 hover:text-gray-400 dark:text-gray-600 dark:hover:text-gray-600`;
                classes += ` fill-none`;
            } else {
                classes += ` text-${baseColor}-400 hover:text-${baseColor}-500 dark:text-${baseColor}-500 dark:hover:text-${baseColor}-700`;
                classes += ` fill-none`;
                classes += ` cursor-pointer`;
            }
        }
        return classes;
    })();

    // const rect = iconRef.value.getBoundingClientRect();
    // props.port.connection = store.documentPointToRelatedToCanvasZeroPoint(rect.x, rect.y);

</script>

<div class="relative">
    <div class="absolute w-0 h-0 top-1/2"
         bind:this={portIcon}
         class:left-0={port.type === PortType.ActionInput || port.type === PortType.DataInput}
         class:right-0={port.type === PortType.ActionOutput || port.type === PortType.DataOutput}
    >
        <DebugDot color={TailwindColorHEX.green["200"]} size="2"/>
        <!--<DebugDot color={TailwindColorHEX.green["800"]} size="1"/>-->
    </div>
    {#if port.type === PortType.ActionInput || port.type === PortType.ActionOutput}
        <svg xmlns="http://www.w3.org/2000/svg"
             viewBox="4 3.5 16 17"
             stroke-width="2"
             style="width: 13px;height: 14px;"
             class={dynamicClass}>
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"/>
        </svg>
    {/if}
    {#if port.type === PortType.DataInput || port.type === PortType.DataOutput}
        <svg xmlns="http://www.w3.org/2000/svg"
             viewBox="0 0 14 14"
             stroke-width="2"
             style="width:14px;height:14px;"
             class={dynamicClass}>
            <circle cx="7" cy="7" r="5.5"/>
        </svg>
    {/if}
</div>
