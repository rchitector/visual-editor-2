<script lang="ts">
    import DebugDot from "@/js/svelte/Debug/DebugDot";
    import {DebugColor} from "@/js/stores/DebugEnums";
    import BaseElement from "@/js/svelte/Elements/BaseElement.svelte";
    import {getElementStore, toggleOnTop} from "@/js/stores/elementsStore";
    import {getPortStore} from "@/js/stores/portsStore";
    import {documentPointToRelatedToCanvasZeroPoint} from "@/js/svelte/Store/store";
    import {findByPortId} from "@/js/stores/linesStore";

    const {id} = $props();

    const elementStore = getElementStore(id);

    $effect(() => {
        const allPorts = [
            ...$elementStore.ports.action.inputs,
            ...$elementStore.ports.action.outputs,
            ...$elementStore.ports.data.inputs,
            ...$elementStore.ports.data.outputs
        ];
        for (const portId of allPorts) {
            getPortStore(portId).update((state) => {
                if (state.ref) {
                    const rect = state.ref.getBoundingClientRect();
                    state.connection = documentPointToRelatedToCanvasZeroPoint(rect.x, rect.y);
                    state.active = findByPortId(portId).length > 0;
                }
                return state;
            });
        }
    });
</script>

{#if $elementStore}
    <div class={`absolute left-0 top-0 border rounded-lg ${$elementStore.onTop ? 'z-10' : ''}`}
         onmousedown={() => toggleOnTop(id)}
         style:transform={`matrix(1,0,0,1,${$elementStore.x},${$elementStore.y})`}
    >
        <DebugDot size="1" color={DebugColor.Green}/>
        <BaseElement id={id}>
            <div>Content</div>
        </BaseElement>
    </div>
{/if}
