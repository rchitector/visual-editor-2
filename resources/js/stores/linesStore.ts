import {fromStore, writable, Writable} from "svelte/store";
import {Line} from "./interfaces";

export const linesStore: Writable<Record<string, Line>> = writable({});

export const lineIds: Writable<string[]> = writable([]);

const lineStores: Map<string, Writable<Line | null>> = new Map();

export function getLineStore(uuid: string): Writable<Line | null> {
    if (!lineStores.has(uuid)) {
        const store: Writable<Line | null> = writable(null);
        lineStores.set(uuid, store);

        linesStore.subscribe(($items) => {
            if ($items[uuid]) {
                store.set($items[uuid]);
            } else {
                store.set(null);
            }
        });
    }
    return lineStores.get(uuid)!;
}

export function addLine(line: Line): Writable<Line | null> {
    linesStore.update(store => {
        store[line.id] = line;
        return store;
    });
    lineIds.update(ids => [...ids, line.id]);

    const lineStore = getLineStore(line.id);
    lineStore.set(line);

    return lineStore;
}

export function removeLine(uuid: string): void {
    linesStore.update(store => {
        delete store[uuid];
        return store;
    });
    lineIds.update(ids => ids.filter(id => id !== uuid));

    const lineStore = lineStores.get(uuid);
    if (lineStore) {
        lineStore.set(null);
        lineStores.delete(uuid);
    }
}

export function findByPortId(portId: string): Line[] {
    const lines = [];
    for (let value of lineStores.values()) {
        const current = fromStore(value).current;
        if (current.start.portId === portId || current.end.portId === portId) {
            lines.push(value);
        }
    }
    return lines;
}
