<script lang="ts">
    import {PortType} from "@/js/svelte/Store/constants";
    import {getPortStore} from "@/js/svelte/Store/portsStore";
    import {onMount} from "svelte";
    import {documentPointToRelatedToCanvasZeroPoint, newLineStartPort} from "@/js/svelte/Store/store";
    import {addLine, findByPortId} from "@/js/svelte/Store/linesStore";
    import {v4 as uuidV4} from "uuid";
    import {DebugColor} from "@/js/svelte/Store/DebugEnums";

    const {id, baseColor} = $props();
    const port = getPortStore(id);

    const dynamicClass = $derived.by(() => {
        let classes = 'stroke-current pointer-events-auto';
        if ($port?.active) {
            if ($port?.disabled) {
                classes += ` text-gray-500 dark:text-gray-500`;
                classes += ` fill-gray-500 dark:fill-gray-500`;
            } else {
                classes += ` text-${baseColor}-500 dark:text-${baseColor}-500`;
                classes += ` fill-${baseColor}-500 dark:fill-${baseColor}-500`;
                classes += ` cursor-pointer`;
            }
        } else {
            if ($port?.disabled) {
                classes += ` text-gray-500 dark:text-gray-500`;
                classes += ` fill-transparent`;
            } else {
                classes += ` text-${baseColor}-500 dark:text-${baseColor}-500`;
                classes += ` fill-transparent`;
                classes += ` hover:fill-${baseColor}-500 hover:dark:fill-${baseColor}-500`;
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
            state.active = findByPortId(id).length > 0;
            return state;
        });
    });

    const createLineForPorts = (startPortStore, startPort, endPortId) => {
        const endPort = getPortStore(endPortId);
        endPort.subscribe((targetPortData) => {
            addLine({
                id: uuidV4(),
                start: {elementId: startPort.elementId, portId: startPort.id},
                end: {elementId: targetPortData.elementId, portId: targetPortData.id},
            });
        })();
        endPort.update(state => {
            state.active = true;
            return state;
        });
        startPortStore.update(state => {
            state.active = true;
            return state;
        });
    };

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
                    return {id: null, end: {portId: null, x: null, y: null,}};
                });
            };
            const down = (e) => {
                startDragPoint.x = e.clientX;
                startDragPoint.y = e.clientY;
            }
            const move = (e) => {
                if (!$newLineStartPort.end.portId) {
                    newLineStartPort.update(state => {
                        return {...state, end: documentPointToRelatedToCanvasZeroPoint(e.clientX, e.clientY)};
                    });
                }
            }
            const up = (e) => {
                if (Math.abs(startDragPoint.x - e.clientX) < 5 && Math.abs(startDragPoint.y - e.clientY) < 5) {
                    if ($newLineStartPort.end.portId) {
                        createLineForPorts(port, $port, $newLineStartPort.end.portId);
                    } else if (e.target.hasAttribute('data-port-id')) {
                        if (e.target.getAttribute('data-port-input') === 'true' && e.target.getAttribute('data-port-disabled') === 'false') {
                            // && e.target.getAttribute('data-port-active') === 'false'
                            if ($port.type === PortType.ActionOutput && e.target.getAttribute('data-port-action') === 'true') {
                                const targetPortId = e.target.getAttribute('data-port-id');
                                createLineForPorts(port, $port, targetPortId);
                            }
                            if ($port.type === PortType.DataOutput && e.target.getAttribute('data-port-data') === 'true') {
                                const targetPortId = e.target.getAttribute('data-port-id');
                                createLineForPorts(port, $port, targetPortId);
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

    // $inspect($port).with((event, value) => {
    //     if ('Data Output 16' == value.title) {
    //         console.log('PortIcon', event, value);
    //     }
    // });

    const onMouseOver = (portId, connection) => {
        newLineStartPort.update(state => {
            return {...state, end: {...state.end, ...connection, portId: portId}};
        });
    };
    const onMouseOut = () => {
        newLineStartPort.update(state => {
            return {...state, end: {...state.end, portId: null}};
        });
    };
</script>

<div class="relative">
    <div class="absolute w-0 h-0 top-1/2 left-1/2"
         bind:this={portIconRef}
         style:left={$port.type === PortType.ActionInput || $port.type === PortType.DataInput ? '7px' : 'unset'}
         style:right={$port.type === PortType.ActionOutput || $port.type === PortType.DataOutput ? '7px' : 'unset'}
    ><!--ICON CENTER ANCHOR--></div>
    {#if (($port.type === PortType.ActionInput || $port.type === PortType.DataInput) && !$port.disabled)}
        <svg xmlns="http://www.w3.org/2000/svg"
             class="absolute top-0 left-0"
             style:transform={`translate(-5px, -5px)`}
             style:opacity={'0'}
             width="24px" height="24px" viewBox="0 0 20 20"
        >
            <circle cx="10" cy="10" r="10" fill={DebugColor.Red}
                    onmouseover={()=>onMouseOver($port.id, $port.connection)}
                    onmouseout={onMouseOut}/>
        </svg>
    {/if}
    {#if $port.type === PortType.ActionInput || $port.type === PortType.ActionOutput}
        <svg xmlns="http://www.w3.org/2000/svg" stroke-width="2" width="14px" height="14px" viewBox="4 3.5 16 17">
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
        <svg xmlns="http://www.w3.org/2000/svg" stroke-width="2" width="14px" height="14px" viewBox="0 0 14 14">
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
