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
    debug: boolean,
    items: Item[],
    zoom: {
        previous: number,
        value: number,
    },
    dragging: {
        is: boolean,
        element: Item | null,
    },
    globalBoxRect: {
        exists: boolean,
        width: number,
        height: number,
        top: number,
        left: number,
        x: number,
        y: number,
    },
    documentPoint: Point,
    documentLastPoint: Point,
    canvasTranslateX: number,
    canvasTranslateY: number,
    itemsRect: { x: number, y: number, width: number, height: number, center: Point }
}