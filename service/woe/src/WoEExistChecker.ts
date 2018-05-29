import {MyConnection} from "my-core";

class WoEExistChecker {
    private _connection: MyConnection;
    private _name: string;

    constructor(name: string, connection: MyConnection) {
        this._name = name;
        this._connection = connection;

    }

    async isExist(): Promise<boolean> {
        let result = await this._connection.query('select id from woe where name = ?', this._name);
        return (result.length > 0);
    }
}

export default WoEExistChecker;