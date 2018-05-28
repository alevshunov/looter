import {MyConnection} from 'my-core/index';

class PlayerSaver {
    private _player: string;
    private _connection: MyConnection;

    private static _players = {};

    constructor(player: string, connection: MyConnection) {
        this._player = player;
        this._connection = connection;
    }

    async save(): Promise<number> {
        if (PlayerSaver._players[this._player]) {
            return PlayerSaver._players[this._player];
        }

        let result = await this._connection.query('select id from player where name = ?', this._player);
        if (result.length > 0) {
            PlayerSaver._players[this._player] = result[0].id;
            return result[0].id;
        }

        result = await this._connection.query('insert into player(name) values(?)', this._player);
        PlayerSaver._players[this._player] = result.insertId;

        return result.insertId;
    }
}

export default PlayerSaver;