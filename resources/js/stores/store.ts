import {defineStore} from 'pinia';
// import {v4 as uuidv4} from "uuid";
// import {getRandomIntInclusive} from '@/js/stores/helper';
import {GlobalState, Item} from '@/js/interfaces'
import {BG_CELL_SIZE, ITEMS_RECTANGLE_PADDING, ZOOM_LEVEL_DEFAULT, ZOOM_LEVEL_MAX, ZOOM_LEVEL_MIN, ZOOM_MANUAL_LEVELS} from '@/js/stores/constants';

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
        globalBoxRect: {exists: false, width: 0, height: 0, top: 0, left: 0, x: 0, y: 0},
        // startPoint: {x: 0, y: 0},
        documentPoint: {x: 0, y: 0},
        documentLastPoint: {x: 0, y: 0},
        canvasTranslateX: 0,
        canvasTranslateY: 0,
        // relatedPointX: 0,
        // relatedPointY: 0,
        itemsRect: {x: 0, y: 0, width: 0, height: 0, center: {x: 0, y: 0}}
    }),
    getters: {
        nextZoomManualLevel: (state) => {
            const filtered = ZOOM_MANUAL_LEVELS.filter(num => num > state.zoom.value)
            return filtered.length ? Math.min(...filtered) : ZOOM_LEVEL_MAX;
        },
        previousZoomManualLevel: (state) => {
            const filtered = ZOOM_MANUAL_LEVELS.filter(num => num < state.zoom.value)
            return filtered.length ? Math.max(...filtered) : ZOOM_LEVEL_MIN;
        },
        canvasMatrix: (state) => {
            return {
                scale: state.zoom.value / 100,
                x: state.canvasTranslateX,
                y: state.canvasTranslateY,
            };
        },
        canvasPointMatrix: (state) => {
            return {
                scale: state.zoom.value / 100,
                x: state.documentPoint.x - state.globalBoxRect.left,
                y: state.documentPoint.y - state.globalBoxRect.top,
            };
        },
        globalBoxRectCenter: (state) => {
            return {
                x: state.globalBoxRect.width / 2,
                y: state.globalBoxRect.height / 2,
            };
        },
    },
    actions: {
        onWheel(deltaY: number, pointX: number, pointY: number) {
            const scaleRelatedX = pointX - this.globalBoxRect.left;
            const scaleRelatedY = pointY - this.globalBoxRect.top;
            const vector = Math.sign(deltaY);
            if (vector > 0) {
                this.zoomOut(scaleRelatedX, scaleRelatedY);
            } else if (vector < 0) {
                this.zoomIn(scaleRelatedX, scaleRelatedY);
            }
        },
        onPointUp(pointX: number, pointY: number) {
            // if (this.globalBoxRect.exists) {
            //     console.log('this.dragging.is:', this.dragging.is);
            //     if ((this.startPoint.x === pointX && this.startPoint.y === pointY)) {
            //         const relatedX = pointX - this.globalBoxRect.left - this.canvasTranslateX;
            //         const relatedY = pointY - this.globalBoxRect.top - this.canvasTranslateY;
            //         this.items.push({
            //             id: uuidv4(),
            //             x: relatedX / (this.zoom.value / 100),
            //             y: relatedY / (this.zoom.value / 100),
            //             w: 0,
            //             h: 0,
            //             onTop: false,
            //         });
            //     }
            // }
            this.dragging.is = false;
            this.dragging.element = null;
            this.documentLastPoint = {x: 0, y: 0};
            // this.startPoint.x = null;
            // this.startPoint.y = null;
        },
        onPointDown(pointX: number, pointY: number) {
            this.dragging.is = true;
            this.documentLastPoint = {x: pointX, y: pointY};
            // this.startPoint.x = pointX;
            // this.startPoint.y = pointY;
        },
        onPointMove(pointX: number, pointY: number) {
            this.documentPoint = {x: pointX, y: pointY};
            // if (this.globalBoxRect.exists) {
            //     this.relatedPointX = pointX - this.globalBoxRect.left;
            //     this.relatedPointY = pointY - this.globalBoxRect.top;
            // }
            if (this.dragging.is) {
                this.canvasTranslateX += (pointX - this.documentLastPoint.x);
                this.canvasTranslateY += (pointY - this.documentLastPoint.y);
                this.documentLastPoint = {x: pointX, y: pointY};
            }
            if (this.dragging.element !== null) {
                this.dragging.element.x = (this.dragging.element.x + (pointX - this.documentLastPoint.x) / (this.zoom.value / 100));
                this.dragging.element.y = (this.dragging.element.y + (pointY - this.documentLastPoint.y) / (this.zoom.value / 100));
                this.documentLastPoint = {x: pointX, y: pointY};
            }
        },
        setItemSize(itemId: string, width: number, height: number) {
            const me = this.items.find(item => item.id === itemId);
            if (me) {
                me.w = width;
                me.h = height;
            }
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
        updateGlobalBoxRect(rect: DOMRect): void {
            this.globalBoxRect = {
                exists: true,
                width: rect.width,
                height: rect.height,
                top: rect.top,
                left: rect.left,
                x: rect.x,
                y: rect.y,
            };
        },
        setZoom(newZoomLevel: number, scaleRelatedX: number | null = null, scaleRelatedY: number | null = null): void {
            this.zoom.previous = this.zoom.value;
            this.zoom.value = Math.min(ZOOM_LEVEL_MAX, Math.max(ZOOM_LEVEL_MIN, newZoomLevel));

            const coefficient = ((this.zoom.value / 100) / (this.zoom.previous / 100) - (ZOOM_LEVEL_DEFAULT / 100));
            this.canvasTranslateX = this.canvasTranslateX - ((scaleRelatedX ?? this.globalBoxRectCenter.x) - this.canvasTranslateX) * coefficient;
            this.canvasTranslateY = this.canvasTranslateY - ((scaleRelatedY ?? this.globalBoxRectCenter.y) - this.canvasTranslateY) * coefficient;
        },
        zoomIn(scaleRelatedX: number | null = null, scaleRelatedY: number | null = null): void {
            this.setZoom(this.nextZoomManualLevel, scaleRelatedX, scaleRelatedY);
        },
        zoomOut(scaleRelatedX: number | null = null, scaleRelatedY: number | null = null): void {
            this.setZoom(this.previousZoomManualLevel, scaleRelatedX, scaleRelatedY);
        },
        zoomFit(): void {
            this.renderAllItemsRect();
            const scaleX = this.globalBoxRect.width / this.itemsRect.width;
            const scaleY = this.globalBoxRect.height / this.itemsRect.height;
            this.zoom.value = Math.min(Math.min(scaleX, scaleY) * 100, ZOOM_LEVEL_DEFAULT);
            this.canvasTranslateX = 0 - this.itemsRect.center.x * this.zoom.value / 100 + this.globalBoxRectCenter.x;
            this.canvasTranslateY = 0 - this.itemsRect.center.y * this.zoom.value / 100 + this.globalBoxRectCenter.y;
        },
        renderAllItemsRect(): void {
            this.itemsRect = {x: 0, y: 0, width: 0, height: 0, center: {x: 0, y: 0}}
            let _minX = 0;
            let _minY = 0;
            let _maxX = 0;
            let _maxY = 0;
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
                _minX = Math.min(minX, maxX) - ITEMS_RECTANGLE_PADDING;
                _minY = Math.min(minY, maxY) - ITEMS_RECTANGLE_PADDING;
                _maxX = Math.max(minX, maxX) + ITEMS_RECTANGLE_PADDING;
                _maxY = Math.max(minY, maxY) + ITEMS_RECTANGLE_PADDING;
                const w = _maxX - _minX;
                const h = _maxY - _minY;
                this.itemsRect = {
                    x: _minX,
                    y: _minY,
                    width: w,
                    height: h,
                    center: {
                        x: minX + w / 2,
                        y: minY + h / 2,
                    }
                };
            }
        },
        // initRandomElements(): void {
        //     const maxItems = 1;
        //     const diff = 0;
        //     this.items = [];
        //     for (let i = 1; i <= maxItems; i++) {
        //         this.items.push({
        //             id: uuidv4(),
        //             onTop: false,
        //             x: getRandomIntInclusive(-diff, diff),
        //             y: getRandomIntInclusive(-diff, diff),
        //             w: 0,
        //             h: 0,
        //             ports: {
        //                 in: [],
        //                 out: [],
        //             }
        //         });
        //     }
        //     this.zoomFit();
        // },
    },
});