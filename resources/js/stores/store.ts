import {defineStore} from 'pinia';
import {v4 as uuidv4} from "uuid";
import {getRandomIntInclusive} from '@/js/helper.js';
import {GlobalState, Item} from '../interfaces'
import {BG_CELL_SIZE, ZOOM_LEVEL_DEFAULT, ZOOM_LEVEL_MAX, ZOOM_LEVEL_MIN, ZOOM_MANUAL_LEVELS} from '@/js/stores/constants';

export const useStore = defineStore('canvas', {
    state: (): GlobalState => ({
        debug: true,
        items: [],
        zoom: {
            previous: ZOOM_LEVEL_DEFAULT,
            value: ZOOM_LEVEL_DEFAULT,
        },
        dragging: {
            is: false,
            element: null
        },
        canvasBoxRect: {width: 0, height: 0, top: 0, left: 0, x: 0, y: 0},
        startPoint: {x: 0, y: 0},
        lastMouseX: null,
        lastMouseY: null,
        canvasTranslateX: 0,
        canvasTranslateY: 0,
        scaleRelatedX: 0,
        scaleRelatedY: 0,
        rectCenterX: 0,
        rectCenterY: 0,
        clientX: 0,
        clientY: 0,
        // clientZoomedX: 0,
        // clientZoomedY: 0,
        minX: 0,
        minY: 0,
        maxX: 0,
        maxY: 0,
    }),
    getters: {
        nextZoomManualLevel: (state) => {
            return Math.min(...ZOOM_MANUAL_LEVELS.filter(num => num > state.zoom.value));
        },
        previousZoomManualLevel: (state) => {
            return Math.max(...ZOOM_MANUAL_LEVELS.filter(num => num < state.zoom.value));
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
        canvasBoxStyle: (state) => {
            const scaledCellSize = BG_CELL_SIZE * (state.zoom.value / 100);
            const translateCellSizeX = state.canvasTranslateX % scaledCellSize;
            const translateCellSizeY = state.canvasTranslateY % scaledCellSize;
            return {
                backgroundSize: `${scaledCellSize}px ${scaledCellSize}px`,
                backgroundPosition: `${translateCellSizeX}px ${translateCellSizeY}px`,
            };
        },
        matrix: (state) => {
            return {
                x: state.canvasTranslateX,
                y: state.canvasTranslateY,
                scale: state.zoom.value / 100,
            };
        },
        rectCenterX: (state) => {
            return state.canvasBoxRect.width / 2;
        },
        rectCenterY: (state) => {
            return state.canvasBoxRect.height / 2;
        },
        // rectCenterX: (state) => {},
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
            this.zoom.previous = this.zoom.value;
            this.zoom.value = Math.min(ZOOM_LEVEL_MAX, Math.max(ZOOM_LEVEL_MIN, value));
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
        updateCanvasBoxRect(rect: DOMRect): void {
            this.canvasBoxRect = {
                width: rect.width,
                height: rect.height,
                top: rect.top,
                left: rect.left,
                x: rect.x,
                y: rect.y,
            };

            this.scaleRelatedX = this.rectCenterX;
            this.scaleRelatedY = this.rectCenterY;
        },
        setZoom(newZoomLevel: number, scaleRelatedX: number | null = null, scaleRelatedY: number | null = null): void {
            this.updateZoomLevel(newZoomLevel);
            this.scaleRelatedX = scaleRelatedX ?? this.rectCenterX;
            this.scaleRelatedY = scaleRelatedY ?? this.rectCenterY;
            const coefficient = ((this.zoom.value / 100) / (this.zoom.previous / 100) - (ZOOM_LEVEL_DEFAULT / 100));
            this.canvasTranslateX = this.canvasTranslateX - (this.scaleRelatedX - this.canvasTranslateX) * coefficient;
            this.canvasTranslateY = this.canvasTranslateY - (this.scaleRelatedY - this.canvasTranslateY) * coefficient;

        },
        zoomIn(scaleRelatedX: number | null = null, scaleRelatedY: number | null = null): void {
            this.setZoom(this.nextZoomManualLevel, scaleRelatedX, scaleRelatedY);
        },
        zoomOut(scaleRelatedX: number | null = null, scaleRelatedY: number | null = null): void {
            this.setZoom(this.previousZoomManualLevel, scaleRelatedX, scaleRelatedY);
        },
        zoomFit(): void {
            this.renderAllItemsRect();
            const scaleX = this.canvasWidth / this.itemsRectWidth;
            const scaleY = this.canvasHeight / this.itemsRectHeight;
            this.zoom.value = Math.min(Math.min(scaleX, scaleY) * 100, ZOOM_LEVEL_DEFAULT);
            this.canvasTranslateX = 0 - this.itemsRectCenterX * this.zoom.value / 100 + this.rectCenterX;
            this.canvasTranslateY = 0 - this.itemsRectCenterY * this.zoom.value / 100 + this.rectCenterY;
        },
        renderAllItemsRect(): void {
            this.minX = 0;
            this.minY = 0;
            this.maxX = 0;
            this.maxY = 0;
            if (this.items.length) {
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
            }
        },
        initRandomElements(): void {
            const maxItems = 1;
            const diff = 0;
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
            this.zoomFit();
        },
    },
});