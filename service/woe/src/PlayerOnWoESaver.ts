import {MyConnection} from "my-core";

class PlayerOnWoESaver {
    private static _woePlayerMap;

    private _woeId: number;
    private _playerId: any;
    private _guildId: any;
    private _attributeId: any;
    private _playerValue: number;
    private _connection: MyConnection;

    constructor(woeId: number, playerId: any, guildId: any, attributeId: any, playerValue: number, connection: MyConnection) {
        this._woeId = woeId;
        this._playerId = playerId;
        this._guildId = guildId;
        this._attributeId = attributeId;
        this._playerValue = playerValue;
        this._connection = connection;
    }

    public async save() {
        if (!PlayerOnWoESaver._woePlayerMap) {
            const result = await this._connection.query(`
                select id, woe_id woeId, player_id playerId
                from woe_player              
            `);

            PlayerOnWoESaver._woePlayerMap = {};

            for (let i=0; i<result.length; i++) {
                if (!PlayerOnWoESaver._woePlayerMap[result.woeId]) {
                    PlayerOnWoESaver._woePlayerMap[result.woeId] = {};
                }

                PlayerOnWoESaver._woePlayerMap[result.woeId][result.playerId] = result.id;
            }
        }

        if (!PlayerOnWoESaver._woePlayerMap[this._woeId] || !PlayerOnWoESaver._woePlayerMap[this._woeId][this._playerId]) {
            const result = await this._connection.query(`
                insert into woe_player(woe_id, player_id, guild_id, game_index)
                values(?, ?, ?, (select count(distinct(woe_id)) + 1 from (select * from woe_player where woe_id < ? and player_id = ?) t))
            `, this._woeId, this._playerId, this._guildId, this._woeId, this._playerId);

            if (!PlayerOnWoESaver._woePlayerMap[this._woeId]) {
                PlayerOnWoESaver._woePlayerMap[this._woeId] = {};
            }

            PlayerOnWoESaver._woePlayerMap[this._woeId][this._playerId] = result.insertId;
        }

        const woePlayerId = PlayerOnWoESaver._woePlayerMap[this._woeId][this._playerId];

        await this._connection.query(`
            insert into woe_player_value(woe_player_id, woe_attribute_id, value)
            values(?, ?, ?)
        `, woePlayerId, this._attributeId, this._playerValue);

        return woePlayerId;
    }
}

export default PlayerOnWoESaver;