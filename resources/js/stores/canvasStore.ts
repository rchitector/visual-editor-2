import {defineStore} from 'pinia';
import {v4 as uuidv4} from "uuid";
import {getRandomIntInclusive} from "../helper.js";
import {CanvasState, Item} from '../interfaces'

export const useCanvasStore = defineStore('canvas', {
    state: (): CanvasState => ({
        baseCellSize: 20,
        isDraggingCanvas: false,
        draggingElement: null,
        lastMouseX: null,
        lastMouseY: null,
        canvasTranslateX: 0,
        canvasTranslateY: 0,
        scaleRelatedX: 0,
        scaleRelatedY: 0,
        items: [],
        zoomLevelDefault: 100,
        zoomLevelPrevious: 100,
        zoomLevel: 100,
        zoomLevelMin: 1,
        zoomLevelMax: 400,
        zoomLevels: [1, 2, 3, 5, 10, 15, 20, 33, 50, 75, 100, 125, 150, 200, 250, 300, 400],
        zoomLevelsVisible: [50, 70, 100, 150, 200],
        debug: true,
        rectCenterX: 0,
        rectCenterY: 0,
    }),
    actions: {
        updateZoomLevel(value: number) {
            this.zoomLevelPrevious = this.zoomLevel;
            this.zoomLevel = value;
        },
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
        updateWindowSize(rect: DOMRect): void {
            this.rectCenterX = rect.width / 2;
            this.rectCenterY = rect.height / 2;

            this.scaleRelatedX = this.rectCenterX;
            this.scaleRelatedY = this.rectCenterY;
        },
        updateCanvasTranslate(scaleRelatedX: number | null = null, scaleRelatedY: number | null = null): void {
            this.scaleRelatedX = scaleRelatedX ?? this.rectCenterX;
            this.scaleRelatedY = scaleRelatedY ?? this.rectCenterY;
            const coefficient = ((this.zoomLevel / 100) / (this.zoomLevelPrevious / 100) - (this.zoomLevelDefault / 100));
            this.canvasTranslateX = this.canvasTranslateX - (this.scaleRelatedX - this.canvasTranslateX) * coefficient + (this.rectCenterX * coefficient);
            this.canvasTranslateY = this.canvasTranslateY - (this.scaleRelatedY - this.canvasTranslateY) * coefficient + (this.rectCenterY * coefficient);
        },
        setZoom(level: number): void {
            this.updateZoomLevel(Math.min(this.zoomLevelMax, Math.max(this.zoomLevelMin, level)));
            this.updateCanvasTranslate();
        },
        zoomIn(): void {
            if (this.zoomLevel < this.zoomLevelMax) {
                this.updateZoomLevel(this.zoomLevels[this.zoomLevels.indexOf(this.zoomLevel) + 1]);
                this.updateCanvasTranslate();
            }
        },
        zoomOut(): void {
            if (this.zoomLevel > this.zoomLevelMin) {
                this.updateZoomLevel(this.zoomLevels[this.zoomLevels.indexOf(this.zoomLevel) - 1]);
                this.updateCanvasTranslate();
            }
        },
        zoom(vector: number, scaleRelatedX: number | null, scaleRelatedY: number | null): void {
            if ((vector > 0 && this.zoomLevel > this.zoomLevelMin) || (vector < 0 && this.zoomLevel < this.zoomLevelMax)) {
                this.updateZoomLevel(this.zoomLevels[this.zoomLevels.indexOf(this.zoomLevel) - vector]);
                this.updateCanvasTranslate(scaleRelatedX, scaleRelatedY);
            }
        },
        zoomFit(): void {
            console.log('zoomFit:', this.zoomLevel);
        },
        initRandomElements(): void {
            this.items = [];
            for (let i = 1; i <= 10; i++) {
                this.items.push({
                    id: uuidv4(),
                    onTop: false,
                    x: getRandomIntInclusive(20, 100),
                    y: getRandomIntInclusive(20, 100),
                    w: 200,
                    h: 200,
                    ports: {
                        in: [],
                        out: [],
                    }
                });
            }
        },
    },
});