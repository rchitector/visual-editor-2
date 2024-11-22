import { defineStore } from 'pinia';
import {v4 as uuidv4} from "uuid";

const getRandomIntInclusive = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const useCanvasStore = defineStore('canvas', {
    state: () => ({
        maxCanvasWidth: 0,
        maxCanvasHeight: 0,
        baseCellSize: 20,
        defaultScale: 1,
        scale: 1,
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
        // updateItem(id, updatedProperties) {
        //     const item = this.items[id];
        //     if (item) {
        //         Object.assign(item, updatedProperties);
        //     }
        // },
        setOnTop(id) {
            this.items.forEach(function (item) {
                item.onTop = item.id === id;
            })
            this.items.sort((a, b) => {
                if (a.onTop && !b.onTop) return 1;
                if (!a.onTop && b.onTop) return -1;
                return 0;
            });
        },
        initRandomElements() {
            this.items = [];
            for (let i = 1; i <= 10; i++) {
                this.items.push({
                    id: uuidv4(),
                    onTop: false,
                    x: getRandomIntInclusive(-300, 300),
                    y: getRandomIntInclusive(-300, 300),
                    color: `hsl(${Math.random() * 360}, 50%, 50%)`,
                });
            }
        },
    },
    // getters: {
    //     orderedKeys(state) {
    //         const keys = Object.keys(state.items);
    //         if (state.draggingElement) {
    //             keys.splice(keys.indexOf(state.draggingElement.id), 1);
    //             keys.unshift(state.draggingElement.id);
    //         }
    //         return keys;
    //     },
    // }
});
