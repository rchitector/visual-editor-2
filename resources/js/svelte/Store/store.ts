import {get, writable} from 'svelte/store';
import {
    ITEMS_RECTANGLE_PADDING,
    ItemTypes,
    PortType,
    ZOOM_LEVEL_DEFAULT,
    ZOOM_LEVEL_MAX,
    ZOOM_LEVEL_MIN,
    ZOOM_MANUAL_LEVELS
} from '@/js/stores/constants'
import {Element, Line, Point, Port} from "@/js/interfaces";
import {v4 as uuidv4} from "uuid";
//////////////////////////////////////////////////////////////////////
export const debugStore = writable<boolean>(false);
export const toggleDebug = () => {
    debugStore.update(state => !state);
};
//////////////////////////////////////////////////////////////////////
export const mainBoxRect = writable({x: 0, y: 0, width: 0, height: 0});
export const updateMainBoxRect = (rect: DOMRect): void => {
    mainBoxRect.set({x: rect.x, y: rect.y, width: rect.width, height: rect.height});
};
//////////////////////////////////////////////////////////////////////
export const elementsStore = writable<{ [id: string]: Element }>({});
//////////////////////////////////////////////////////////////////////
export const portsStore = writable<{ [id: string]: Port }>({});

export function filterAndGroupPortsByType(
    ports: { [uuid: string]: Port },
    uuids: string[]
): {
    actionOutputs: { [uuid: string]: Port };
    actionInputs: { [uuid: string]: Port };
    dataOutputs: { [uuid: string]: Port };
    dataInputs: { [uuid: string]: Port };
} {
    const actionOutputs: { [uuid: string]: Port } = {};
    const actionInputs: { [uuid: string]: Port } = {};
    const dataOutputs: { [uuid: string]: Port } = {};
    const dataInputs: { [uuid: string]: Port } = {};

    // Фильтрация и разделение
    Object.entries(ports)
        .filter(([uuid]) => uuids.includes(uuid))
        .forEach(([uuid, port]) => {
            switch (port.type) {
                case PortType.ActionOutput:
                    actionOutputs[uuid] = port;
                    break;
                case PortType.ActionInput:
                    actionInputs[uuid] = port;
                    break;
                case PortType.DataOutput:
                    dataOutputs[uuid] = port;
                    break;
                case PortType.DataInput:
                    dataInputs[uuid] = port;
                    break;
            }
        });

    return {
        actionOutputs,
        actionInputs,
        dataOutputs,
        dataInputs,
    };
}

//////////////////////////////////////////////////////////////////////
export const linesStore = writable<{ [id: string]: Line }>({});
//////////////////////////////////////////////////////////////////////
export const canvasMatrix = writable({x: 0, y: 0, scale: 1});
//////////////////////////////////////////////////////////////////////
export const zoom = writable({previous: ZOOM_LEVEL_DEFAULT, value: ZOOM_LEVEL_DEFAULT});
//////////////////////////////////////////////////////////////////////
export const nextZoomManualLevel = (currentZoomValue) => {
    const filtered = ZOOM_MANUAL_LEVELS.filter(num => num > currentZoomValue)
    return filtered.length ? Math.min(...filtered) : ZOOM_LEVEL_MAX;
};
export const previousZoomManualLevel = (currentZoomValue) => {
    const filtered = ZOOM_MANUAL_LEVELS.filter(num => num < currentZoomValue)
    return filtered.length ? Math.max(...filtered) : ZOOM_LEVEL_MIN;
};

