import PlayerSaver from './PlayerSaver';
import {MyConnection} from 'my-core/index';

class PlayerSaverFactory {
    private _connection: MyConnection;

    constructor(connection: MyConnection) {
        this._connection = connection;
    }

    createFor(player: string) {
        return new PlayerSaver(player, this._connection);
    }
}

export default PlayerSaverFactory;