<script lang="ts">
    import {store, updateMainBoxRect, zoomIn, zoomOut} from '@/js/svelte/Store/store.ts';
    import CanvasBackground from "@/js/svelte/Canvas/CanvasBackground.svelte";
    import CanvasElements from "@/js/svelte/Canvas/CanvasElements.svelte";
    import {onMount} from "svelte";
    import CanvasZoomControl from "@/js/svelte/Controls/CanvasZoomControl.svelte";
    import CanvasElementsControl from "@/js/svelte/Controls/CanvasElementsControl.svelte";

    let mainBoxRef;
    let resizeObserver;

    const onMainBoxContextMenu = (event) => {
        if (event.target === mainBoxRef) {
            event.preventDefault();
        }
    };

    const onWheel = (event) => {
        event.preventDefault();
        const scaleRelatedX = event.clientX - $store.mainBoxRect.x;
        const scaleRelatedY = event.clientY - $store.mainBoxRect.y;
        if (event.deltaY > 0) {
            zoomOut(scaleRelatedX, scaleRelatedY);
        } else if (event.deltaY < 0) {
            zoomIn(scaleRelatedX, scaleRelatedY);
        }
    };

    const startDragging = (event) => {
        if (event.target === mainBoxRef) {
            const move = (e) => {
                store.update(state => ({
                    ...state,
                    canvasMatrix: {
                        ...state.canvasMatrix,
                        x: $store.canvasMatrix.x + e.movementX,
                        y: $store.canvasMatrix.y + e.movementY,
                    }
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
    <!--    <span>CanvasLines</span>-->
    <!--    <span>CanvasElements</span>-->
    <CanvasElementsControl {mainBoxRef}/>
    <CanvasZoomControl/>
</div>
<!--<span>DebugInfo v-if="store.debug"</span>-->
