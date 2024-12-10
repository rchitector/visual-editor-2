<script>
    import DebugDot from "@/js/svelte/Debug/DebugDot.svelte";
    import {store} from '@/js/svelte/Store/store';
    import {styleString} from "@/js/stores/helper";

    const style = $derived({
        transform: `matrix(${$store.canvasMatrix.scale}, 0, 0, ${$store.canvasMatrix.scale}, ${$store.canvasMatrix.x}, ${$store.canvasMatrix.y})`
    });
</script>

<div id="canvas" style={styleString(style)} class="relative top-0 left-0 select-none inset-0 w-0 h-0">
    <DebugDot :size="2"/>
</div>
