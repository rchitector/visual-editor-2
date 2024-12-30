<script lang="ts">
    import {PortTypeColor, TailwindColorHEX} from "@/js/stores/constants";
    import {removeLine} from "@/js/stores/linesStore";

    const strokeWidth = 2;
    const strokePadding = 150;

    const {id, start, end, type, interactive = false} = $props();

    const sxLTex = $derived(start.x < end.x);
    const syLTey = $derived(start.y < end.y);
    const absDiffX = $derived(Math.abs(end.x - start.x));
    const absDiffY = $derived(Math.abs(end.y - start.y));
    const sx = $derived(sxLTex ? 0 : absDiffX);
    const sy = $derived(syLTey ? 0 : absDiffY);
    const ex = $derived(sxLTex ? absDiffX : 0);
    const ey = $derived(syLTey ? absDiffY : 0);
    const shiftX = $derived.by(() => {
        return Math.abs(ex - sx) * 0.1 + 100
    });
    const c1x = $derived.by(() => {
        return sx + shiftX;
    });
    const c1y = $derived.by(() => {
        return sy;
    });
    const c2x = $derived.by(() => {
        return ex - shiftX;
    });
    const c2y = $derived.by(() => {
        return ey;
    });

    let hovered = $state(false);

    function bezierPoint(t, sx, sy, c1x, c1y, c2x, c2y, ex, ey) {
        let x = (1 - t) ** 3 * sx + 3 * (1 - t) ** 2 * t * c1x + 3 * (1 - t) * t ** 2 * c2x + t ** 3 * ex;
        let y = (1 - t) ** 3 * sy + 3 * (1 - t) ** 2 * t * c1y + 3 * (1 - t) * t ** 2 * c2y + t ** 3 * ey;
        return {x: x, y: y};
    }

    const startPoint = $derived.by(() => {
        return bezierPoint(0.05, sx, sy, c1x, c1y, c2x, c2y, ex, ey);
    });
    const endPoint = $derived.by(() => {
        return bezierPoint(0.95, sx, sy, c1x, c1y, c2x, c2y, ex, ey);
    });

</script>

{#if start !== null && end !== null}
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
            {#if (sx !== null && sy !== null && c1x !== null && c1y !== null && c2x !== null && c2y !== null && ex !== null && ey !== null)}
                <path stroke-width={strokeWidth + 15}
                      class={interactive ? 'pointer-events-auto' : 'pointer-events-none'}
                      onmouseover="{() => { hovered = true; }}"
                      onmouseout="{() => { hovered = false;}}"
                      d={`M${sx},${sy} C${c1x},${c1y} ${c2x},${c2y} ${ex},${ey}`}
                      stroke="transparent"
                      fill="none"
                />
                <path stroke-width={strokeWidth}
                      class={interactive ? 'pointer-events-auto' : 'pointer-events-none'}
                      onmouseover="{() => hovered = true}"
                      onmouseout="{() => hovered = false}"
                      d={`M${sx},${sy} C${c1x},${c1y} ${c2x},${c2y} ${ex},${ey}`}
                      stroke={hovered ? TailwindColorHEX[PortTypeColor[type]]['400'] : TailwindColorHEX[PortTypeColor[type]]['500']}
                      fill="none"/>
                <g transform={`translate(${startPoint.x - 24*0.8*0.5}, ${startPoint.y - 24*0.8*0.5}) scale(0.8)`}
                   opacity={hovered ? 1 : 0}
                   class={`cursor-pointer hover:fill-red-500 dark:hover:fill-red-500 ${interactive ? 'pointer-events-auto' : 'pointer-events-none'}`}
                   onmouseover="{() => { hovered = true; }}"
                   onmouseout="{() => { hovered = false;}}"
                   onclick="{() => removeLine(id)}"
                   stroke={TailwindColorHEX[PortTypeColor[type]]['400']}
                   stroke-width="2"
                   stroke-linecap="round"
                   stroke-linejoin="round"
                >
                    <path
                        d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                        class="fill-gray-50 dark:fill-gray-800"
                    ></path>
                    <path d="M9 9L15 15"></path>
                    <path d="M15 9L9 15"></path>
                </g>
                <g transform={`translate(${endPoint.x - 24*0.8*0.5}, ${endPoint.y - 24*0.8*0.5}) scale(0.8)`}
                   opacity={hovered ? 1 : 0}
                   class={`cursor-pointer ${interactive ? 'pointer-events-auto' : 'pointer-events-none'}`}
                   onmouseover="{() => { hovered = true; }}"
                   onmouseout="{() => { hovered = false;}}"
                   onclick="{() => removeLine(id)}"
                   stroke={TailwindColorHEX[PortTypeColor[type]]['400']}
                   stroke-width="2"
                   stroke-linecap="round"
                   stroke-linejoin="round"
                >
                    <path
                        d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                        class="fill-gray-50 dark:fill-gray-800"
                    ></path>
                    <path d="M9 9L15 15"></path>
                    <path d="M15 9L9 15"></path>
                </g>
            {/if}
        </svg>


    </div>
{/if}