export const allElementsRect = () => {
    let elementsRect = {x: 0, y: 0, width: 0, height: 0, center: {x: 0, y: 0}};
    const elements = get(elementsStore);
    if (Object.keys(elements).length) {
        let minX: number = Infinity;
        let minY: number = Infinity;
        let maxX: number = -Infinity;
        let maxY: number = -Infinity;
        for (const [key, element] of Object.entries(elements)) {
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
}

export const zoomFit = (): void => {
    const rect = get(mainBoxRect);
    const itemsRect = allElementsRect();

    const newZoomValue = Math.max(ZOOM_LEVEL_MIN, Math.min(Math.min(rect.width / itemsRect.width, rect.height / itemsRect.height) * 100, ZOOM_LEVEL_DEFAULT));

    zoom.set({
        previous: get(canvasMatrix).scale * 100,
        value: newZoomValue
    });

    canvasMatrix.set({
        scale: newZoomValue / 100,
        x: (0 - itemsRect.center.x * newZoomValue / 100 + (rect.width / 2)),
        y: (0 - itemsRect.center.y * newZoomValue / 100 + (rect.height / 2)),
    });
};

export const zoomIn = (scaleRelatedX: number | null = null, scaleRelatedY: number | null = null): void => {
    const currentZoom = get(zoom).value;
    const newZoomLevel = nextZoomManualLevel(currentZoom);
    if (newZoomLevel !== currentZoom) {
        setZoom(newZoomLevel, scaleRelatedX, scaleRelatedY);
    }
};
export const zoomOut = (scaleRelatedX: number | null = null, scaleRelatedY: number | null = null): void => {
    const currentZoom = get(zoom).value;
    const newZoomLevel = previousZoomManualLevel(currentZoom);
    if (newZoomLevel !== currentZoom) {
        setZoom(newZoomLevel, scaleRelatedX, scaleRelatedY);
    }
};
export const setZoom = (newZoomLevel: number, scaleRelatedX: number | null = null, scaleRelatedY: number | null = null): void => {
    const zoomValue = Math.min(ZOOM_LEVEL_MAX, Math.max(ZOOM_LEVEL_MIN, newZoomLevel));
    const zoomStore = get(zoom);

    zoom.set({previous: zoomStore.value, value: zoomValue});

    canvasMatrix.update(state => {
        scaleRelatedX = scaleRelatedX || get(mainBoxRect).width / 2;
        scaleRelatedY = scaleRelatedY || get(mainBoxRect).height / 2;
        const coefficient = zoomValue / zoomStore.value - 1;
        return {
            scale: zoomValue / 100,
            x: Math.round(state.x - (scaleRelatedX - state.x) * coefficient),
            y: Math.round(state.y - (scaleRelatedY - state.y) * coefficient),
        }
    });
};

export const documentPointToRelatedToCanvasZeroPoint = (documentPointX, documentPointY): Point => {
    const mbr = get(mainBoxRect);
    const cm = get(canvasMatrix);
    return {
        x: (documentPointX - mbr.x - cm.x) / cm.scale,
        y: (documentPointY - mbr.y - cm.y) / cm.scale,
    };
};

export const createElementGlobal = (documentX: number, documentY: number, elementType: ItemTypes) => {
    const newElementPosition = documentPointToRelatedToCanvasZeroPoint(documentX, documentY);
    createElementRelated(newElementPosition.x, newElementPosition.y, elementType);
};

export const createElementRelated = (relatedX: number, relatedY: number, elementType: ItemTypes) => {

    const baseElement = {
        id: uuidv4(),
        x: relatedX,
        y: relatedY,
        w: 0,
        h: 0,
        onTop: true,
        type: elementType,
        ports: []
    };

    let portIndex = 0;
    const ports = [
        {
            id: uuidv4(),
            index: portIndex++,
            titlePrefix: 'Action Input',
            type: PortType.ActionInput,
            active: true,
            disabled: true
        },
        {
            id: uuidv4(),
            index: portIndex++,
            titlePrefix: 'Action Input',
            type: PortType.ActionInput,
            active: true,
            disabled: false
        },
        {
            id: uuidv4(),
            index: portIndex++,
            titlePrefix: 'Action Input',
            type: PortType.ActionInput,
            active: false,
            disabled: true
        },
        {
            id: uuidv4(),
            index: portIndex++,
            titlePrefix: 'Action Input',
            type: PortType.ActionInput,
            active: false,
            disabled: false
        },
        {
            id: uuidv4(),
            index: portIndex++,
            titlePrefix: 'Action Output',
            type: PortType.ActionOutput,
            active: true,
            disabled: true
        },
        {
            id: uuidv4(),
            index: portIndex++,
            titlePrefix: 'Action Output',
            type: PortType.ActionOutput,
            active: true,
            disabled: false
        },
        {
            id: uuidv4(),
            index: portIndex++,
            titlePrefix: 'Action Output',
            type: PortType.ActionOutput,
            active: false,
            disabled: true
        },
        {
            id: uuidv4(),
            index: portIndex++,
            titlePrefix: 'Action Output',
            type: PortType.ActionOutput,
            active: false,
            disabled: false
        },
        {
            id: uuidv4(),
            index: portIndex++,
            titlePrefix: 'Data Input',
            type: PortType.DataInput,
            active: true,
            disabled: true
        },
        {
            id: uuidv4(),
            index: portIndex++,
            titlePrefix: 'Data Input',
            type: PortType.DataInput,
            active: true,
            disabled: false
        },
        {
            id: uuidv4(),
            index: portIndex++,
            titlePrefix: 'Data Input',
            type: PortType.DataInput,
            active: false,
            disabled: true
        },
        {
            id: uuidv4(),
            index: portIndex++,
            titlePrefix: 'Data Input',
            type: PortType.DataInput,
            active: false,
            disabled: false
        },
        {
            id: uuidv4(),
            index: portIndex++,
            titlePrefix: 'Data Output',
            type: PortType.DataOutput,
            active: true,
            disabled: true
        },
        {
            id: uuidv4(),
            index: portIndex++,
            titlePrefix: 'Data Output',
            type: PortType.DataOutput,
            active: true,
            disabled: false
        },
        {
            id: uuidv4(),
            index: portIndex++,
            titlePrefix: 'Data Output',
            type: PortType.DataOutput,
            active: false,
            disabled: true
        },
        {
            id: uuidv4(),
            index: portIndex++,
            titlePrefix: 'Data Output',
            type: PortType.DataOutput,
            active: false,
            disabled: false
        },
    ];
    ports.forEach(port => {
        baseElement.ports.push(port.id);
        portsStore.update(state => {
            state[port.id] = {
                elementId: baseElement.id,
                id: port.id,
                type: port.type,
                title: `${port.titlePrefix} ${port.index}`,
                active: port.active,
                disabled: port.disabled,
                connection: {x: 0, y: 0},
            };
            return state;
        });
    });

    elementsStore.update(state => {
        state[baseElement.id] = baseElement;
        return state;
    });

    return baseElement;
};

// export function getDerivedElementRectById(elementId) {
//     return derived(
//         store,
//         ($store) => {
//             const element = $store.elements[elementId];
//             if (!element) {
//                 return {x: null, y: null, w: null, h: null};
//             }
//             return {
//                 x: element.x,
//                 y: element.y,
//                 w: element.w,
//                 h: element.h,
//             };
//         }
//     );
// }

