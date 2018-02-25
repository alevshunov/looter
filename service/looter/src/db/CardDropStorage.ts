import {ConnectionConfig} from "mysql";
import {CardDrop} from "../model/CardDrop";
import {MyConnection} from "./core/MyConnection";

export class CardDropStorage {
    private _dbConnection: ConnectionConfig;

    constructor(dbConnection: ConnectionConfig) {
        this._dbConnection = dbConnection;
    }

    async add(drop: CardDrop) {
        const conn = new MyConnection(this._dbConnection);
        await conn.open();
        await conn.query("insert into card_drop(owner, card, date) values (?,?,?)",
            drop.owner, drop.card, drop.date);
        conn.close();
    }
}