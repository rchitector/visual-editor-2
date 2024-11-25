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
    w: number;
    h: number;
    onTop: boolean;
    ports: {
        in: InputPort[];
        out: OutputPort[];
    },
}

export interface CanvasState {
    baseCellSize: number;
    isDraggingCanvas: boolean;
    draggingElement: Item | null;
    lastMouseX: number | null;
    lastMouseY: number | null;
    canvasTranslateX: number;
    canvasTranslateY: number;
    scaleRelatedX: number;
    scaleRelatedY: number;
    items: Item[];
    zoomLevelPrevious: number,
    zoomLevelDefault: number,
    zoomLevel: number,
    zoomLevelMin: 1,
    zoomLevelMax: 400,
    zoomManualLevels: number[],
    zoomLevelsVisible: number[],
    debug: boolean,
    rectCenterX: number,
    rectCenterY: number,
    clientX: number,
    clientY: number,
    clientZoomedX: number,
    clientZoomedY: number,
    minX: number,
    minY: number,
    maxX: number,
    maxY: number,
}