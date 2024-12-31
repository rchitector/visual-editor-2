<script lang="ts">
    import {getLineStore} from "@/js/svelte/Store/linesStore";
    import {getPortStore} from "@/js/svelte/Store/portsStore";
    import BaseLine from "@/js/svelte/Elements/BaseLine.svelte";

    const {id} = $props();
    const lineStore = getLineStore(id);
    const startPort = getPortStore($lineStore.start.portId);
    const endPort = getPortStore($lineStore.end.portId);
    const start = $derived($startPort?.connection ?? null);
    const end = $derived($endPort?.connection ?? null);
    const type = $derived($startPort?.type);
</script>

<BaseLine id={id} type={type} start={start} end={end} interactive={true}/>

