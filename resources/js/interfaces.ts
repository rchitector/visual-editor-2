import {DraggingTypes, ItemTypes} from "@/js/stores/constants";

export interface Item {
    id: string;
    x: number;
    y: number;
    w: number;
    h: number;
    onTop: boolean;
    type: ItemTypes | null;
}

export interface Point {
    x: number;
    y: number;
}

export interface Matrix {
    x: number;
    y: number;
    scale: number;
}

export interface Line {
    id: string;
    startId: string;
    startX: number;
    startY: number;
    endId: string;
    endX: number;
    endY: number;
}

export interface GlobalState {
    debug: boolean,
    canvasMatrix: Matrix,
    items: Item[],
    lines: Line[],
    zoom: {
        previous: number,
        value: number,
    },
    dragging: {
        element: Point | null,
        pointerShift: Point | null,
        type: DraggingTypes | null,
    },
    mainBoxRect: {
        exists: boolean,
        width: number,
        height: number,
        top: number,
        left: number,
        x: number,
        y: number,
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
