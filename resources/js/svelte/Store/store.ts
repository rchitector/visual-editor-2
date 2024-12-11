import {derived, get, writable} from 'svelte/store';
import {
    ITEMS_RECTANGLE_PADDING,
    ItemTypes,
    PortType,
    ZOOM_LEVEL_DEFAULT,
    ZOOM_LEVEL_MAX,
    ZOOM_LEVEL_MIN,
    ZOOM_MANUAL_LEVELS
} from '@/js/stores/constants'
import {GlobalState, Point} from "@/js/interfaces";
import {v4 as uuidv4} from "uuid";

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
export const allElementsRect = derived(store, ($store) => {
    let elementsRect = {x: 0, y: 0, width: 0, height: 0, center: {x: 0, y: 0}};
    if (Object.keys($store.elements).length) {
        let minX: number = Infinity;
        let minY: number = Infinity;
        let maxX: number = -Infinity;
        let maxY: number = -Infinity;
        for (const [key, element] of Object.entries($store.elements)) {
            minX = Math.min(minX, element.x);
            minY = Math.min(minY, element.y);
            maxX = Math.max(maxX, element.x + element.w);
            maxY = Math.max(maxY, element.y + element.h);
        }
        let _minX = Math.min(minX, maxX) - ITEMS_RECTANGLE_PADDING;
        let _minY = Math.min(minY, maxY) - ITEMS_RECTANGLE_PADDING;
        let _maxX = Math.max(minX, maxX) + ITEMS_RECTANGLE_PADDING;
        let _maxY = Math.max(minY, maxY) + ITEMS_RECTANGLE_PADDING;
        elementsRect = {
            x: _minX,
            y: _minY,
            width: _maxX - _minX,
            height: _maxY - _minY,
            center: {
                x: _minX + (_maxX - _minX) / 2,
                y: _minY + (_maxY - _minY) / 2,
            }
        };
    }
    return elementsRect;
});
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
export const zoomFit = (): void => {
    store.update(state => {
        const itemsRect = get(allElementsRect);
        const scaleX = state.mainBoxRect.width / itemsRect.width;
        const scaleY = state.mainBoxRect.height / itemsRect.height;
        const updatedZoom = {
            previous: state.zoom.value,
            value: Math.max(ZOOM_LEVEL_MIN, Math.min(Math.min(scaleX, scaleY) * 100, ZOOM_LEVEL_DEFAULT)),
        };
        const center = get(mainBoxRectCenter);
        const newCanvasMatrix = {
            scale: updatedZoom.value / 100,
            x: (0 - itemsRect.center.x * updatedZoom.value / 100 + center.x),
            y: (0 - itemsRect.center.y * updatedZoom.value / 100 + center.y),
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

export const documentPointToRelatedToCanvasZeroPoint = (documentPointX, documentPointY): Point => {
    return {
        x: (documentPointX - get(store).mainBoxRect.x - get(store).canvasMatrix.x) / get(store).canvasMatrix.scale,
        y: (documentPointY - get(store).mainBoxRect.y - get(store).canvasMatrix.y) / get(store).canvasMatrix.scale,
    };
};

export const createElementGlobal = (documentX: number, documentY: number, elementType: ItemTypes) => {
    const newElementPosition = documentPointToRelatedToCanvasZeroPoint(documentX, documentY);
    createElementRelated(newElementPosition.x, newElementPosition.y, elementType);
};
export const createElementRelated = (relatedX: number, relatedY: number, elementType: ItemTypes) => {
    const elementId = uuidv4();
    const portId = uuidv4();
    store.update(state => {
        state.elements[elementId] = {
            id: elementId,
            x: relatedX,
            y: relatedY,
            w: 0,
            h: 0,
            onTop: true,
            type: elementType,
            ports: {
                [portId]: {
                    id: portId,
                    index: 1,
                    titlePrefix: 'Action Output',
                    type: PortType.ActionOutputt,
                    active: false,
                    disabled: true
                },
            }
        };
        return state;
    });
};
