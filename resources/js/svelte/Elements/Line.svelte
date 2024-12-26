<script lang="ts">

    import {derived} from "svelte/store";

    let {line} = $props();

    let startX = derived(line.startX);
    let endX = derived(line.endX);
    let startY = derived(line.startY);
    let endY = derived(line.endY);

    // onMounted(() => {
    //     document.addEventListener('mousedown', mouseDownHandler);
    // });
    //
    // onUnmounted(() => {
    //     document.removeEventListener('mousedown', mouseDownHandler);
    // });
    //
    // const mouseDownHandler = (event: MouseEvent | TouchEvent) => {
    //     // const point = 'touches' in event ? event.touches[0] : event;
    //     // console.log('event:', point.clientX, point.clientY);
    //     // startX.value = (store.canvasPointMatrix.x - store.canvasMatrix.x) / store.canvasMatrix.scale;
    //     // startY.value = (store.canvasPointMatrix.y - store.canvasMatrix.y) / store.canvasMatrix.scale;
    //     // document.addEventListener('mousemove', mouseMoveHandler);
    //     // document.addEventListener('mouseup', mouseUpHandler);
    // };
    // const mouseUpHandler = (event: MouseEvent | TouchEvent) => {
    //     // document.removeEventListener('mousemove', mouseMoveHandler);
    //     // document.removeEventListener('mouseup', mouseUpHandler);
    // };
    // const mouseMoveHandler = (event: MouseEvent | TouchEvent) => {
    //     // endX.value = (store.canvasPointMatrix.x - store.canvasMatrix.x) / store.canvasMatrix.scale;
    //     // endY.value = (store.canvasPointMatrix.y - store.canvasMatrix.y) / store.canvasMatrix.scale;
    // }

    const strokeWidth = 4;
    const strokePadding = 2;
    const padding = 10;
    const width = derived(() => Math.abs(endX.value - startX.value));
    const height = derived(() => Math.abs(endY.value - startY.value));

    const cx1 = derived(() => {
        if (startX.value > endX.value) {
            return Math.abs(endX.value - startX.value);
        }
        return 0;
    });
    const cy1 = derived(() => {

        if (startY.value > endY.value) {
            return Math.abs(endY.value - startY.value);
        }
        return 0;
    });
    const cx2 = derived(() => {
        if (startX.value > endX.value) {
            return 0;
        }
        return Math.abs(endX.value - startX.value);
    });
    const cy2 = derived(() => {
        if (startY.value > endY.value) {
            return 0;
        }
        return Math.abs(endY.value - startY.value)
    });
    const lineStyle = derived(() => {
        return {
            transform: `matrix(1,0,0,1,${Math.min(startX.value, endX.value)},${Math.min(startY.value, endY.value)})`,
            marginTop: `-${strokePadding}px`,
            marginRight: `-${strokePadding}px`,
            marginBottom: `-${strokePadding}px`,
            marginLeft: `-${strokePadding}px`,
        };
    });
</script>

<!--    <DebugDot color={DebugColor.Blue} size="2" x={line.port1.connection.x} y={line.port1.connection.y}/>-->
<!--    <DebugDot color={DebugColor.Red} size="2" x={port2.connection.x} y={port2.connection.y}/>-->
<div class="line-box absolute left-0 top-0 pointer-events-all">
    <svg height={padding*2}
         style:transform={`matrix(1, 0, 0, 1, ${startX - padding}, ${startY - padding})`}
         viewBox={`0 0 ${padding*2} ${padding*2}`}
         width={padding*2}
         class="line-start-point absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2"
         data-is-draggable="true"
         data-type="line-start-point"
         xmlns="http://www.w3.org/2000/svg"
    >
        <circle cx={padding} cy={padding} r={padding} fill="#3b82f6"/>
    </svg>
    <svg height={padding*2}
         style:transform={`matrix(1, 0, 0, 1, ${endX - padding}, ${endY - padding})`}
         viewBox={`0 0 ${padding*2} ${padding*2}`}
         width={padding*2}
         class="line-end-point absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2"
         data-is-draggable="true"
         data-type="line-end-point"
         xmlns="http://www.w3.org/2000/svg"
    >
        <circle cx={padding} cy={padding} r={padding} fill="#3b82f6"/>
    </svg>
    <svg height={height + strokePadding*2}
         style={lineStyle}
         viewBox={`-${strokePadding} -${strokePadding} ${width + strokePadding*2} ${height + strokePadding*2}`}
         width={width + strokePadding*2}
         xmlns="http://www.w3.org/2000/svg"
    >
        <rect height={height} width={width} fill="#ef444433"/>
        <line stroke-width={strokeWidth}
              x1={cx1}
              x2={cx2}
              y1={cy1}
              y2={cy2}
              stroke="white"
              stroke-linecap="round"/>
    </svg>
</div>
