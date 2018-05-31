export interface RawStatistic {
    attribute: string;
    players: RawPlayerValue
}

export interface RawPlayerValue {
    name: string;
    value: number;
}

export interface Statistic {
    icons: Object;
    groups: Array<AttributeGroup>;
    extra: Array<AttributeValue>;
    recordsCount: number;
}

export interface AttributeValue {
    name: string;
    value: string;
}

export interface AttributeGroup {
    name: string;
    players: Array<PlayerValue>
    rawInt?: number;
    rawString?: string;
}

export interface PlayerValue {
    name: string;
    value: number;
}