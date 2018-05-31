import {AttributeGroup, Statistic} from './Types';

class RawStatisticParser {
    private STATUS_EXP = /^(.+) - ([0-9]{1,3}([, ]?[0-9]{3})*)$/;
    private NUMBER_EXP = /^([0-9]{1,3}([, ]?[0-9]{3})*)$/;

    private _stat: string[];
    private _icons: string[];

    constructor(stat: string[], icons: string[]) {
        this._stat = stat;
        this._icons = icons;
        this.nextEntry = this.nextEntry.bind(this);
    }

    parse() : Statistic {
        const initValue : Statistic = { groups: [], extra: [], icons: {}, recordsCount: 0 };

        const result = this._stat
            .reduce<Statistic>(this.nextEntry, initValue)
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
            state.icons[player.name] = this._icons[state.recordsCount] || null;
            state.recordsCount++;
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