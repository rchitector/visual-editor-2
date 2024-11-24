<script setup lang="ts">
import SideBar from "./SideBar.vue";
import Canvas from "./Canvas.vue";
</script>

<template>
    <SideBar/>
    <div class="sm:ml-64 h-screen pt-16 flex flex-col">
        <Canvas/>
    </div>
</template>