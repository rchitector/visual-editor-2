export const PortTypes = {
    INPUT_PORT: "input",
    OUTPUT_PORT: "output",
};

export interface InputPort {
    type: typeof PortTypes.INPUT_PORT,
    color: 'red',
}

export interface OutputPort {
    type: typeof PortTypes.OUTPUT_PORT,
    color: 'green',
}

export interface Item {
    id: string;
    x: number;
    y: number;
    onTop: boolean;
    ports: {
        in: InputPort[];
        out: OutputPort[];
    },
}

export interface CanvasState {
    baseCellSize: number;
    defaultScale: number;
    scaleStep: number;
    minScale: number;
    maxScale: number;
    isDraggingCanvas: boolean;
    draggingElement: Item | null;
    lastMouseX: number | null;
    lastMouseY: number | null;
    canvasTranslateX: number;
    canvasTranslateY: number;
    canvasScale: number;
    items: Item[];
}