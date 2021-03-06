import {MyConnection} from "my-core";

class WoESaver {
    private _name: string;
    private _connection: MyConnection;
    private _date: Date;
    private _postId: number;

    constructor(name: string, date: Date, postId: number, connection: MyConnection) {
        this._name = name;
        this._date = date;
        this._postId = postId;
        this._connection = connection;
    }

    async save(): Promise<number> {
        let result = await this._connection.query('select id from woe where name = ?', this._name);
        if (result.length > 0) {
            await this._connection.query('delete from woe where id = ?', result[0].id);
        }

        result = await this._connection.query('insert into woe(name, date, post_id) values(?,?,?)',
            this._name, this._date, this._postId);

        return result.insertId;
    }
}

export default WoESaver;