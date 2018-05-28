import {MyConnection} from 'my-core/index';

class PlayerSaver {
    private _player: string;
    private _connection: MyConnection;

    constructor(player: string, connection: MyConnection) {
        this._player = player;
        this._connection = connection;
    }

    async save(): Promise<number> {
        let result = await this._connection.query('select id from player where name = ?', this._player);
        if (result.length > 0) {
            return result[0].id;
        }

        result = await this._connection.query('insert into player(name) values(?)', this._player);
        return result.insertId;
    }
}

export default PlayerSaver;