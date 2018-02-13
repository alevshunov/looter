import {ConnectionConfig} from "mysql";
import * as mysql from "mysql";
import {CardDrop} from "../freero/cardLooter/CardDrop";

export class CardDropStorage {
    private _dbConnection: ConnectionConfig;

    constructor(dbConnection: ConnectionConfig) {
        this._dbConnection = dbConnection;
    }


    add(drop: CardDrop) {
        const con = mysql.createConnection(this._dbConnection);
        con.connect((e) => {
            if(e) {
                console.log(e);
                throw e;
            }

            con.query("insert into card_drop(owner, card, date) values (?,?,?);",
                [drop.owner, drop.card, drop.date],
                (err, result) => {
                    if (err) { console.log(err); throw err; }
                    console.log("Result: " + JSON.stringify(result));
                    con.destroy();
                }
            );
        });
    }
}