import PlayerAttributeSaver from './PlayerAttributeSaver';
import {MyConnection} from 'my-core';

class PlayerAttributeSaverFactory {
    private _connection: MyConnection;

    constructor(connection: MyConnection) {
        this._connection = connection;
    }

    createFor(woeId: number, playerId: number, attributeId: number, value: number) {
        return new PlayerAttributeSaver(woeId, playerId, attributeId, value, this._connection);
    }
}

export default PlayerAttributeSaverFactory;