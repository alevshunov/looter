import * as moment from 'moment';

class TimeCachedStore {
    private static _instance: TimeCachedStore = new TimeCachedStore();

    private _storage: Map<string, {dead: Date; value: any}>;

    public static instance(): TimeCachedStore {
        return TimeCachedStore._instance;
    }

    constructor() {
        this._storage = new Map<string, any>();
        setInterval(this.cleanup.bind(this), 5 * 60 * 1000);
    }

    public get(key: string): any {
        const entry = this._storage[key];

        if (!entry || entry.dead < new Date()) {
            return undefined;
        }

        return entry.value;
    }

    public set(key: string, value: any, dead?: Date): void {
        dead = dead || moment().add({minute: 2}).toDate();
        this._storage[key] = { value, dead };
    }

    private cleanup() {
        for (let key of Object.keys(this._storage)) {
            const entry = this._storage[key];
            if (entry && entry.dead && entry.dead < new Date()) {
                delete this._storage[key];
            }
        }
    }
}

export default TimeCachedStore;