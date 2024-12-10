<script>
    import {styleString} from "@/js/stores/helper";
    import {DebugColor} from "@/js/components/Debug/DebugEnums";

    let {x = 0, y = 0, size = 2} = $props();
    const style = $derived({
        'background-color': DebugColor.Red,
        'transform': `matrix(1, 0, 0, 1, ${x}, ${y})`,
        'width': `${size / 4}rem`,
        'height': `${size / 4}rem`,
        'margin-left': `-${size / 8}rem`,
        'margin-top': `-${size / 8}rem`,
    });
</script>
<div
    style={styleString(style)}
    class="z-[99999] pointer-events-none absolute top-0 left-0 select-none rounded-full">
</div>
