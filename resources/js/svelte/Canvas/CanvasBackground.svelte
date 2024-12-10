<script>
    import {store} from '@/js/svelte/Store/store';
    import {BG_CELL_SIZE} from "@/js/stores/constants";
</script>

<svg class="absolute left-0 top-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
    <pattern id="grid-pattern" patternUnits="userSpaceOnUse"
             x={$store.canvasMatrix.x}
             y={$store.canvasMatrix.y}
             width={BG_CELL_SIZE * $store.canvasMatrix.scale}
             height={BG_CELL_SIZE * $store.canvasMatrix.scale}>
        <line opacity={Math.min($store.canvasMatrix.scale, 1)}
              class="stroke-gray-200 dark:stroke-gray-700"
              x1="0"
              y1="0"
              x2="100"
              y2="0"></line>
        <line opacity={Math.min($store.canvasMatrix.scale, 1)}
              class="stroke-gray-200 dark:stroke-gray-700"
              x1="0"
              y1="0"
              x2="0"
              y2="100"></line>
    </pattern>
    <rect fill="url(#grid-pattern)" width="100%" height="100%"></rect>
</svg>
