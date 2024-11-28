export interface Item {
    id: string;
    x: number;
    y: number;
    w: number;
    h: number;
    onTop: boolean;
}

export interface Point {
    x: number;
    y: number;
}

export interface GlobalState {
    dragging: {
        is: boolean,
        element: HTMLElement | null,
    },
    canvasBoxRect: {
        exists: boolean,
        width: number,
        height: number,
        top: number,
        left: number,
        x: number,
        y: number,
    },
    element: Item | null,
    lastMouseX: number | null,
    lastMouseY: number | null,
    // startPoint: Point,
    canvasTranslateX: number,
    canvasTranslateY: number,
    scaleRelatedX: number,
    scaleRelatedY: number,
    items: Item[],
    zoom: {
        previous: number,
        value: number,
    },
    debug: boolean,
    rectCenterX: number,
    rectCenterY: number,
    clientX: number,
    clientY: number,
    minX: number,
    minY: number,
    maxX: number,
    maxY: number,
}