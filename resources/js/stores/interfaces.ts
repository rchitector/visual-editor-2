import {DraggingTypes, ItemTypes, PortType} from "@/js/stores/constants";
import {Ref} from 'vue';

export interface Point {
    x: number;
    y: number;
}

export interface Matrix {
    x: number;
    y: number;
    scale: number;
}

export interface Port {
    elementId: string;
    id: string;
    type: PortType;
    title: string;
    active: boolean;
    disabled: boolean;
    connection: {
        x: number;
        y: number;
    };
}

export interface Element {
    id: string;
    x: Ref<number>;
    y: Ref<number>;
    w: number;
    h: number;
    onTop: boolean;
    type: ItemTypes;
    ports: {
        action: {
            inputs: [portId: string],
            outputs: [portId: string],
        },
        data: {
            inputs: [portId: string],
            outputs: [portId: string],
        },
    }
}

export interface Line {
    id: string;
    start: {
        elementId: string;
        portId: string;
        x: Ref<number>;
        y: Ref<number>;
    }
    end: {
        elementId: string;
        portId: string;
        x: Ref<number>;
        y: Ref<number>;
    }
}

export interface GlobalState {
    debug: boolean,
    canvasMatrix: Matrix,
    elements: {
        [elementId: string]: Element;
    },
    lines: {
        [lineId: string]: Line;
    },
    zoom: {
        previous: number,
        value: number,
    },
    dragging: {
        element: Point | null,
        startPoint: Point | null,
        type: DraggingTypes | null,
    },
    mainBoxRect: {
        x: number,
        y: number,
        width: number,
        height: number,
    },
    startPoint: {
        x: number | null,
        y: number | null,
    },
    documentPoint: Point,
    documentLastPoint: Point,
    itemsRect: { x: number, y: number, width: number, height: number, center: Point },
    itemType: ItemTypes | null,
}
