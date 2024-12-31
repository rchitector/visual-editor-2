import {get, writable} from 'svelte/store';
import {
    ITEMS_RECTANGLE_PADDING,
    ItemTypes,
    PortType,
    ZOOM_LEVEL_DEFAULT,
    ZOOM_LEVEL_MAX,
    ZOOM_LEVEL_MIN,
    ZOOM_MANUAL_LEVELS
} from '@/js/svelte/Store/constants'
import {Element, Point} from "@/js/svelte/Store/interfaces";
import {v4 as uuidv4} from "uuid";
import {addElement} from "@/js/svelte/Store/elementsStore";
import {addPort} from "@/js/svelte/Store/portsStore";
//////////////////////////////////////////////////////////////////////
export const newLineStartPort = writable({
    id: null,
    end: {
        portId: null,
        x: null,
        y: null,
    }
});
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
        onTop: false,
        type: elementType,
        ports: {
            action: {
                inputs: [],
                outputs: [],
            },
            data: {
                inputs: [],
                outputs: [],
            },
        }
    };

    let portIndex = 0;
    const ports = [
        {
            id: uuidv4(),
            index: portIndex++,
            title: `Action Input ${portIndex}`,
            type: PortType.ActionInput,
            active: false,
            disabled: false
        },
        {
            id: uuidv4(),
            index: portIndex++,
            title: `Action Input ${portIndex}`,
            type: PortType.ActionInput,
            active: false,
            disabled: false
        },
        {
            id: uuidv4(),
            index: portIndex++,
            title: `Action Input ${portIndex}`,
            type: PortType.ActionInput,
            active: false,
            disabled: false
        },
        {
            id: uuidv4(),
            index: portIndex++,
            title: `Action Input ${portIndex}`,
            type: PortType.ActionInput,
            active: false,
            disabled: false
        },
        {
            id: uuidv4(),
            index: portIndex++,
            title: `Action Output ${portIndex}`,
            type: PortType.ActionOutput,
            active: false,
            disabled: false
        },
        {
            id: uuidv4(),
            index: portIndex++,
            title: `Action Output ${portIndex}`,
            type: PortType.ActionOutput,
            active: false,
            disabled: false
        },
        {
            id: uuidv4(),
            index: portIndex++,
            title: `Action Output ${portIndex}`,
            type: PortType.ActionOutput,
            active: false,
            disabled: false
        },
        {
            id: uuidv4(),
            index: portIndex++,
            title: `Action Output ${portIndex}`,
            type: PortType.ActionOutput,
            active: false,
            disabled: false
        },
        {
            id: uuidv4(),
            index: portIndex++,
            title: `Data Input ${portIndex}`,
            type: PortType.DataInput,
            active: false,
            disabled: false
        },
        {
            id: uuidv4(),
            index: portIndex++,
            title: `Data Input ${portIndex}`,
            type: PortType.DataInput,
            active: false,
            disabled: false
        },
        {
            id: uuidv4(),
            index: portIndex++,
            title: `Data Input ${portIndex}`,
            type: PortType.DataInput,
            active: false,
            disabled: false
        },
        {
            id: uuidv4(),
            index: portIndex++,
            title: `Data Input ${portIndex}`,
            type: PortType.DataInput,
            active: false,
            disabled: false
        },
        {
            id: uuidv4(),
            index: portIndex++,
            title: `Data Output ${portIndex}`,
            type: PortType.DataOutput,
            active: false,
            disabled: false
        },
        {
            id: uuidv4(),
            index: portIndex++,
            title: `Data Output ${portIndex}`,
            type: PortType.DataOutput,
            active: false,
            disabled: false
        },
        {
            id: uuidv4(),
            index: portIndex++,
            title: `Data Output ${portIndex}`,
            type: PortType.DataOutput,
            active: false,
            disabled: false
        },
        {
            id: uuidv4(),
            index: portIndex++,
            title: `Data Output ${portIndex}`,
            type: PortType.DataOutput,
            active: false,
            disabled: false
        },
    ];
    ports.forEach(port => {
        switch (port.type) {
            case PortType.ActionInput:
                baseElement.ports.action.inputs.push(port.id);
                break;
            case PortType.ActionOutput:
                baseElement.ports.action.outputs.push(port.id);
                break;
            case PortType.DataInput:
                baseElement.ports.data.inputs.push(port.id);
                break;
            case PortType.DataOutput:
                baseElement.ports.data.outputs.push(port.id);
                break
        }

        addPort({
            elementId: baseElement.id,
            id: port.id,
            type: port.type,
            title: port.title,
            active: port.active,
            disabled: port.disabled,
        });
    });

    addElement(baseElement);

    return baseElement;
};
