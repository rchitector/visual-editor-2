<script lang="ts">
    import {PortType} from "@/js/stores/constants";
    import PortIcon from "@/js/svelte/Icons/PortIcon.svelte";

    let {port, baseColor, index} = $props();
</script>

<div class="relative port whitespace-nowrap relative">
    <div>{ port.title }</div>
    <div
        class:-left-7={port.type === PortType.ActionInput || port.type === PortType.DataInput}
        class:-right-7={port.type === PortType.ActionOutput || port.type === PortType.DataOutput}
        class="absolute top-1 pointer-events-auto">
        <PortIcon port={port} baseColor={baseColor}/>
    </div>
</div>
