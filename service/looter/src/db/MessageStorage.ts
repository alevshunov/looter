import {ConnectionConfig} from "mysql";
import {Message} from "../model/Message";
import {MyConnection} from "./core/MyConnection";
import {MyLogger} from '../core/MyLogger';

export class MessageStorage {
    private _dbConnection: ConnectionConfig;
    private _logger: MyLogger;

    constructor(dbConnection: ConnectionConfig, logger: MyLogger) {
        this._dbConnection = dbConnection;
        this._logger = logger;
    }

    async add(message: Message) {
        const conn = new MyConnection(this._dbConnection, this._logger);
        await conn.open();
        await conn.query("insert into messages(owner, message, date, originalOwner, originalMessage, hub) values (?,?,?,?,?,?)",
            message.owner, message.message, message.date, message.originalOwner, message.originalMessage, message.source);
        conn.close();
    }
}