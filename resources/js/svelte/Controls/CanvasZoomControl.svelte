<script lang="ts">
    import {setZoom, store, zoomFit, zoomIn, zoomOut} from '@/js/svelte/Store/store.ts';
    import {ZOOM_VISIBLE_LEVELS} from "@/js/stores/constants";
</script>

<div
    class="absolute right-5 bottom-5 rounded-lg border border-gray-200 dark:border-gray-700 p-2 bg-white dark:bg-gray-800">

    <div class="gap-1 flex items-center">
        <button on:click={()=>zoomOut()}
                type="button"
                class="p-2 text-gray-900 rounded-lg dark:text-white bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 group">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                 stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM13.5 10.5h-6"/>
            </svg>
        </button>

        <button id="dropdownTopButton" data-dropdown-toggle="dropdownTop" data-dropdown-placement="top"
                class="text-gray-900 dark:text-white px-3 py-2.5 ps-1 text-center inline-flex items-center rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                type="button">
            <div class="w-16">{ Math.round($store.zoom.value) }%</div>
        </button>
        <div id="dropdownTop"
             class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
            <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownTopButton">
                <li>
                    <button on:click={()=>zoomFit()} type="button"
                            class="w-full block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                             stroke="currentColor" class="size-5">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                  d="M7.5 3.75H6A2.25 2.25 0 0 0 3.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0 1 20.25 6v1.5m0 9V18A2.25 2.25 0 0 1 18 20.25h-1.5m-9 0H6A2.25 2.25 0 0 1 3.75 18v-1.5M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                        </svg>
                        <span>fit</span>
                    </button>
                </li>
                {#each ZOOM_VISIBLE_LEVELS as level}
                    <li>
                        <button on:click={()=>setZoom(level)} type="button"
                                class="w-full block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                 stroke="currentColor" class="size-4">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
                            </svg>
                            <div class="">{ level }%</div>
                        </button>
                    </li>
                {/each}
            </ul>
        </div>

        <button on:click={()=>zoomIn()} type="button"
                class="p-2 text-gray-900 rounded-lg dark:text-white bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 group">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                 stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6"/>
            </svg>
        </button>
    </div>

</div>
