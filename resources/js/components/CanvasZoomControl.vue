<script setup lang="ts">
import {useCanvasStore} from "@/js/stores/canvasStore";

// const props = defineProps({
//     onZoomChange: {
//         type: Function,
//         required: true,
//     },
// });

const canvasStore = useCanvasStore();

const moveToCenter = () => {
    canvasStore.canvasTranslateX = 0;
    canvasStore.canvasTranslateY = 0;
};

const zoomFit = () => {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    canvasStore.items.forEach(item => {
        minX = Math.min(minX, item.x);
        minY = Math.min(minY, item.y);
        maxX = Math.max(maxX, item.x + item.w);
        maxY = Math.max(maxY, item.y + item.h);
    });

    console.log(minX, minY, maxX, maxY)

    const padding = 20;
    const visibleMinX = minX - padding;
    const visibleMinY = minY - padding;
    const visibleMaxX = maxX + padding;
    const visibleMaxY = maxY + padding;

    console.log(visibleMinX, visibleMinY, visibleMaxX, visibleMaxY)

    // const canvasWidth = canvas.offsetWidth;
    // const canvasHeight = canvas.offsetHeight;
    //
    // const width = visibleMaxX - visibleMinX;
    // const height = visibleMaxY - visibleMinY;
    //
    // const scale = Math.min(canvasWidth / width, canvasHeight / height);
    //
    // const centerX = (visibleMinX + visibleMaxX) / 2;
    // const centerY = (visibleMinY + visibleMaxY) / 2;
    //
    // const translateX = canvasWidth / 2 - centerX * scale;
    // const translateY = canvasHeight / 2 - centerY * scale;

    // canvas.style.transform = `matrix(${scale}, 0, 0, ${scale}, ${translateX}, ${translateY})`;
    // canvasStore.zoomFit()
};

</script>

<template>
    <div class="absolute gap-1 right-5 bottom-5 flex items-center rounded-lg border border-gray-200 dark:border-gray-700 p-2 bg-white dark:bg-gray-800">
        <button v-if="canvasStore.debug" v-for="level in canvasStore.zoomLevelsVisible" :key="`${level}-temp`" @click="()=>canvasStore.setZoom(level)" type="button"
                class="flex items-center gap-2 p-2 text-gray-900 rounded-lg dark:text-white bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 group">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-3">
                <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
            </svg>
            <span>{{ level }}%</span>
        </button>
        <button v-if="canvasStore.debug" type="button"
                class="flex items-center gap-2 p-2 text-gray-900 rounded-lg dark:text-white bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 group"
                @click="moveToCenter">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 3.75H6A2.25 2.25 0 0 0 3.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0 1 20.25 6v1.5m0 9V18A2.25 2.25 0 0 1 18 20.25h-1.5m-9 0H6A2.25 2.25 0 0 1 3.75 18v-1.5M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            <span>center</span>
        </button>
        <button v-if="canvasStore.debug" type="button"
                class="flex items-center gap-2 p-2 text-gray-900 rounded-lg dark:text-white bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 group"
                @click="zoomFit">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" class="size-5">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--svg-stroke-width)"
                      d="M2 6v12m20-12v12m-3-6h-14m14 0-3-3m3 3-3 3m-11-3 3-3m-3 3 3 3"></path>
                <path stroke="currentColor" stroke-width="var(--svg-stroke-width)" d="M12 12v.0001"></path>
            </svg>
            <span>fit</span>
        </button>

        <button @click="canvasStore.zoomOut"
                type="button" class="p-2 text-gray-900 rounded-lg dark:text-white bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 group">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM13.5 10.5h-6"/>
            </svg>
        </button>

        <button id="dropdownTopButton" data-dropdown-toggle="dropdownTop" data-dropdown-placement="top"
                class="text-gray-900 dark:text-white px-3 py-2.5 ps-1 text-center inline-flex items-center rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                type="button">
            <div class="w-16 ">{{ canvasStore.zoomLevel }}%</div>
        </button>
        <div id="dropdownTop" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
            <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownTopButton">
                <li>
                    <button @click="moveToCenter" type="button" class="w-full block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 3.75H6A2.25 2.25 0 0 0 3.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0 1 20.25 6v1.5m0 9V18A2.25 2.25 0 0 1 18 20.25h-1.5m-9 0H6A2.25 2.25 0 0 1 3.75 18v-1.5M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                        <span>center</span>
                    </button>
                </li>
                <li>
                    <button @click="zoomFit" type="button" class="w-full block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white flex items-center gap-2">
                        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" class="size-5">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--svg-stroke-width)"
                                  d="M2 6v12m20-12v12m-3-6h-14m14 0-3-3m3 3-3 3m-11-3 3-3m-3 3 3 3"></path>
                            <path stroke="currentColor" stroke-width="var(--svg-stroke-width)" d="M12 12v.0001"></path>
                        </svg>
                        <span>fit</span>
                    </button>
                </li>
                <li v-for="level in canvasStore.zoomLevelsVisible" :key="level" >
                    <button @click="()=>canvasStore.setZoom(level)" type="button" class="w-full block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
                        </svg>
                        <div class="">{{ level }}%</div>
                    </button>
                </li>
            </ul>
        </div>

        <button @click="canvasStore.zoomIn" type="button"
                class="p-2 text-gray-900 rounded-lg dark:text-white bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 group">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6"/>
            </svg>
        </button>
    </div>
</template>

<style scoped>

</style>