// export const PortTypes = {
//     INPUT_PORT: "input",
//     OUTPUT_PORT: "output",
// };
//
// export interface InputPort {
//     type: typeof PortTypes.INPUT_PORT,
//     color: 'red',
// }
//
// export interface OutputPort {
//     type: typeof PortTypes.OUTPUT_PORT,
//     color: 'green',
// }

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
    element: Item | null,
    lastMouseX: number | null,
    lastMouseY: number | null,
    startPoint: Point,
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