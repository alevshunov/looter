import {MyConnection} from "my-core";

class WoEExistChecker {
    private _connection: MyConnection;
    private _name: string;
    private _date: Date;

    constructor(name: string, date: Date, connection: MyConnection) {
        this._name = name;
        this._date = date;
        this._connection = connection;

    }

    async isExist(): Promise<boolean> {
        let result = await this._connection.query('select id from woe where name = ? or date = ?', this._name, this._date);
        return (result.length > 0);
    }
}

export default WoEExistChecker;