<script>
    import SideBar from "@/js/svelte/Panels/SideBar.svelte";
    import Canvas from "@/js/svelte/Canvas/Canvas.svelte";
</script>

<SideBar/>
<div class="sm:ml-64 h-screen  pt-16 border-0 box-border flex items-center justify-center relative">
    <div class="relative top-0 left-0 w-full h-full">
        <Canvas/>
    </div>
</div>
