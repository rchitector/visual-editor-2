import {defineStore} from 'pinia';
import {v4 as uuidv4} from "uuid";
import {getRandomIntInclusive} from "../helper.js";
import {CanvasState, Item} from '../interfaces'

export const useCanvasStore = defineStore('canvas', {
    state: (): CanvasState => ({
        baseCellSize: 20,
        defaultScale: 1,
        scaleStep: 0.05,
        minScale: 0.05,
        maxScale: 10,
        isDraggingCanvas: false,
        draggingElement: null,
        lastMouseX: null,
        lastMouseY: null,
        canvasTranslateX: 0,
        canvasTranslateY: 0,
        scaleRelatedX: 0,
        scaleRelatedY: 0,
        canvasScale: 1,
        canvasPreviousScale: 1,
        items: [],
        zoomLevel: 100,
        zoomLevelMin: 1,
        zoomLevelMax: 400,
        zoomLevels: [1, 2, 3, 5, 10, 15, 20, 33, 50, 75, 100, 125, 150, 200, 250, 300, 400,],
        visibleZoomLevels: [50, 70, 100, 150, 200],
        debug: false,
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
        setZoomLevel(level: number): void {
            this.zoomLevel = Math.min(this.zoomLevelMax, Math.max(this.zoomLevelMin, level));
            console.log('setZoomLevel:', this.zoomLevel);

            const coefficient = (this.canvasScale / this.canvasPreviousScale - this.defaultScale);
            console.log('coefficient:', coefficient)
            if (level === 100) {
                this.canvasPreviousScale = this.canvasScale;
                this.canvasScale = 1
            }
        },
        zoomIn(): void {
            if (this.zoomLevel < this.zoomLevelMax) {
                this.zoomLevel = this.zoomLevels[this.zoomLevels.indexOf(this.zoomLevel) + 1];
            }
            console.log('zoomIn:', this.zoomLevel);
        },
        zoomOut(): void {
            if (this.zoomLevel > this.zoomLevelMin) {
                this.zoomLevel = this.zoomLevels[this.zoomLevels.indexOf(this.zoomLevel) - 1];
            }
            console.log('zoomOut:', this.zoomLevel);
        },
        zoomFit(): void {
            console.log('zoomFit:', this.zoomLevel);
        },
        zoom(vector, scaleRelatedX: number | null = null, scaleRelatedY: number | null = null): void {
            this.scaleRelatedX = scaleRelatedX;
            this.scaleRelatedY = scaleRelatedY;
            this.canvasPreviousScale = this.canvasScale;

            const newScale = this.canvasScale - vector * this.scaleStep;
            this.canvasScale = Math.min(this.maxScale, Math.max(this.minScale, newScale));
            console.log('newScale:', newScale);

            const coefficient = (this.canvasScale / this.canvasPreviousScale - this.defaultScale);
            console.log('coefficient:', coefficient)
            this.canvasTranslateX = this.canvasTranslateX - (scaleRelatedX - this.canvasTranslateX) * coefficient;
            this.canvasTranslateY = this.canvasTranslateY - (scaleRelatedY - this.canvasTranslateY) * coefficient;
        },

        initRandomElements(): void {
            this.items = [];
            for (let i = 1; i <= 10; i++) {
                this.items.push({
                    id: uuidv4(),
                    onTop: false,
                    x: getRandomIntInclusive(-300, 300),
                    y: getRandomIntInclusive(-300, 300),
                    ports: {
                        in: [],
                        out: [],
                    }
                });
            }
        },
    },
});
