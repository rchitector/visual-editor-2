export const BG_CELL_SIZE: number = 10;
export const ZOOM_LEVEL_MIN: number = 1;
export const ZOOM_LEVEL_MAX: number = 400;
export const ZOOM_LEVEL_DEFAULT: number = 100;
export const ZOOM_MANUAL_LEVELS: number[] = [1, 2, 3, 5, 10, 15, 20, 33, 50, 75, 100, 125, 150, 200, 250, 300, 400];
export const ZOOM_VISIBLE_LEVELS: number[] = [50, 70, 100, 150, 200];
export const ITEMS_RECTANGLE_PADDING: number = 20;

export enum ItemTypes {
    Start = 'start',
    End = 'end',
    Action1 = 'action1',
    Action2 = 'action2',
}

export enum DraggingTypes {
    Canvas = 'canvas',
    Item = 'item',
    Line = 'line',
    // ItemGhost = 'item-ghost',
    // ItemStartGhost = 'item-start-ghost',
    // ItemEndGhost = 'item-end-ghost',
    // ItemAction1Ghost = 'item-action1-ghost',
    // ItemAction2Ghost = 'item-action2-ghost',
}
