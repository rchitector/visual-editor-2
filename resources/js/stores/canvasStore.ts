import {defineStore} from 'pinia';
import {v4 as uuidv4} from "uuid";
import {getRandomIntInclusive} from "../helper.js";
import {CanvasState, Item} from '../interfaces'

export const useCanvasStore = defineStore('canvas', {
    state: (): CanvasState => ({
        baseCellSize: 20,
        zoomLevelMin: 1,
        zoomLevelMax: 400,
        zoomLevelDefault: 100,
        zoomManualLevels: [1, 2, 3, 5, 10, 15, 20, 33, 50, 75, 100, 125, 150, 200, 250, 300, 400],
        zoomLevelsVisible: [50, 70, 100, 150, 200],

        debug: false,
        isDraggingCanvas: false,
        draggingElement: null,
        lastMouseX: null,
        lastMouseY: null,
        canvasTranslateX: 0,
        canvasTranslateY: 0,
        scaleRelatedX: 0,
        scaleRelatedY: 0,
        items: [],
        zoomLevelPrevious: 100,
        zoomLevel: 100,
        rectCenterX: 0,
        rectCenterY: 0,
        clientX: 0,
        clientY: 0,
        clientZoomedX: 0,
        clientZoomedY: 0,
        minX: 0,
        minY: 0,
        maxX: 0,
        maxY: 0,
    }),
    getters: {
        nextZoomManualLevel: (state) => {
            return Math.min(...state.zoomManualLevels.filter(num => num > state.zoomLevel));
        },
        previousZoomManualLevel: (state) => {
            return Math.max(...state.zoomManualLevels.filter(num => num < state.zoomLevel));
        },
        itemsRectCenterX: (state) => {
            return state.minX + (state.maxX - state.minX) / 2;
        },
        itemsRectCenterY: (state) => {
            return state.minY + (state.maxY - state.minY) / 2;
        },
        itemsRectWidth: (state) => {
            return state.maxX - state.minX;
        },
        itemsRectHeight: (state) => {
            return state.maxY - state.minY;
        },
        canvasWidth: (state) => {
            return state.rectCenterX * 2;
        },
        canvasHeight: (state) => {
            return state.rectCenterY * 2;
        },
    },
    actions: {
        setItemSize(itemId: string, width: number, height: number) {
            const me = this.items.find(item => item.id === itemId);
            if (me) {
                me.w = width;
                me.h = height;
            }
        },
        updateZoomLevel(value: number) {
            this.zoomLevelPrevious = this.zoomLevel;
            this.zoomLevel = Math.min(this.zoomLevelMax, Math.max(this.zoomLevelMin, value));
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
        setZoom(newZoomLevel: number, scaleRelatedX: number | null = null, scaleRelatedY: number | null = null): void {
            this.updateZoomLevel(newZoomLevel);
            this.scaleRelatedX = scaleRelatedX ?? this.rectCenterX;
            this.scaleRelatedY = scaleRelatedY ?? this.rectCenterY;
            const coefficient = ((this.zoomLevel / 100) / (this.zoomLevelPrevious / 100) - (this.zoomLevelDefault / 100));
            this.canvasTranslateX = this.canvasTranslateX - (this.scaleRelatedX - this.canvasTranslateX) * coefficient;
            this.canvasTranslateY = this.canvasTranslateY - (this.scaleRelatedY - this.canvasTranslateY) * coefficient;

        },
        zoomIn(scaleRelatedX: number | null = null, scaleRelatedY: number | null = null): void {
            this.setZoom(this.nextZoomManualLevel, scaleRelatedX, scaleRelatedY);
        },
        zoomOut(scaleRelatedX: number | null = null, scaleRelatedY: number | null = null): void {
            this.setZoom(this.previousZoomManualLevel, scaleRelatedX, scaleRelatedY);
        },
        zoomFit():void{
            const scaleX = this.canvasWidth / this.itemsRectWidth;
            const scaleY = this.canvasHeight / this.itemsRectHeight;
            this.zoomLevel = Math.min(Math.min(scaleX, scaleY) * 100, this.zoomLevelDefault);
            this.canvasTranslateX = 0 - this.itemsRectCenterX * this.zoomLevel / 100 + this.rectCenterX;
            this.canvasTranslateY = 0 - this.itemsRectCenterY * this.zoomLevel / 100 + this.rectCenterY;
        },
        renderAllItemsRect():void {
            let minX = Infinity;
            let maxX = -Infinity;
            let minY = Infinity;
            let maxY = -Infinity;
            this.items.forEach(item => {
                minX = Math.min(minX, item.x);
                minY = Math.min(minY, item.y);
                maxX = Math.max(maxX, item.x + item.w);
                maxY = Math.max(maxY, item.y + item.h);
            });
            const padding = 20;
            this.minX = Math.min(minX, maxX) - padding;
            this.minY = Math.min(minY, maxY) - padding;
            this.maxX = Math.max(minX, maxX) + padding;
            this.maxY = Math.max(minY, maxY) + padding;
        },
        initRandomElements(): void {
            const maxItems = 10;
            const diff = 300;
            this.items = [];
            for (let i = 1; i <= maxItems; i++) {
                this.items.push({
                    id: uuidv4(),
                    onTop: false,
                    x: getRandomIntInclusive(-diff, diff),
                    y: getRandomIntInclusive(-diff, diff),
                    w: 0,
                    h: 0,
                    ports: {
                        in: [],
                        out: [],
                    }
                });
            }
            // this.renderAllItemsRect();
            // this.zoomFit();
            // this.canvasTranslateX = this.rectCenterX;
            // this.canvasTranslateY = this.rectCenterY;
        },
    },
});