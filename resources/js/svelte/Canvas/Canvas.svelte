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
    import {ItemTypes} from "@/js/svelte/Store/constants";
    import CanvasBackground from "@/js/svelte/Canvas/CanvasBackground";
    import CanvasElements from "@/js/svelte/Canvas/CanvasElements";
    import CanvasElementsControl from "@/js/svelte/Controls/CanvasElementsControl.svelte";
    import CanvasZoomControl from "@/js/svelte/Controls/CanvasZoomControl.svelte";
    // import {addLine} from "@/js/svelte/Store/linesStore";
    // import {v4 as uuidv4} from "uuid";

    onMount(() => {
        const element1 = createElementRelated(100, 200, ItemTypes.Start);
        const element3 = createElementRelated(700, 400, ItemTypes.Finish);
        // addLine({
        //     id: uuidv4(),
        //     start: {elementId: element1.id, portId: element1.ports.action.outputs[0]},
        //     end: {elementId: element3.id, portId: element3.ports.data.inputs[0]},
        // });
        // addLine({
        //     id: uuidv4(),
        //     start: {elementId: element1.id, portId: element1.ports.action.outputs[1]},
        //     end: {elementId: element3.id, portId: element3.ports.action.inputs[3]},
        // });
        // addLine({
        //     id: uuidv4(),
        //     start: {elementId: element1.id, portId: element1.ports.action.outputs[2]},
        //     end: {elementId: element3.id, portId: element3.ports.data.inputs[2]},
        // });
        // addLine({
        //     id: uuidv4(),
        //     start: {elementId: element1.id, portId: element1.ports.action.outputs[3]},
        //     end: {elementId: element3.id, portId: element3.ports.action.inputs[1]},
        // });

        // addLine({
        //     id: uuidv4(),
        //     start: {elementId: element1.id, portId: element1.ports.data.outputs[0]},
        //     end: {elementId: element3.id, portId: element3.ports.action.inputs[0]},
        // });
        // addLine({
        //     id: uuidv4(),
        //     start: {elementId: element1.id, portId: element1.ports.data.outputs[1]},
        //     end: {elementId: element3.id, portId: element3.ports.data.inputs[1]},
        // });
        // addLine({
        //     id: uuidv4(),
        //     start: {elementId: element1.id, portId: element1.ports.data.outputs[2]},
        //     end: {elementId: element3.id, portId: element3.ports.action.inputs[2]},
        // });
        // addLine({
        //     id: uuidv4(),
        //     start: {elementId: element1.id, portId: element1.ports.data.outputs[3]},
        //     end: {elementId: element3.id, portId: element3.ports.action.inputs[3]},
        // });

        // const element2 = createElementRelated(400, 200, ItemTypes.Action1);
        // addLine({
        //     id: uuidv4(),
        //     start: {elementId: element2.id, portId: element2.ports.data.outputs[0]},
        //     end: {elementId: element3.id, portId: element3.ports.action.inputs[0]},
        // });
        // addLine({
        //     id: uuidv4(),
        //     start: {elementId: element2.id, portId: element2.ports.data.outputs[1]},
        //     end: {elementId: element3.id, portId: element3.ports.action.inputs[1]},
        // });
        // addLine({
        //     id: uuidv4(),
        //     start: {elementId: element2.id, portId: element2.ports.data.outputs[2]},
        //     end: {elementId: element3.id, portId: element3.ports.action.inputs[2]},
        // });
        // addLine({
        //     id: uuidv4(),
        //     start: {elementId: element2.id, portId: element2.ports.data.outputs[3]},
        //     end: {elementId: element3.id, portId: element3.ports.action.inputs[3]},
        // });
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
     class="text-xs relative w-full h-full overflow-hidden border-0 box-border bg-gray-50 dark:bg-gray-800"
     on:contextmenu={onMainBoxContextMenu}
     on:mousedown={startDragging}
     on:wheel={onWheel}
>
    <CanvasBackground/>
    <CanvasElements/>
    <CanvasElementsControl {mainBoxRef}/>
    <CanvasZoomControl/>
</div>
