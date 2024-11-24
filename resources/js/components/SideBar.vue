<script setup lang="ts">
import DarkModeButton from "./DarkModeButton.vue";
import CanvasLeftPanel from "./CanvasLeftPanel.vue";
import CanvasTopPanel from "@/js/components/CanvasTopPanel.vue";
import {useCanvasStore} from "@/js/stores/canvasStore";

const canvasStore = useCanvasStore();
</script>

<template>
    <nav class="fixed top-0 z-50 h-16 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div class="px-3 py-3 lg:px-5 lg:pl-3">
            <div class="flex items-center justify-between">
                <div class="flex items-center justify-start rtl:justify-end">
                    <button data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar" type="button"
                            class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                        <span class="sr-only">Open sidebar</span>
                        <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path clip-rule="evenodd" fill-rule="evenodd"
                                  d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                        </svg>
                    </button>
                    <div class="flex ms-2 md:me-24">
                        <span class="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">Visual Editor</span>
                    </div>
                </div>
                <div class="flex items-center">
                    <CanvasTopPanel/>
                </div>
            </div>
        </div>
    </nav>
    <aside id="logo-sidebar"
           class="fixed top-0 left-0 z-40 w-64 h-screen pt-16 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
           aria-label="Sidebar">
        <div class="h-full p-3 overflow-y-auto bg-white dark:bg-gray-800">
            <ul class="space-y-2 font-medium">
                <li>
                    <a href="#" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                        <svg class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true"
                             xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
                            <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z"/>
                            <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z"/>
                        </svg>
                        <span class="ms-3">Dashboard</span>
                    </a>
                </li>
                <li>
                    <DarkModeButton/>
                </li>
                <li>
                    <button @click="()=>canvasStore.debug = !canvasStore.debug"
                            class="w-full flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group color-danger-500"
                            :class="canvasStore.debug ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                             class="size-5 w-5 h-5"
                        >
                            <path fill-rule="evenodd"
                                  d="M6.56 1.14a.75.75 0 0 1 .177 1.045 3.989 3.989 0 0 0-.464.86c.185.17.382.329.59.473A3.993 3.993 0 0 1 10 2c1.272 0 2.405.594 3.137 1.518.208-.144.405-.302.59-.473a3.989 3.989 0 0 0-.464-.86.75.75 0 0 1 1.222-.869c.369.519.65 1.105.822 1.736a.75.75 0 0 1-.174.707 7.03 7.03 0 0 1-1.299 1.098A4 4 0 0 1 14 6c0 .52-.301.963-.723 1.187a6.961 6.961 0 0 1-1.158.486c.13.208.231.436.296.679 1.413-.174 2.779-.5 4.081-.96a19.655 19.655 0 0 0-.09-2.319.75.75 0 1 1 1.493-.146 21.239 21.239 0 0 1 .08 3.028.75.75 0 0 1-.482.667 20.873 20.873 0 0 1-5.153 1.249 2.521 2.521 0 0 1-.107.247 20.945 20.945 0 0 1 5.252 1.257.75.75 0 0 1 .482.74 20.945 20.945 0 0 1-.908 5.107.75.75 0 0 1-1.433-.444c.415-1.34.69-2.743.806-4.191-.495-.173-1-.327-1.512-.46.05.284.076.575.076.873 0 1.814-.517 3.312-1.426 4.37A4.639 4.639 0 0 1 10 19a4.639 4.639 0 0 1-3.574-1.63C5.516 16.311 5 14.813 5 13c0-.298.026-.59.076-.873-.513.133-1.017.287-1.512.46.116 1.448.39 2.85.806 4.191a.75.75 0 1 1-1.433.444 20.94 20.94 0 0 1-.908-5.107.75.75 0 0 1 .482-.74 20.838 20.838 0 0 1 5.252-1.257 2.493 2.493 0 0 1-.107-.247 20.874 20.874 0 0 1-5.153-1.249.75.75 0 0 1-.482-.667 21.342 21.342 0 0 1 .08-3.028.75.75 0 1 1 1.493.146 19.745 19.745 0 0 0-.09 2.319c1.302.46 2.668.786 4.08.96.066-.243.166-.471.297-.679a6.962 6.962 0 0 1-1.158-.486A1.348 1.348 0 0 1 6 6a4 4 0 0 1 .166-1.143 7.032 7.032 0 0 1-1.3-1.098.75.75 0 0 1-.173-.707 5.48 5.48 0 0 1 .822-1.736.75.75 0 0 1 1.046-.177Z"
                                  clip-rule="evenodd"/>
                        </svg>
                        <span class="ms-3">Debug is {{ canvasStore.debug ? 'ON' : 'OFF' }}</span>
                    </button>
                </li>
                <li v-if="canvasStore.debug">
                    <button @click="canvasStore.initRandomElements" type="button"
                            class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                    >Regenerate Elements
                    </button>
                </li>
            </ul>
            <ul v-if="canvasStore.debug"
                class="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
                <li>
                    <CanvasLeftPanel />
                </li>
            </ul>
        </div>
    </aside>
</template>