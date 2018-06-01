import {MyConnection} from "my-core";
import GuildSaver from './GuildSaver';

class GuildSaverFactory {
    private _connection: MyConnection;

    constructor(connection: MyConnection) {
        this._connection = connection;
    }

    createFor(iconUrl: string) {
        return new GuildSaver(iconUrl, this._connection);
    }
}

export default GuildSaverFactory;