import {AttributeGroup, Statistic} from './Types';

class RawStatisticParser {
    private _stat: string[];

    private STATUS_EXP = /^(.+) - ([0-9]{1,3}(,[0-9]{3})*)$/;
    private NUMBER_EXP = /^([0-9]{1,3}(,[0-9]{3})*)$/;

    constructor(stat: string[]) {
        this._stat = stat;
        this.nextEntry = this.nextEntry.bind(this);
    }

    parse() : Array<AttributeGroup> {
        const initValue : Statistic = { groups: [], extra: [] };

        const result = this._stat
            .reduce<Statistic>(this.nextEntry, initValue)
            .groups
            // .filter(x => x.players.length > 0)
        ;

        return result;
    }

    private nextEntry(state: Statistic, entry: string) {
        if (this.isAttributeName(entry)) {
            state.groups.push({
                name: entry.substr(0, entry.length-1),
                players: []
            });
        } else if (entry.match(this.STATUS_EXP)) {
            const parts = this.STATUS_EXP.exec(entry);
            const player = {name: parts[1], value: parseInt(parts[2].replace(/,/g, ''))};
            state.groups[state.groups.length - 1].players.push(player);
        } else if (entry.match(this.NUMBER_EXP)) {
            state.groups[state.groups.length - 1].rawInt = parseInt(entry.replace(/,/g, ''));
        } else {
            state.groups[state.groups.length - 1].rawString = entry;
        }

        return state;
    }

    private isAttributeName(text) {
        return text.endsWith(':');
    }
}

export default RawStatisticParser;