import {ConnectionConfig} from "mysql";
import {Message} from "../model/Message";
import {MyConnection} from "./core/MyConnection";

export class MessageStorage {
    private _dbConnection: ConnectionConfig;

    constructor(dbConnection: ConnectionConfig) {
        this._dbConnection = dbConnection;
    }

    async add(message: Message) {
        const conn = new MyConnection(this._dbConnection);
        await conn.open();
        await conn.query("insert into messages(owner, message, date, originalOwner, originalMessage, hub) values (?,?,?,?,?,?)",
            message.owner, message.message, message.date, message.originalOwner, message.originalMessage, message.source);
        conn.close();
    }
}