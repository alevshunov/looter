import {MyConnection} from "my-core";

class WoEAttributeSaver {
    private _woeId: number;
    private _attributeId: number;
    private _stringValue: string;
    private _intValue: number;
    private _connection: MyConnection;

    constructor(woeId: number, attributeId: number, stringValue: string, intValue: number, connection: MyConnection) {
        this._woeId = woeId;
        this._attributeId = attributeId;
        this._stringValue = stringValue;
        this._intValue = intValue;
        this._connection = connection;
    }

    async save() {
        await this._connection.query(`
            insert into woe_value(woe_id, woe_attribute_id, value_int, value_string) values(?,?,?,?); 
        `, this._woeId, this._attributeId, this._intValue, this._stringValue);
    }
}

export default WoEAttributeSaver;