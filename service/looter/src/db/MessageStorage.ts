import {ConnectionConfig} from "mysql";
import * as mysql from "mysql";
import {Message} from "../freero/messageLooter/Message";

export class MessageStorage {
    private _dbConnection: ConnectionConfig;

    constructor(dbConnection: ConnectionConfig) {
        this._dbConnection = dbConnection;
    }


    add(message: Message) {
        const con = mysql.createConnection(this._dbConnection);
        con.connect((e) => {
            if(e) {
                console.log(e);
                throw e;
            }

            con.query("insert into messages(owner, message, date, originalOwner, originalMessage) values (?,?,?,?,?);",
                [message.owner, message.message, message.date, message.originalOwner, message.originalMessage],
                (err, result) => {
                    if (err) { console.log(err); throw err; }
                    console.log("Result: " + JSON.stringify(result));
                    con.destroy();
                }
            );
        });
    }
}