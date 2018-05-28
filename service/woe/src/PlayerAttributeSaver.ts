import {MyConnection} from 'my-core/index';

class PlayerAttributeSaver {
    private _woeId: number;
    private _playerId: number;
    private _attributeId: number;
    private _value: number;
    private _connection: MyConnection;

    constructor(woeId: number, playerId: number, attributeId: number, value: number, connection: MyConnection) {
        this._woeId = woeId;
        this._playerId = playerId;
        this._attributeId = attributeId;
        this._value = value;
        this._connection = connection;
    }

    async save() {
        await this._connection.query(`
            insert into woe_player_value(player_id, woe_id, woe_attribute_id, value) values(?,?,?,?);
            `,
                this._playerId,
                this._woeId,
                this._attributeId,
                this._value
            );
    }
}

export default PlayerAttributeSaver;