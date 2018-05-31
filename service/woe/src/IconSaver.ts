import {MyConnection} from "my-core";

class IconSaver {
    private _icons: Object;
    private _woeId: number;
    private _connection: MyConnection;


    constructor(icons: Object, woeId: number, connection: MyConnection) {
        this._icons = icons;
        this._woeId = woeId;
        this._connection = connection;
    }


    async save() {
        for(let playerName in this._icons) {
            if (!this._icons.hasOwnProperty(playerName)) {
                continue;
            }

            const icon = this._icons[playerName];

            await this._connection.query(`
                insert into woe_player(woe_id, player_id, game_index, rate, rate_delta, guild_icon_url)
                values(?,(select id from player where name = ?), 0, 0, 0, ?)
                `, this._woeId, playerName, icon);
        }
    }
}

export default IconSaver;