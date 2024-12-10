import {derived, get, writable} from 'svelte/store';
import {ZOOM_LEVEL_DEFAULT, ZOOM_LEVEL_MAX, ZOOM_LEVEL_MIN, ZOOM_MANUAL_LEVELS} from '@/js/stores/constants'
import {GlobalState} from "@/js/interfaces";

export const store = writable<GlobalState>({
    debug: false,
    mainBoxRect: {x: 0, y: 0, width: 0, height: 0},
    documentPoint: {x: 0, y: 0},
    canvasMatrix: {x: 0, y: 0, scale: 1},
    elements: {},
    lines: {},
    items: [],
    zoom: {
        previous: ZOOM_LEVEL_DEFAULT,
        value: ZOOM_LEVEL_DEFAULT,
    },
    dragging: {
        type: null,
        element: null,
        startPoint: null,
    },
    startPoint: {x: 0, y: 0},
    documentLastPoint: {x: 0, y: 0},
    itemsRect: {x: 0, y: 0, width: 0, height: 0, center: {x: 0, y: 0}},
    itemType: null,
});
export const toggleDebug = () => {
    store.update(state => ({...state, debug: !state.debug}));
};
export const updateMainBoxRect = (rect: DOMRect): void => {
    store.update(state => ({
        ...state, mainBoxRect: {
            ...state.mainBoxRect,
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
        }
    }));
};
export const nextZoomManualLevel = derived(store, ($store) => {
    const filtered = ZOOM_MANUAL_LEVELS.filter(num => num > $store.zoom.value)
    return filtered.length ? Math.min(...filtered) : ZOOM_LEVEL_MAX;
});
export const previousZoomManualLevel = derived(store, ($store) => {
    const filtered = ZOOM_MANUAL_LEVELS.filter(num => num < $store.zoom.value)
    return filtered.length ? Math.max(...filtered) : ZOOM_LEVEL_MIN;
});
export const zoomIn = (scaleRelatedX: number | null = null, scaleRelatedY: number | null = null): void => {
    const newZoomLevel = get(nextZoomManualLevel);
    if (newZoomLevel !== get(store).zoom.value) {
        setZoom(newZoomLevel, scaleRelatedX, scaleRelatedY);
    }
};
export const zoomOut = (scaleRelatedX: number | null = null, scaleRelatedY: number | null = null): void => {
    const newZoomLevel = get(previousZoomManualLevel);
    if (newZoomLevel !== get(store).zoom.value) {
        setZoom(newZoomLevel, scaleRelatedX, scaleRelatedY);
    }
};
export const setZoom = (newZoomLevel: number, scaleRelatedX: number | null = null, scaleRelatedY: number | null = null): void => {
    store.update(state => {
        const center = get(mainBoxRectCenter);
        scaleRelatedX = scaleRelatedX ?? center.x;
        scaleRelatedY = scaleRelatedY ?? center.y;

        const updatedZoom = {
            previous: state.zoom.value,
            value: Math.min(ZOOM_LEVEL_MAX, Math.max(ZOOM_LEVEL_MIN, newZoomLevel)),
        };

        const coefficient = updatedZoom.value / updatedZoom.previous - 1;

        const newCanvasMatrix = {
            scale: updatedZoom.value / 100,
            x: state.canvasMatrix.x - (scaleRelatedX - state.canvasMatrix.x) * coefficient,
            y: state.canvasMatrix.y - (scaleRelatedY - state.canvasMatrix.y) * coefficient,
        };

        return {
            ...state,
            zoom: updatedZoom,
            canvasMatrix: {
                ...newCanvasMatrix,
                x: Math.round(newCanvasMatrix.x),
                y: Math.round(newCanvasMatrix.y),
            },
        };
    });
};

export const mainBoxRectCenter = derived(store, ($store) => {
    return {
        x: $store.mainBoxRect.width / 2,
        y: $store.mainBoxRect.height / 2,
    };
});
