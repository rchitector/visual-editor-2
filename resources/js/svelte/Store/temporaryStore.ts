import { writable } from "svelte/store";

// Хранилище для всех элементов
export const elementsStore = writable({});

// Хранилище для отслеживания доступных элементов
export const elementIds = writable([]);

// Используем Map для хранения writable хранилищ
const elementStores = new Map();

export function getElementStore(uuid) {
    if (!elementStores.has(uuid)) {
        // Создаем writable хранилище для каждого элемента
        const store = writable(null);
        elementStores.set(uuid, store);

        // Инициализируем значение хранилища, если элемент уже существует в elementsStore
        elementsStore.subscribe(($elements) => {
            if ($elements[uuid]) {
                store.set($elements[uuid]);
            } else {
                store.set(null); // Устанавливаем null, если элемент удален
            }
        });
    }
    return elementStores.get(uuid);
}

// Функция для добавления нового элемента
export function addElement(element) {
    elementsStore.update(store => {
        store[element.id] = element;
        return store;
    });
    elementIds.update(ids => [...ids, element.id]);

    const elementStore = getElementStore(element.id);
    elementStore.set(element); // Устанавливаем значение для нового элемента

    return elementStore;
}

// Функция для удаления элемента
export function removeElement(uuid) {
    elementsStore.update(store => {
        delete store[uuid];
        return store;
    });
    elementIds.update(ids => ids.filter(id => id !== uuid));

    // Удаляем хранилище для этого элемента
    const elementStore = elementStores.get(uuid);
    if (elementStore) {
        elementStore.set(null); // Устанавливаем значение null при удалении
        elementStores.delete(uuid);
    }
}
