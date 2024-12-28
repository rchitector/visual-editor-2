<script lang="ts">
    import {
        canvasMatrix,
        createElementRelated,
        mainBoxRect,
        updateMainBoxRect,
        zoomIn,
        zoomOut
    } from '@/js/svelte/Store/store';
    import {onMount} from "svelte";
    import {ItemTypes} from "@/js/stores/constants";
    import CanvasBackground from "@/js/svelte/Canvas/CanvasBackground";
    import CanvasElements from "@/js/svelte/Canvas/CanvasElements";
    import CanvasElementsControl from "@/js/svelte/Controls/CanvasElementsControl.svelte";
    import CanvasZoomControl from "@/js/svelte/Controls/CanvasZoomControl.svelte";

    onMount(() => {
        createElementRelated(100, 200, ItemTypes.Start);
        // createElementRelated(400, 200, ItemTypes.Action1);
        createElementRelated(700, 200, ItemTypes.Finish);
    });

    let mainBoxRef;
    let resizeObserver;

    const onMainBoxContextMenu = (event) => {
        if (event.target === mainBoxRef) {
            event.preventDefault();
        }
    };

    const onWheel = (event) => {
        event.preventDefault();
        const scaleRelatedX = event.clientX - $mainBoxRect.x;
        const scaleRelatedY = event.clientY - $mainBoxRect.y;
        if (event.deltaY > 0) {
            zoomOut(scaleRelatedX, scaleRelatedY);
        } else if (event.deltaY < 0) {
            zoomIn(scaleRelatedX, scaleRelatedY);
        }
    };

    const startDragging = (event) => {
        if (event.target === mainBoxRef) {
            const move = (e) => {
                canvasMatrix.update(state => ({
                    ...state,
                    x: $canvasMatrix.x + e.movementX,
                    y: $canvasMatrix.y + e.movementY,
                }));
            }
            const stop = () => {
                window.removeEventListener('mousemove', move)
                window.removeEventListener('mouseup', stop)
            }
            window.addEventListener('mousemove', move)
            window.addEventListener('mouseup', stop)
        }
    };

    onMount(() => {
        if (mainBoxRef) {
            resizeObserver = new ResizeObserver((entries) => {
                for (let entry of entries) {
                    updateMainBoxRect(mainBoxRef.getBoundingClientRect());
                }
            });
            resizeObserver.observe(mainBoxRef);
            updateMainBoxRect(mainBoxRef.getBoundingClientRect());
        }
        return () => {
            if (mainBoxRef) {
                resizeObserver.unobserve(mainBoxRef);
            }
        };
    });
</script>

<div bind:this={mainBoxRef}
     class="relative w-full h-full overflow-hidden border-0 box-border bg-gray-50 dark:bg-gray-800"
     on:contextmenu={onMainBoxContextMenu}
     on:mousedown={startDragging}
     on:wheel={onWheel}
>
    <CanvasBackground/>
    <CanvasElements/>
    <!--    <ParentElement/>-->
    <!--    <CanvasLines/>-->
    <CanvasElementsControl {mainBoxRef}/>
    <CanvasZoomControl/>
    <!--<span>DebugInfo v-if="store.debug"</span>-->
</div>
