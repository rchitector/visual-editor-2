<script lang="ts">
    import {newLineStartPort} from "@/js/svelte/Store/store";
    import {getPortStore} from "@/js/stores/portsStore";
    import {PortType, PortTypeColor, TailwindColorHEX} from "@/js/stores/constants";
    import BaseLine from "@/js/svelte/Elements/BaseLine.svelte";

    const startPort = $derived(getPortStore($newLineStartPort.id));
    const start = $derived($startPort?.connection ?? null);
    const end = $derived($newLineStartPort.end ?? null);
    const type = $derived($startPort?.type);
</script>

<BaseLine type={type} start={start} end={end}/>

{#if start !== null && end !== null}
    <div class="absolute left-0 top-0 pointer-events-none"
         style:transform={`matrix(1,0,0,1,${end.x - 7}, ${end.y - 7})`}>
        {#if type === PortType.ActionInput || type === PortType.ActionOutput}
            <svg xmlns="http://www.w3.org/2000/svg"
                 viewBox="4 3.5 16 17"
                 stroke-width="2"
                 width="14"
                 height="14"
                 class="pointer-events-none"
                 stroke={TailwindColorHEX[PortTypeColor[type]]["500"]}
                 fill={TailwindColorHEX[PortTypeColor[type]]["500"]}
            >
                <path stroke-linecap="round" stroke-linejoin="round"
                      class="pointer-events-none"
                      d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"/>
            </svg>
        {/if}
        {#if type === PortType.DataInput || type === PortType.DataOutput}
            <svg xmlns="http://www.w3.org/2000/svg"
                 viewBox="0 0 14 14"
                 stroke-width="2"
                 width="14"
                 height="14"
                 class="pointer-events-none"
                 stroke={TailwindColorHEX[PortTypeColor[type]]["500"]}
                 fill={TailwindColorHEX[PortTypeColor[type]]["500"]}
            >
                <circle cx="7" cy="7" r="5.5" class="pointer-events-none"/>
            </svg>
        {/if}
    </div>
{/if}
