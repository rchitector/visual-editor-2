import {writable, Writable} from "svelte/store";
import {Port} from "./interfaces";

export const portsStore: Writable<Record<string, Port>> = writable({});

export const portIds: Writable<string[]> = writable([]);

const portStores: Map<string, Writable<Port | null>> = new Map();

export function getPortStore(uuid: string): Writable<Port | null> {
    if (!portStores.has(uuid)) {
        const store: Writable<Port | null> = writable(null);
        portStores.set(uuid, store);

        portsStore.subscribe(($ports) => {
            if ($ports[uuid]) {
                store.set($ports[uuid]);
            } else {
                store.set(null);
            }
        });
    }
    return portStores.get(uuid)!;
}

export function addPort(port: Port): Writable<Port | null> {
    portsStore.update(store => {
        store[port.id] = port;
        return store;
    });
    portIds.update(ids => [...ids, port.id]);

    const portStore = getPortStore(port.id);
    portStore.set(port);

    return portStore;
}

export function removePort(uuid: string): void {
    portsStore.update(store => {
        delete store[uuid];
        return store;
    });
    portIds.update(ids => ids.filter(id => id !== uuid));

    const portStore = portStores.get(uuid);
    if (portStore) {
        portStore.set(null);
        portStores.delete(uuid);
    }
}
