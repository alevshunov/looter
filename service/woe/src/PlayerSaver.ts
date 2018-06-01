import {MyConnection} from 'my-core/index';

class PlayerSaver {
    private _player: string;
    private _connection: MyConnection;

    private static _players;

    constructor(player: string, connection: MyConnection) {
        this._player = player;
        this._connection = connection;
    }

    async save(): Promise<number> {
        if (!PlayerSaver._players) {
            const allPlayers = await this._connection.query('select id, name from player');
            PlayerSaver._players = {};
            allPlayers.forEach(p => PlayerSaver._players[p.name] = p.id);
        }

        if (!PlayerSaver._players[this._player]) {
            let result = await this._connection.query('insert into player(name) values(?)', this._player);
            PlayerSaver._players[this._player] = result.insertId;
        }

        return PlayerSaver._players[this._player];
    }
}

export default PlayerSaver;