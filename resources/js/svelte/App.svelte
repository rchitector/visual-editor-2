<script lang="ts">
    import SideBar from "@/js/svelte/Panels/SideBar.svelte";
    import Canvas from "@/js/svelte/Canvas/Canvas.svelte";
    import {onMount} from "svelte";
    import {createElementRelated} from "@/js/svelte/Store/store";
    import {ItemTypes} from "@/js/stores/constants";

    onMount(() => {
        console.log('App mounted:');
        const element1 = createElementRelated(100, 200, ItemTypes.Start);
        const element2 = createElementRelated(400, 200, ItemTypes.Action1);
        const element3 = createElementRelated(700, 200, ItemTypes.Finish);
        return () => {
            console.log('App unmounted:');
        };
    });
    // onDestroy(() => {
    //     console.log('Add destroyed');
    // });
    // $effect.pre(() => {
    //     console.log('App component is about to update');
    //     tick().then(() => {
    //         console.log('App component just updated');
    //     });
    // });
</script>

<SideBar/>
<div class="sm:ml-64 h-screen  pt-16 border-0 box-border flex items-center justify-center relative">
    <div class="relative top-0 left-0 w-full h-full">
        <Canvas/>
    </div>
</div>
