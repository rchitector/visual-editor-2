<script>
    import {DebugColor} from "@/js/components/Debug/DebugEnums";

    let {x = 0, y = 0, size = 2, color = DebugColor.Red} = $props();
</script>
<div
    style:margin-left={`${-size / 8}rem`}
    style:margin-top={`${-size / 8}rem`}
    style:width={`${size / 4}rem`}
    style:height={`${size / 4}rem`}
    style:background-color={color}
    style:transform={`matrix(1, 0, 0, 1, ${x}, ${y})`}
    class="z-[99999] pointer-events-none absolute top-0 left-0 select-none rounded-full">
</div>
