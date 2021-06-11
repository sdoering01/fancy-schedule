import { writable, derived, Updater } from 'svelte/store';

const storageKey = 'FS_scheduleItems';
let id: number;

export enum Weekday {
    MONDAY = 0,
    TUESDAY = 1,
    WEDNESDAY = 2,
    THURSDAY = 3,
    FRIDAY = 4,
    SATURDAY = 5,
    SUNDAY = 6
}

export interface RGBColor {
    red: number;
    green: number;
    blue: number;
}

export const weekdayKeys = Object.keys(Weekday).filter(
    (key) => !isNaN(Weekday[key])
);

export class ScheduleItem {
    public id: number;

    constructor(
        public name: string,
        public color: RGBColor,
        public weekdays: Weekday[] = []
    ) {
        this.id = ++id;
    }
}

const createScheduleStore = () => {
    const loadItems = (): ScheduleItem[] => {
        const items: ScheduleItem[] = JSON.parse(
            localStorage.getItem(storageKey) || '[]'
        );
        id = (items[items.length - 1]?.id ?? 0) + 1;
        return items;
    };

    const saveItems = (items: ScheduleItem[]) => {
        localStorage.setItem(storageKey, JSON.stringify(items));
    };

    const {
        subscribe,
        set: setProto,
        update: updateProto
    } = writable<ScheduleItem[]>(loadItems());

    const set = (items: ScheduleItem[]) => {
        saveItems(items);
        setProto(items);
    };

    // Persists changes to localStorage
    const update = (updater: Updater<ScheduleItem[]>) =>
        updateProto((prev) => {
            const next = updater(prev);
            saveItems(next);
            return next;
        });

    const add = (name: string, color: RGBColor) => {
        update((prev) => [...prev, new ScheduleItem(name, color)]);
    };

    const remove = (id: number) => {
        update((prev) => prev.filter((item) => item.id !== id));
    };

    const toggleWeekday = (id: number, weekday: Weekday) => {
        update((prev) => {
            const relevantItem = prev.find((item) => item.id === id);
            const weekdayIndex = relevantItem.weekdays.indexOf(weekday);
            if (weekdayIndex === -1) {
                relevantItem.weekdays.push(weekday);
            } else {
                relevantItem.weekdays.splice(weekdayIndex, 1);
            }
            return [...prev];
        });
    };

    return {
        subscribe,
        set,
        add,
        remove,
        toggleWeekday
    };
};

export const scheduleItems = createScheduleStore();

export const scheduleItemsByWeekdays = derived(
    scheduleItems,
    ($scheduleItems) => {
        const itemsByWeekdays = Array.from(Array(7), () => []);
        for (const { weekdays, ...rest } of $scheduleItems) {
            for (const weekday of weekdays) {
                itemsByWeekdays[weekday].push(rest);
            }
        }
        return itemsByWeekdays;
    }
);
