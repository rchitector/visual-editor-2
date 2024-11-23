<script setup lang="ts">
    import SideBar from "./SideBar.vue";
    import Canvas from "./Canvas.vue";
</script>

<template>
    <SideBar />
    <div class="p-4 sm:ml-64 h-screen flex flex-col">
        <Canvas class="grow w-full mt-14" />
    </div>
</template>