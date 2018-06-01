import PlayerOnWoESaver from './PlayerOnWoESaver';
import {MyConnection} from 'my-core';

class PlayerOnWoESaverFactory {
    private _connection: MyConnection;

    constructor(connection: MyConnection) {
        this._connection = connection;
    }

    public createFor(woeId: number, playerId: any, guildId: any, attributeId: any, playerValue: number) {
        return new PlayerOnWoESaver(woeId, playerId, guildId, attributeId, playerValue, this._connection);
    }
}

export default PlayerOnWoESaverFactory;