import { defineStore } from 'pinia';
import { v4 as uuidv4 } from "uuid";
import { getRandomIntInclusive } from "../helper.js";

interface Ports {
    in: any[];
    out: any[];
}

interface Item {
    id: string;
    onTop: boolean;
    x: number;
    y: number;
    color: string;
    ports: Ports;
}

interface CanvasState {
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

export const useCanvasStore = defineStore('canvas', {
    state: (): CanvasState => ({
        baseCellSize: 20,
        defaultScale: 1,
        scaleStep: -0.001,
        minScale: 0.05,
        maxScale: 10,
        isDraggingCanvas: false,
        draggingElement: null,
        lastMouseX: null,
        lastMouseY: null,
        canvasTranslateX: 0,
        canvasTranslateY: 0,
        canvasScale: 1,
        items: [],
    }),

    actions: {
        setOnTop(id: string): void {
            this.items.forEach((item: Item) => {
                item.onTop = item.id === id;
            });

            this.items.sort((a, b) => {
                if (a.onTop && !b.onTop) return 1;
                if (!a.onTop && b.onTop) return -1;
                return 0;
            });
        },

        initRandomElements(): void {
            this.items = [];
            for (let i = 1; i <= 10; i++) {
                this.items.push({
                    id: uuidv4(),
                    onTop: false,
                    x: getRandomIntInclusive(-300, 300),
                    y: getRandomIntInclusive(-300, 300),
                    color: `hsl(${Math.random() * 360}, 50%, 50%)`,
                    ports: {
                        in: [],
                        out: [],
                    }
                });
            }
        },
    },
});
