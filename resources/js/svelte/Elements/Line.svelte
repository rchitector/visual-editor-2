<script lang="ts">
    import {getLineStore} from "@/js/stores/linesStore";
    import {getPortStore} from "@/js/stores/portsStore.js";
    import {PortTypeColor, TailwindColorHEX} from "@/js/stores/constants";

    const strokeWidth = 3;
    const strokePadding = 150;

    let {id} = $props();
    const lineStore = getLineStore(id);

    const startPort = getPortStore($lineStore.start.portId);
    const endPort = getPortStore($lineStore.end.portId);

    let start = $state(null);
    let end = $state(null);

    $effect(() => {
        if ($startPort?.connection && $endPort?.connection) {
            start = $startPort?.connection;
            end = $endPort?.connection;
        }
    });

    // const diffX = (start, end) => start.x < end.x;
    // const diffY = (start, end) => start.y < end.y;
    // const absX = (start, end) => Math.abs(end.x - start.x);
    // const absY = (start, end) => Math.abs(end.y - start.y);
    // const m1 = (start, end) => diffX(start, end) ? 0 : absX(start, end);
    // const m2 = (start, end) => diffY(start, end) ? 0 : absY(start, end);
    // const c1 = (start, end) => diffX(start, end) ? absX(start, end) * 0.45 : absX(start, end) * 1.5;
    // const c2 = (start, end) => diffY(start, end) ? absY(start, end) * 0.05 : absY(start, end) * 0.95;
    // const c3 = (start, end) => diffX(start, end) ? absX(start, end) * 0.55 : absX(start, end) * -0.5;
    // const c4 = (start, end) => diffY(start, end) ? absY(start, end) * 0.95 : absY(start, end) * 0.05;
    // const c5 = (start, end) => diffX(start, end) ? absX(start, end) : 0;
    // const c6 = (start, end) => diffY(start, end) ? absY(start, end) : 0;
    // const bezierLine = (start, end) => {
    //     return `M ${m1(start, end)}, ${m2(start, end)} C ${c1(start, end)}, ${c2(start, end)}, ${c3(start, end)}, ${c4(start, end)}, ${c5(start, end)}, ${c6(start, end)}`;
    // }

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
</script>

{#if start && end}
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
            <path stroke-width={strokeWidth} class="pointer-events-auto" d={bezierLine(start, end)}
                  stroke={TailwindColorHEX[PortTypeColor[$startPort.type]]["500"]} fill="none"/>
        </svg>
    </div>
{/if}

