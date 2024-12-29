<script lang="ts">
    import {PortType} from "@/js/stores/constants";
    import {getPortStore} from "@/js/stores/portsStore";
    import {onMount} from "svelte";
    import {documentPointToRelatedToCanvasZeroPoint, newLineStartPort} from "@/js/svelte/Store/store";
    import {addLine} from "@/js/stores/linesStore";
    import {v4 as uuidv4} from "uuid";

    const {id, baseColor} = $props();
    const port = getPortStore(id);

    const dynamicClass = $derived.by(() => {
        let classes = 'stroke-current pointer-events-auto';
        if ($port?.active) {
            if ($port?.disabled) {
                classes += ` text-gray-400 hover:text-gray-400 dark:text-gray-600 dark:hover:text-gray-600`;
                classes += ` fill-gray-400 hover:fill-gray-400 dark:fill-gray-600 dark:hover:fill-gray-600`;
            } else {
                classes += ` text-${baseColor}-400 hover:text-${baseColor}-500 dark:text-${baseColor}-500 dark:hover:text-${baseColor}-700`;
                classes += ` fill-${baseColor}-400 hover:fill-${baseColor}-500 dark:fill-${baseColor}-500 dark:hover:fill-${baseColor}-700`;
                classes += ` cursor-pointer`;
            }
        } else {
            if ($port?.disabled) {
                classes += ` text-gray-400 hover:text-gray-400 dark:text-gray-600 dark:hover:text-gray-600`;
                classes += ` fill-transparent`;
            } else {
                classes += ` text-${baseColor}-400 hover:text-${baseColor}-500 dark:text-${baseColor}-500 dark:hover:text-${baseColor}-700`;
                classes += ` fill-transparent`;
                classes += ` cursor-pointer`;
            }
        }
        return classes;
    });

    let portIconRef;
    onMount(() => {
        getPortStore(id).update((state) => {
            state.ref = portIconRef;
            const rect = state.ref.getBoundingClientRect();
            state.connection = documentPointToRelatedToCanvasZeroPoint(rect.x, rect.y);
            return state;
        });
    });
    const startConnection = (event) => {
        if ($port.type === PortType.ActionOutput || $port.type === PortType.DataOutput) {
            newLineStartPort.update(state => {
                return {
                    ...state,
                    id: $port.id,
                    end: documentPointToRelatedToCanvasZeroPoint(event.clientX, event.clientY)
                };
            });
            const startDragPoint = {x: null, y: null};
            const cancel = () => {
                window.removeEventListener('mousedown', down)
                window.removeEventListener('mousemove', move)
                window.removeEventListener('mouseup', up)
                document.removeEventListener('keydown', onKeyDown)
                newLineStartPort.update(state => {
                    return {id: null, end: {x: null, y: null,}};
                });
            };
            const down = (e) => {
                startDragPoint.x = e.clientX;
                startDragPoint.y = e.clientY;
            }
            const move = (e) => {
                newLineStartPort.update(state => {
                    return {...state, end: documentPointToRelatedToCanvasZeroPoint(e.clientX, e.clientY)};
                });
            }
            const up = (e) => {
                if (Math.abs(startDragPoint.x - e.clientX) < 5 && Math.abs(startDragPoint.y - e.clientY) < 5) {
                    if (e.target.hasAttribute('data-port-id')) {
                        if (e.target.getAttribute('data-port-input') === 'true' && e.target.getAttribute('data-port-disabled') === 'false') {
                            // && e.target.getAttribute('data-port-active') === 'false'
                            if ($port.type === PortType.ActionOutput && e.target.getAttribute('data-port-action') === 'true') {
                                const targetPortId = e.target.getAttribute('data-port-id');
                                console.log('ACTION INPUT targetPortId:', targetPortId);
                                getPortStore(targetPortId).subscribe((targetPortData) => {
                                    console.log('targetPort:', targetPortData);
                                    addLine({
                                        id: uuidv4(),
                                        start: {elementId: $port.elementId, portId: $port.id},
                                        end: {elementId: targetPortData.elementId, portId: targetPortData.id},
                                    });
                                })();

                            }
                            if ($port.type === PortType.DataOutput && e.target.getAttribute('data-port-data') === 'true') {
                                const targetPortId = e.target.getAttribute('data-port-id');
                                console.log('DATA INPUT targetPortId:', targetPortId);
                                getPortStore(targetPortId).subscribe((targetPortData) => {
                                    console.log('targetPort:', targetPortData);
                                    addLine({
                                        id: uuidv4(),
                                        start: {elementId: $port.elementId, portId: $port.id},
                                        end: {elementId: targetPortData.elementId, portId: targetPortData.id},
                                    });
                                })();
                            }
                        }
                    }
                    cancel();
                }
            }
            const onKeyDown = (event) => {
                switch (event.keyCode) {
                    case 27: // Escape
                        cancel();
                }
            }
            window.addEventListener('mousedown', down)
            window.addEventListener('mousemove', move)
            window.addEventListener('mouseup', up)
            document.addEventListener('keydown', onKeyDown)
        }
    };
</script>

<div class="relative">
    <div class="absolute w-0 h-0 top-1/2"
         bind:this={portIconRef}
         style:left={$port.type === PortType.ActionInput || $port.type === PortType.DataInput ? '7px' : 'unset'}
         style:right={$port.type === PortType.ActionOutput || $port.type === PortType.DataOutput ? '7px' : 'unset'}
    ><!--ICON CENTER ANCHOR--></div>
    {#if $port.type === PortType.ActionInput || $port.type === PortType.ActionOutput}
        <svg xmlns="http://www.w3.org/2000/svg"
             viewBox="4 3.5 16 17"
             stroke-width="2"
             width="13px"
             height="14px"
        >
            <path stroke-linecap="round" stroke-linejoin="round" class={dynamicClass}
                  data-port-id={$port.id}
                  data-port-active={$port.active}
                  data-port-disabled={$port.disabled}
                  data-port-action={$port.type === PortType.ActionInput || $port.type === PortType.ActionOutput}
                  data-port-input={$port.type === PortType.ActionInput}
                  data-port-output={$port.type === PortType.ActionOutput}
                  onclick={($port.type === PortType.ActionOutput && !$port.disabled) ? startConnection : null}
                  d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"/>
        </svg>
    {/if}
    {#if $port.type === PortType.DataInput || $port.type === PortType.DataOutput}
        <svg xmlns="http://www.w3.org/2000/svg"
             viewBox="0 0 14 14"
             stroke-width="2"
             width="14px"
             height="14px">
            <circle cx="7" cy="7" r="5.5"
                    data-port-id={$port.id}
                    data-port-active={$port.active}
                    data-port-disabled={$port.disabled}
                    data-port-data={$port.type === PortType.DataInput || $port.type === PortType.DataOutput}
                    data-port-input={$port.type === PortType.DataInput}
                    data-port-output={$port.type === PortType.DataOutput}
                    onclick={($port.type === PortType.DataOutput && !$port.disabled) ? startConnection : null}
                    class={dynamicClass}/>
        </svg>
    {/if}
</div>
