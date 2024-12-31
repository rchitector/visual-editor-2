<script lang="ts">
    import {ColorName, PortType, PortTypeColor} from "@/js/svelte/Store/constants";
    import PortIcon from "@/js/svelte/Icons/PortIcon.svelte";
    import {getPortStore} from "@/js/svelte/Store/portsStore";

    let {id} = $props();
    const port = getPortStore(id);
</script>

<div class="relative port whitespace-nowrap relative">
    <div>{ $port.title }</div>
    <div
        class:-left-7={$port.type === PortType.ActionInput || $port.type === PortType.DataInput}
        class:-right-7={$port.type === PortType.ActionOutput || $port.type === PortType.DataOutput}
        class="absolute top-1 pointer-events-auto">
        <PortIcon id={id} baseColor={ColorName[PortTypeColor[$port.type]]}/>
    </div>
</div>
