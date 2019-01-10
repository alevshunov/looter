import {ConnectionConfig} from "mysql";
import {CardDrop} from "../model/CardDrop";
import {MyConnection, ILogger} from "my-core";

export class CardDropStorage {
    private _dbConnection: ConnectionConfig;
    private _logger: ILogger;

    constructor(dbConnection: ConnectionConfig, logger: ILogger) {
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