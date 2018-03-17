import {CardDrop} from "../model/CardDrop";
import {ConnectionConfig} from "mysql";
import {MyLogger} from "my-core";


class NotifyStorage {
    private _dbConnection: ConnectionConfig;
    private _logger: MyLogger;

    constructor(dbConnection: ConnectionConfig, logger: MyLogger) {
        this._dbConnection = dbConnection;
        this._logger = logger;
    }

    async add(drop: CardDrop) {
        const conn = new MyConnection(this._dbConnection, this._logger);
        await conn.open();
        await conn.query("insert into card_drop(owner, card, date) values (?,?,?)",
            drop.owner, drop.card, drop.date);
        conn.close();
    }
}

export default NotifyStorage;