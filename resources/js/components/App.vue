<script setup>
    import SideBar from "./SideBar.vue";
    import Canvas from "./Canvas.vue";
    import CanvasTopPanel from "./CanvasTopPanel.vue";
</script>

<template>
    <SideBar />
    <div class="p-4 sm:ml-64 h-screen flex flex-col">
        <CanvasTopPanel class="w-full mt-14" />
        <Canvas class="grow w-full mt-4" />
    </div>
</template>