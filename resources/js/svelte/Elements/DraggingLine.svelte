<script lang="ts">
    import {newLineStartPort} from "@/js/svelte/Store/store";
    import {getPortStore} from "@/js/stores/portsStore";
    import {PortType, PortTypeColor, TailwindColorHEX} from "@/js/stores/constants";

    const strokeWidth = 3;
    const strokePadding = 150;

    const startPort = $derived(getPortStore($newLineStartPort.id));

    let start = $derived.by(() => {
        return {
            x: $startPort?.connection?.x,
            y: $startPort?.connection?.y
        }
    });
    let end = $derived.by(() => {
        return $newLineStartPort.end;
    });
    let type = $derived.by(() => {
        return $startPort?.type;
    });

    const sxLTex = (start, end) => start.x < end.x;
    const syLTey = (start, end) => start.y < end.y;
    const absDiffX = (start, end) => Math.abs(end.x - start.x);
    const absDiffY = (start, end) => Math.abs(end.y - start.y);
    const m1 = (start, end) => sxLTex(start, end) ? 0 : absDiffX(start, end);
    const m2 = (start, end) => syLTey(start, end) ? 0 : absDiffY(start, end);
    const c1 = (start, end) => sxLTex(start, end) ? m1(start, end) + 150 : m1(start, end) + 150 + absDiffX(start, end) * 0.2;
    const c2 = (start, end) => m2(start, end);
    const c5 = (start, end) => sxLTex(start, end) ? absDiffX(start, end) : 0;
    const c6 = (start, end) => syLTey(start, end) ? absDiffY(start, end) : 0;
    const c3 = (start, end) => sxLTex(start, end) ? c5(start, end) - 150 : c5(start, end) - 150 - absDiffX(start, end) * 0.2;
    const c4 = (start, end) => c6(start, end);

    const bezierLine = (start, end) => {
        return `M ${m1(start, end)}, ${m2(start, end)} C ${c1(start, end)}, ${c2(start, end)}, ${c3(start, end)}, ${c4(start, end)}, ${c5(start, end)}, ${c6(start, end)}`;
    }

    // $inspect($newLineStartPort).with((event, value) => {
    //     // console.log('DraggingLine newLineStartPort', event, value);
    //     // console.log('start, end, type:', start, end, type);
    //     console.log('end:', end);
    // });
</script>

{#if start && end && type}
    <div class="absolute left-0 top-0 pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg"
             class="pointer-events-none"
             style:transform={`matrix(1,0,0,1,${Math.min(start.x, end.x)},${Math.min(start.y, end.y)})`}
             style:margin-top={`-${strokePadding}px`}
             style:margin-right={`-${strokePadding}px`}
             style:margin-bottom={`-${strokePadding}px`}
             style:margin-left={`-${strokePadding}px`}
             viewBox={`-${strokePadding} -${strokePadding} ${Math.abs(end.x - start.x) + strokePadding*2} ${Math.abs(end.y - start.y) + strokePadding*2}`}
             width={Math.abs(end.x - start.x) + strokePadding*2}
             height={Math.abs(end.y - start.y) + strokePadding*2}
        >
            <path stroke-width={strokeWidth} class="pointer-events-none" d={bezierLine(start, end)}
                  stroke={TailwindColorHEX[PortTypeColor[type]]["500"]}
                  fill="none"/>
        </svg>
    </div>
    <div class="absolute left-0 top-0 pointer-events-none" id="end-point-icon"
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

