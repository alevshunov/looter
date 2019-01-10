import {ConnectionConfig} from "mysql";
import {Message} from "../model/Message";
import {MyConnection, ILogger} from "my-core";

export class MessageStorage {
    private _dbConnection: ConnectionConfig;
    private _logger: ILogger;

    constructor(dbConnection: ConnectionConfig, logger: ILogger) {
        this._dbConnection = dbConnection;
        this._logger = logger;
    }

    async add(message: Message) {
        const conn = new MyConnection(this._dbConnection, this._logger);
        await conn.open();
        try {
            await conn.query("insert into messages(owner, message, date, originalOwner, originalMessage, hub) values (?,?,?,?,?,?)",
                message.owner, message.message, message.date, message.originalOwner, message.originalMessage, message.source);

        } catch(e) {
            this._logger.error(e);
        } finally {
            conn.close();
        }
    }
}