import {defineStore} from 'pinia';
import {v4 as uuidv4} from "uuid";
import {Element, GlobalState, Point} from '@/js/interfaces'
import {
    ITEMS_RECTANGLE_PADDING,
    ItemTypes,
    PortType,
    ZOOM_LEVEL_DEFAULT,
    ZOOM_LEVEL_MAX,
    ZOOM_LEVEL_MIN,
    ZOOM_MANUAL_LEVELS
} from '@/js/stores/constants'

const defaultValues = {
    debug: false,
    mainBoxRect: {x: 0, y: 0, width: 0, height: 0},
    documentPoint: {x: 0, y: 0},
    canvasMatrix: {x: 0, y: 0, scale: 1},
    elements: {},
    lines: {},
    items: [],
    zoom: {
        previous: ZOOM_LEVEL_DEFAULT,
        value: ZOOM_LEVEL_DEFAULT,
    },
    dragging: {
        type: null,
        element: null,
        startPoint: null,
    },
    startPoint: {x: 0, y: 0},
    documentLastPoint: {x: 0, y: 0},
    itemsRect: {x: 0, y: 0, width: 0, height: 0, center: {x: 0, y: 0}},
    itemType: null,
};

export const useStore = defineStore('canvas', {
    state: (): GlobalState => ({...defaultValues}),
    getters: {
        canvasMatrixStyle: (state) => {
            return {transform: `matrix(${state.canvasMatrix.scale}, 0, 0, ${state.canvasMatrix.scale}, ${state.canvasMatrix.x}, ${state.canvasMatrix.y})`};
        },
        nextZoomManualLevel: (state) => {
            const filtered = ZOOM_MANUAL_LEVELS.filter(num => num > state.zoom.value)
            return filtered.length ? Math.min(...filtered) : ZOOM_LEVEL_MAX;
        },
        previousZoomManualLevel: (state) => {
            const filtered = ZOOM_MANUAL_LEVELS.filter(num => num < state.zoom.value)
            return filtered.length ? Math.max(...filtered) : ZOOM_LEVEL_MIN;
        },
        canvasPoint: (state) => {
            return {
                x: ((state.documentPoint.x - state.mainBoxRect.x - state.canvasMatrix.x) / state.canvasMatrix.scale).toFixed(0),
                y: ((state.documentPoint.y - state.mainBoxRect.y - state.canvasMatrix.y) / state.canvasMatrix.scale).toFixed(0),
            };
        },
        canvasPointMatrix: (state) => {
            return {
                scale: state.zoom.value / 100,
                x: state.documentPoint.x - state.mainBoxRect.x,
                y: state.documentPoint.y - state.mainBoxRect.y,
            };
        },
        mainBoxRectCenter: (state) => {
            return {
                x: state.mainBoxRect.width / 2,
                y: state.mainBoxRect.height / 2,
            };
        },
        allElementsRect: (state) => {
            let elementsRect = {x: 0, y: 0, width: 0, height: 0, center: {x: 0, y: 0}}
            if (state.elements) {
                let minX: number = Infinity, minY: number = Infinity, maxX: number = -Infinity,
                    maxY: number = -Infinity;
                for (const [key, element] of Object.entries(state.elements)) {
                    minX = Math.min(minX, element.x);
                    minY = Math.min(minY, element.y);
                    maxX = Math.max(maxX, element.x + element.w);
                    maxY = Math.max(maxY, element.y + element.h);
                }
                let _minX = Math.min(minX, maxX) - ITEMS_RECTANGLE_PADDING;
                let _minY = Math.min(minY, maxY) - ITEMS_RECTANGLE_PADDING;
                let _maxX = Math.max(minX, maxX) + ITEMS_RECTANGLE_PADDING;
                let _maxY = Math.max(minY, maxY) + ITEMS_RECTANGLE_PADDING;
                elementsRect = {
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
            return elementsRect;
        },
    },
    actions: {
        documentPointToRelatedToCanvasZeroPoint(documentPointX, documentPointY): Point {
            return {
                x: (documentPointX - this.mainBoxRect.x - this.canvasMatrix.x) / this.canvasMatrix.scale,
                y: (documentPointY - this.mainBoxRect.y - this.canvasMatrix.y) / this.canvasMatrix.scale,
            };
        },
        onMainBoxWheel(deltaY: number, documentPointX: number, documentPointY: number) {
            const scaleRelatedX = documentPointX - this.mainBoxRect.x;
            const scaleRelatedY = documentPointY - this.mainBoxRect.y;
            const vector = Math.sign(deltaY);
            if (vector > 0) {
                this.zoomOut(scaleRelatedX, scaleRelatedY);
            } else if (vector < 0) {
                this.zoomIn(scaleRelatedX, scaleRelatedY);
            }
        },
        generateBaseElement(documentPointX: number, documentPointY: number): Element {
            const {
                x: relatedX,
                y: relatedY
            } = this.documentPointToRelatedToCanvasZeroPoint(documentPointX, documentPointY);
            return this.generateBaseElementRelated(relatedX, relatedY);
        },
        generateBaseElementRelated(relatedX: number, relatedY: number) {
            return {
                id: uuidv4(),
                x: relatedX,
                y: relatedY,
                w: 0,
                h: 0,
                onTop: true,
                ports: {}
            }
        },
        createStartElementRelated(relatedX: number, relatedY: number) {
            const baseElement = this.generateBaseElementRelated(relatedX, relatedY);
            baseElement.type = ItemTypes.Start;
            const ports = [
                {
                    id: uuidv4(),
                    index: 1,
                    titlePrefix: 'Action Input',
                    type: PortType.ActionInput,
                    active: false,
                    disabled: true
                },
                {
                    id: uuidv4(),
                    index: 2,
                    titlePrefix: 'Action Output',
                    type: PortType.ActionOutput,
                    active: false,
                    disabled: true
                },
                {
                    id: uuidv4(),
                    index: 3,
                    titlePrefix: 'Data Input',
                    type: PortType.DataInput,
                    active: false,
                    disabled: true
                },
                {
                    id: uuidv4(),
                    index: 4,
                    titlePrefix: 'Data Output',
                    type: PortType.DataOutput,
                    active: false,
                    disabled: true
                },
            ];
            ports.forEach(port => {
                baseElement.ports[port.id] = {
                    elementId: baseElement.id,
                    id: port.id,
                    type: port.type,
                    title: `${port.titlePrefix} ${port.index}`,
                    active: port.active,
                    disabled: port.disabled,
                    connection: {x: 0, y: 0},
                };
            })
            this.elements[baseElement.id] = baseElement;
        },
        createStartElement(documentPointX: number, documentPointY: number) {
            const baseElement = this.generateBaseElement(documentPointX, documentPointY);
            baseElement.type = ItemTypes.Start;

            let index = 0;
            const ports = [
                {
                    id: uuidv4(),
                    index: index++,
                    titlePrefix: 'Action Input',
                    type: PortType.ActionInput,
                    active: true,
                    disabled: true
                },
                {
                    id: uuidv4(),
                    index: index++,
                    titlePrefix: 'Action Input',
                    type: PortType.ActionInput,
                    active: false,
                    disabled: true
                },
                // {
                //     id: uuidv4(),
                //     index: index++,
                //     titlePrefix: 'Action Input',
                //     type: PortType.ActionInput,
                //     active: true,
                //     disabled: false
                // },
                // {
                //     id: uuidv4(),
                //     index: index++,
                //     titlePrefix: 'Action Input',
                //     type: PortType.ActionInput,
                //     active: false,
                //     disabled: false
                // },
                {
                    id: uuidv4(),
                    index: index++,
                    titlePrefix: 'Action Output',
                    type: PortType.ActionOutput,
                    active: true,
                    disabled: true
                },
                // {
                //     id: uuidv4(),
                //     index: index++,
                //     titlePrefix: 'Action Output',
                //     type: PortType.ActionOutput,
                //     active: false,
                //     disabled: true
                // },
                // {
                //     id: uuidv4(),
                //     index: index++,
                //     titlePrefix: 'Action Output',
                //     type: PortType.ActionOutput,
                //     active: true,
                //     disabled: false
                // },
                // {
                //     id: uuidv4(),
                //     index: index++,
                //     titlePrefix: 'Action Output',
                //     type: PortType.ActionOutput,
                //     active: false,
                //     disabled: false
                // },
                {
                    id: uuidv4(),
                    index: index++,
                    titlePrefix: 'Data Input',
                    type: PortType.DataInput,
                    active: true,
                    disabled: true
                },
                // {
                //     id: uuidv4(),
                //     index: index++,
                //     titlePrefix: 'Data Input',
                //     type: PortType.DataInput,
                //     active: false,
                //     disabled: true
                // },
                // {
                //     id: uuidv4(),
                //     index: index++,
                //     titlePrefix: 'Data Input',
                //     type: PortType.DataInput,
                //     active: true,
                //     disabled: false
                // },
                // {
                //     id: uuidv4(),
                //     index: index++,
                //     titlePrefix: 'Data Input',
                //     type: PortType.DataInput,
                //     active: false,
                //     disabled: false
                // },
                {
                    id: uuidv4(),
                    index: index++,
                    titlePrefix: 'Data Output',
                    type: PortType.DataOutput,
                    active: true,
                    disabled: true
                },
                {
                    id: uuidv4(),
                    index: index++,
                    titlePrefix: 'Data Output',
                    type: PortType.DataOutput,
                    active: false,
                    disabled: true
                },
                {
                    id: uuidv4(),
                    index: index++,
                    titlePrefix: 'Data Output',
                    type: PortType.DataOutput,
                    active: false,
                    disabled: true
                },
                {
                    id: uuidv4(),
                    index: index++,
                    titlePrefix: 'Data Output',
                    type: PortType.DataOutput,
                    active: false,
                    disabled: true
                },
                {
                    id: uuidv4(),
                    index: index++,
                    titlePrefix: 'Data Output',
                    type: PortType.DataOutput,
                    active: false,
                    disabled: true
                },
                // {
                //     id: uuidv4(),
                //     index: index++,
                //     titlePrefix: 'Data Output',
                //     type: PortType.DataOutput,
                //     active: true,
                //     disabled: false
                // },
                // {
                //     id: uuidv4(),
                //     index: index++,
                //     titlePrefix: 'Data Output',
                //     type: PortType.DataOutput,
                //     active: false,
                //     disabled: false
                // },
            ];

            ports.forEach(port => {
                baseElement.ports[port.id] = {
                    elementId: baseElement.id,
                    id: port.id,
                    index: port.index,
                    type: port.type,
                    title: `${port.titlePrefix} ${port.index}`,
                    active: port.active,
                    disabled: port.disabled,
                    connection: {x: 0, y: 0},
                };
            })

            this.elements[baseElement.id] = baseElement;
        },
        // clearDragging() {
        //     this.dragging.type = null;
        //     this.dragging.element = null;
        //     this.dragging.startPoint = null;
        // },
        // generateBaseItem(documentPointX: number, documentPointY: number): Item {
        //     const relatedX = documentPointX - this.mainBoxRect.x - this.canvasMatrix.x;
        //     const relatedY = documentPointY - this.mainBoxRect.y - this.canvasMatrix.y;
        //     return {
        //         id: uuidv4(),
        //         x: relatedX / (this.zoom.value / 100),
        //         y: relatedY / (this.zoom.value / 100),
        //         w: 0,
        //         h: 0,
        //         onTop: true,
        //         type: null
        //     };
        // },
        // addNewItem(baseItem: Item) {
        //     this.items.push(baseItem);
        //     this.setCanvasItemOnTop(baseItem.id);
        //     // this.setCanvasItemTypeActive(null);
        //     this.itemType = null;
        // },
        // createStartItem(baseItem: Item) {
        //     baseItem.type = ItemTypes.Start;
        //     this.addNewItem(baseItem);
        // },
        // createEndItem(baseItem: Item) {
        //     baseItem.type = ItemTypes.Finish;
        //     this.addNewItem(baseItem);
        // },
        // createAction1Item(baseItem: Item) {
        //     baseItem.type = ItemTypes.Action1;
        //     this.addNewItem(baseItem);
        // },
        // createAction2Item(baseItem: Item) {
        //     baseItem.type = ItemTypes.Action2;
        //     this.addNewItem(baseItem);
        // },
        // createItem(itemType: ItemTypes | null, documentPointX: number, documentPointY: number) {
        //     const baseItem = this.generateBaseItem(documentPointX, documentPointY);
        //     switch (itemType) {
        //         case ItemTypes.Start:
        //             return this.createStartItem(baseItem);
        //         case ItemTypes.Finish:
        //             return this.createEndItem(baseItem);
        //         case ItemTypes.Action1:
        //             return this.createAction1Item(baseItem);
        //         case ItemTypes.Action2:
        //             return this.createAction2Item(baseItem);
        //     }
        // },
        setCanvasItemSize(itemId: string, width: number, height: number) {
            const me = this.items.find(item => item.id === itemId);
            if (me) {
                me.w = width;
                me.h = height;
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
                x: rect.x,
                y: rect.y,
                width: rect.width,
                height: rect.height,
            };
        },
        zoomIn(scaleRelatedX: number | null = null, scaleRelatedY: number | null = null): void {
            this.setZoom(this.nextZoomManualLevel, scaleRelatedX, scaleRelatedY);
        },
        zoomOut(scaleRelatedX: number | null = null, scaleRelatedY: number | null = null): void {
            this.setZoom(this.previousZoomManualLevel, scaleRelatedX, scaleRelatedY);
        },
        setZoom(newZoomLevel: number, scaleRelatedX: number | null = null, scaleRelatedY: number | null = null): void {
            this.zoom.previous = this.zoom.value;
            this.zoom.value = Math.min(ZOOM_LEVEL_MAX, Math.max(ZOOM_LEVEL_MIN, newZoomLevel));
            scaleRelatedX = scaleRelatedX ?? this.mainBoxRectCenter.x;
            scaleRelatedY = scaleRelatedY ?? this.mainBoxRectCenter.y;
            const coefficient = ((this.zoom.value / 100) / (this.zoom.previous / 100) - (ZOOM_LEVEL_DEFAULT / 100));
            this.canvasMatrix.scale = this.zoom.value / 100;
            this.canvasMatrix.x = (this.canvasMatrix.x - (scaleRelatedX - this.canvasMatrix.x) * coefficient).toFixed(0);
            this.canvasMatrix.y = (this.canvasMatrix.y - (scaleRelatedY - this.canvasMatrix.y) * coefficient).toFixed(0);
        },
        zoomFit(): void {
            this.zoom.previous = this.zoom.value;
            const itemsRect = this.allElementsRect;
            const scaleX = this.mainBoxRect.width / itemsRect.width;
            const scaleY = this.mainBoxRect.height / itemsRect.height;
            this.zoom.value = Math.min(Math.min(scaleX, scaleY) * 100, ZOOM_LEVEL_DEFAULT);
            this.canvasMatrix.scale = this.zoom.value / 100;
            this.canvasMatrix.x = (0 - itemsRect.center.x * this.zoom.value / 100 + this.mainBoxRectCenter.x).toFixed(0);
            this.canvasMatrix.y = (0 - itemsRect.center.y * this.zoom.value / 100 + this.mainBoxRectCenter.y).toFixed(0);
        },
        moveZeroTo(scaleRelatedX: number, scaleRelatedY: number): void {
            this.canvasMatrix.x = scaleRelatedX;
            this.canvasMatrix.y = scaleRelatedY;
        },
        moveZeroToCenter(): void {
            const scaleRelatedX = (this.mainBoxRect.x + this.mainBoxRect.width / 2) - this.mainBoxRect.x;
            const scaleRelatedY = (this.mainBoxRect.y + this.mainBoxRect.height / 2) - this.mainBoxRect.y;
            this.canvasMatrix.x = scaleRelatedX;
            this.canvasMatrix.y = scaleRelatedY;
        },
        // getMainBoxPoint(documentPointX: number, documentPointY: number): Point {
        //     return {
        //         x: (documentPointX - this.mainBoxRect.x),
        //         y: (documentPointY - this.mainBoxRect.y),
        //     }
        // },
        // setCanvasItemTypeActive(itemType: ItemTypes | null) {
        //     this.itemType = itemType;
        // },
        // onMainBoxPointDown(documentPointX: number, documentPointY: number, event: MouseEvent | TouchEvent) {
        //     this.clearDragging();
        //     this.dragging.type = event.currentTarget?.closest('[data-type]')?.getAttribute('data-type') || null;
        //     switch (this.dragging.type) {
        //         case DraggingTypes.Item:
        //             const itemId = event.currentTarget?.closest('[data-id]')?.getAttribute('data-id') || null;
        //             this.dragging.element = this.items.find(item => item.id === itemId) || null;
        //             if (this.dragging.element) {
        //                 const mainBoxPoint = this.getMainBoxPoint(documentPointX, documentPointY);
        //                 this.dragging.pointerShift = {
        //                     x: mainBoxPoint.x - this.dragging.element.x,
        //                     y: mainBoxPoint.y - this.dragging.element.y,
        //                 };
        //             }
        //             break;
        //         case DraggingTypes.Line:
        //             break;
        //     }
        // },
        // onDocumentPointMove(documentPointX: number, documentPointY: number) {
        //     switch (this.dragging.type) {
        //         case DraggingTypes.Item:
        //             this.dragging.element.x = (this.dragging.element.x + (documentPointX - this.documentLastPoint.x) / (this.zoom.value / 100));
        //             this.dragging.element.y = (this.dragging.element.y + (documentPointY - this.documentLastPoint.y) / (this.zoom.value / 100));
        //             this.documentLastPoint = {x: documentPointX, y: documentPointY};
        //             break;
        //         case DraggingTypes.Line:
        //             break;
        //     }
        // },
        // onDocumentPointUp(documentPointX: number, documentPointY: number) {
        //     // console.log('onDocumentPointUp:');
        //     // console.log('this.dragging.type:', this.dragging.type);
        //     // if ((this.startPoint.x === documentPointX && this.startPoint.y === documentPointY)) {
        //     //     this.tryToCreateItem(documentPointX, documentPointY);
        //     // }
        // },
        // tryToCreateItem(documentPointX: number, documentPointY: number) {
        //     if (this.itemType) {
        //         this.createItem(this.itemType, documentPointX, documentPointY);
        //     }
        // },
        // moveCanvasItemToCenter(itemId: string): void {
        //     const me = this.items.find(item => item.id === itemId);
        //     if (me) {
        //         me.x = 0;
        //         me.y = 0;
        //     }
        // },
        // deleteCanvasItem(itemId: string): void {
        //     this.items = this.items.filter(item => item.id !== itemId);
        // },
        // onCanvasItemPointDown(event: MouseEvent | Touch, itemId: string): void {
        //     this.setCanvasItemOnTop(itemId);
        //     this.startCanvasItemDragging(event, itemId);
        // },
        // startCanvasItemDragging(event: MouseEvent | Touch, itemId: string): void {
        //     if (event.target && (event.target as HTMLElement).closest('[data-is-draggable]')) {
        //         this.dragging.element = this.items.find(item => item.id === itemId) || null;
        //         this.documentLastPoint = {x: event.clientX, y: event.clientY};
        //     }
        // },
        // initRandomElements(): void {
        //     this.items = [];
        //     // this.items.push({
        //     //     id: uuidv4(),
        //     //     onTop: true,
        //     //     x: 0,
        //     //     y: 0,
        //     //     w: 0,
        //     //     h: 0,
        //     //     type: ItemTypes.Start,
        //     // });
        //     this.lines = [];
        //     // this.lines.push({
        //     //     id: uuidv4(),
        //     //     startId: uuidv4(),
        //     //     startX: 20,
        //     //     startY: 30,
        //     //     endId: uuidv4(),
        //     //     endX: 40,
        //     //     endY: 50,
        //     // });
        // },
    },
});
