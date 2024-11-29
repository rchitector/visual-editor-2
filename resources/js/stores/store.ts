import {defineStore} from 'pinia';
import {v4 as uuidv4} from "uuid";
// import {getRandomIntInclusive} from '@/js/stores/helper';
import {GlobalState, Item} from '@/js/interfaces'
import {ItemTypes} from '@/js/stores/constants'
import {ITEMS_RECTANGLE_PADDING, ZOOM_LEVEL_DEFAULT, ZOOM_LEVEL_MAX, ZOOM_LEVEL_MIN, ZOOM_MANUAL_LEVELS} from '@/js/stores/constants';

const defaultValues = {
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
    mainBoxRect: {exists: false, width: 0, height: 0, top: 0, left: 0, x: 0, y: 0},
    startPoint: {x: 0, y: 0},
    documentPoint: {x: 0, y: 0},
    documentLastPoint: {x: 0, y: 0},
    canvasTranslateX: 0,
    canvasTranslateY: 0,
    // relatedPointX: 0,
    // relatedPointY: 0,
    itemsRect: {x: 0, y: 0, width: 0, height: 0, center: {x: 0, y: 0}},
    itemType: null,
};

export const useStore = defineStore('canvas', {
    state: (): GlobalState => ({...defaultValues}),
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
                x: state.documentPoint.x - state.mainBoxRect.left,
                y: state.documentPoint.y - state.mainBoxRect.top,
            };
        },
        mainBoxRectCenter: (state) => {
            return {
                x: state.mainBoxRect.width / 2,
                y: state.mainBoxRect.height / 2,
            };
        },
    },
    actions: {
        setCanvasItemTypeActive(itemType: ItemTypes | null) {
            this.itemType = itemType;
        },
        onMainBoxWheel(deltaY: number, pointX: number, pointY: number) {
            const scaleRelatedX = pointX - this.mainBoxRect.left;
            const scaleRelatedY = pointY - this.mainBoxRect.top;
            const vector = Math.sign(deltaY);
            if (vector > 0) {
                this.zoomOut(scaleRelatedX, scaleRelatedY);
            } else if (vector < 0) {
                this.zoomIn(scaleRelatedX, scaleRelatedY);
            }
        },
        onMainBoxPointDown(pointX: number, pointY: number) {
            this.dragging.is = true;
            this.documentLastPoint = {x: pointX, y: pointY};
            this.startPoint.x = pointX;
            this.startPoint.y = pointY;
        },
        onDocumentPointMove(documentPointX: number, documentPointY: number) {
            this.documentPoint = {x: documentPointX, y: documentPointY};
            // if (this.mainBoxRect.exists) {
            //     this.relatedPointX = pointX - this.mainBoxRect.left;
            //     this.relatedPointY = pointY - this.mainBoxRect.top;
            // }
            if (this.dragging.is) {
                this.canvasTranslateX += (documentPointX - this.documentLastPoint.x);
                this.canvasTranslateY += (documentPointY - this.documentLastPoint.y);
                this.documentLastPoint = {x: documentPointX, y: documentPointY};
            }
            if (this.dragging.element !== null) {
                this.dragging.element.x = (this.dragging.element.x + (documentPointX - this.documentLastPoint.x) / (this.zoom.value / 100));
                this.dragging.element.y = (this.dragging.element.y + (documentPointY - this.documentLastPoint.y) / (this.zoom.value / 100));
                this.documentLastPoint = {x: documentPointX, y: documentPointY};
            }
        },
        onDocumentPointUp(documentPointX: number, documentPointY: number) {
            if (this.mainBoxRect.exists) {
                if ((this.startPoint.x === documentPointX && this.startPoint.y === documentPointY)) {
                    this.tryToCreateItem(documentPointX, documentPointY);
                }
            }
            this.dragging.is = false;
            this.dragging.element = null;
            this.documentLastPoint = {x: 0, y: 0};
            this.startPoint.x = null;
            this.startPoint.y = null;
        },
        generateBaseItem(documentPointX: number, documentPointY: number): Item {
            const relatedX = documentPointX - this.mainBoxRect.left - this.canvasTranslateX;
            const relatedY = documentPointY - this.mainBoxRect.top - this.canvasTranslateY;
            return {
                id: uuidv4(),
                x: relatedX / (this.zoom.value / 100),
                y: relatedY / (this.zoom.value / 100),
                w: 0,
                h: 0,
                onTop: true,
            };
        },
        addNewItem(baseItem: Item) {
            this.items.push(baseItem);
            this.setCanvasItemOnTop(baseItem.id);
        },
        createStartItem(baseItem: Item) {
            // console.log('ItemTypes.Start:', ItemTypes.Start);
            this.addNewItem(baseItem);
        },
        createEndItem(baseItem: Item) {
            // console.log('ItemTypes.End:', ItemTypes.End);
            this.addNewItem(baseItem);
        },
        createAction1Item(baseItem: Item) {
            // console.log('ItemTypes.Action1:', ItemTypes.Action1);
            this.addNewItem(baseItem);
        },
        createAction2Item(baseItem: Item) {
            // console.log('ItemTypes.Action2:', ItemTypes.Action2);
            this.addNewItem(baseItem);
        },
        createItem(itemType: string | null, documentPointX: number, documentPointY: number) {
            const baseItem = this.generateBaseItem(documentPointX, documentPointY);
            switch (itemType) {
                case ItemTypes.Start:
                    return this.createStartItem(baseItem);
                case ItemTypes.End:
                    return this.createEndItem(baseItem);
                case ItemTypes.Action1:
                    return this.createAction1Item(baseItem);
                case ItemTypes.Action2:
                    return this.createAction2Item(baseItem);
            }
        },
        tryToCreateItem(documentPointX: number, documentPointY: number) {
            if (this.itemType) {
                this.createItem(this.itemType, documentPointX, documentPointY);
            }
        },
        setCanvasItemSize(itemId: string, width: number, height: number) {
            const me = this.items.find(item => item.id === itemId);
            if (me) {
                me.w = width;
                me.h = height;
            }
        },
        moveCanvasItemToCenter(itemId: string): void {
            const me = this.items.find(item => item.id === itemId);
            if (me) {
                me.x = 0;
                me.y = 0;
            }
        },
        deleteCanvasItem(itemId: string): void {
            this.items = this.items.filter(item => item.id !== itemId);
        },
        onCanvasItemPointDown(event: MouseEvent | Touch, itemId: string): void {
            this.setCanvasItemOnTop(itemId);
            this.startCanvasItemDragging(event, itemId);
        },
        startCanvasItemDragging(event: MouseEvent | Touch, itemId: string): void {
            if (event.target && (event.target as HTMLElement).closest('[data-is-draggable]')) {
                this.dragging.element = this.items.find(item => item.id === itemId) || null;
                this.documentLastPoint = {x: event.clientX, y: event.clientY};
            }
        },
        setCanvasItemOnTop(itemId: string): void {
            this.items.forEach((item: Item) => {
                item.onTop = item.id === itemId;
            });
            this.items.sort((a, b) => {
                if (a.onTop && !b.onTop) return 1;
                if (!a.onTop && b.onTop) return -1;
                return 0;
            });
        },
        updateMainBoxRect(rect: DOMRect): void {
            this.mainBoxRect = {
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
            this.canvasTranslateX = this.canvasTranslateX - ((scaleRelatedX ?? this.mainBoxRectCenter.x) - this.canvasTranslateX) * coefficient;
            this.canvasTranslateY = this.canvasTranslateY - ((scaleRelatedY ?? this.mainBoxRectCenter.y) - this.canvasTranslateY) * coefficient;
        },
        zoomIn(scaleRelatedX: number | null = null, scaleRelatedY: number | null = null): void {
            this.setZoom(this.nextZoomManualLevel, scaleRelatedX, scaleRelatedY);
        },
        zoomOut(scaleRelatedX: number | null = null, scaleRelatedY: number | null = null): void {
            this.setZoom(this.previousZoomManualLevel, scaleRelatedX, scaleRelatedY);
        },
        zoomFit(): void {
            this.renderAllItemsRect();
            const scaleX = this.mainBoxRect.width / this.itemsRect.width;
            const scaleY = this.mainBoxRect.height / this.itemsRect.height;
            this.zoom.value = Math.min(Math.min(scaleX, scaleY) * 100, ZOOM_LEVEL_DEFAULT);
            this.canvasTranslateX = 0 - this.itemsRect.center.x * this.zoom.value / 100 + this.mainBoxRectCenter.x;
            this.canvasTranslateY = 0 - this.itemsRect.center.y * this.zoom.value / 100 + this.mainBoxRectCenter.y;
        },
        renderAllItemsRect(): void {
            this.itemsRect = {x: 0, y: 0, width: 0, height: 0, center: {x: 0, y: 0}}
            if (this.items.length) {
                let minX: number = Infinity, minY: number = Infinity, maxX: number = -Infinity, maxY: number = -Infinity;
                this.items.forEach(item => {
                    minX = Math.min(minX, item.x);
                    minY = Math.min(minY, item.y);
                    maxX = Math.max(maxX, item.x + item.w);
                    maxY = Math.max(maxY, item.y + item.h);
                });
                let _minX = Math.min(minX, maxX) - ITEMS_RECTANGLE_PADDING;
                let _minY = Math.min(minY, maxY) - ITEMS_RECTANGLE_PADDING;
                let _maxX = Math.max(minX, maxX) + ITEMS_RECTANGLE_PADDING;
                let _maxY = Math.max(minY, maxY) + ITEMS_RECTANGLE_PADDING;
                this.itemsRect = {
                    x: _minX,
                    y: _minY,
                    width: _maxX - _minX,
                    height: _maxY - _minY,
                    center: {
                        x: _minX + (_maxX - _minX) / 2,
                        y: _minY + (_maxY - _minY) / 2,
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