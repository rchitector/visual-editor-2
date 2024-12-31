import {ItemTypes} from "@/js/svelte/Store/constants";
import {DebugColor} from "@/js/svelte/Store/DebugEnums";

export const getRandomIntInclusive = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const itemTypeColor = (itemType: ItemTypes | null) => {
    switch (itemType) {
        case ItemTypes.Start:
            return rgbToHex(DebugColor.Red);
        case ItemTypes.Finish:
            return rgbToHex(DebugColor.Green);
        case ItemTypes.Action1:
            return rgbToHex(DebugColor.Blue);
        case ItemTypes.Action2:
            return rgbToHex(DebugColor.Orange);
    }
    return '';
};

export const rgbToHex = (rgbString: string) => {
    const rgbValues: RegExpMatchArray | null = rgbString.match(/\d+/g);
    const hex = rgbValues?.map(value => {
        const hexValue = parseInt(value).toString(16);
        return hexValue.padStart(2, '0');
    });
    if (hex) {
        return `#${hex.join('')}`;
    }
    return '';
};

export const styleString = (styleObj) => {
    return Object.entries(styleObj).map(([key, value]) => `${key}: ${value};`).join(' ');
};
