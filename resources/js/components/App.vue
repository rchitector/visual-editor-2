<script setup lang="ts">
import SideBar from "./Panels/SideBar.vue";
import Canvas from "./Canvas/Canvas.vue";
</script>

<template>
    <SideBar/>
    <div class="sm:ml-64 h-screen pt-16 flex items-center justify-center">
        <Canvas/>
    </div>
</template>