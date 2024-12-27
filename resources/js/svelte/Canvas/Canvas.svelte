<script lang="ts">
    import {canvasMatrix, mainBoxRect, updateMainBoxRect, zoomIn, zoomOut} from '@/js/svelte/Store/store.ts';
    import {onMount} from "svelte";
    import ParentElement from "@/js/svelte/ParentElement.svelte";

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
    // onMount(() => {
    //     console.log('Canvas mounted:');
    //     return () => {
    //         console.log('Canvas unmounted:');
    //     };
    // });
    // onDestroy(() => {
    //     console.log('Canvas destroyed');
    // });
    // $effect.pre(() => {
    //     console.log('Canvas component is about to update');
    //     tick().then(() => {
    //         console.log('Canvas component just updated');
    //     });
    // });

</script>

<div bind:this={mainBoxRef}
     class="relative w-full h-full overflow-hidden border-0 box-border bg-gray-50 dark:bg-gray-800"
     on:contextmenu={onMainBoxContextMenu}
     on:mousedown={startDragging}
     on:wheel={onWheel}
>
    <ParentElement/>
    <!--    <CanvasBackground/>-->
    <!--    <CanvasElements/>-->
    <!--    <CanvasLines/>-->
    <!--    <CanvasElementsControl {mainBoxRef}/>-->
    <!--    <CanvasZoomControl/>-->
    <!--<span>DebugInfo v-if="store.debug"</span>-->
</div>
