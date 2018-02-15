import {Connection, ConnectionConfig} from "mysql";
import * as mysql from "mysql";
import {Shop} from "../model/Shop";

export class ShopStorage {
    private _dbConnection: ConnectionConfig;

    constructor(dbConnection: ConnectionConfig) {
        this._dbConnection = dbConnection;
    }

    private makeConnection() : Promise<mysql.Connection> {
        return new Promise((resolve, reject) => {
            const connection = mysql.createConnection(this._dbConnection);
            connection.connect((e) => {
                if(e) {
                    return reject();
                }
                resolve(connection);
            });
        });
    }


    add(shop: Shop) {
        const con = mysql.createConnection(this._dbConnection);
        con.connect((e) => {
            if(e) {
                console.log(e);
                throw e;
            }

            con.query("insert into shops(owner, name, location, date) values (?,?,?);",
                [shop.owner, shop.name, shop.location, shop.date],
                (err, result) => {
                    if (err) { console.log(err); throw err; }
                    console.log("Result: " + JSON.stringify(result));
                    con.destroy();
                }
            );
        });
    }

    updateFetchIndex(shop: Shop) {

    }

    async deactivateOtherShops(shop: Shop) {
        const conn = await this.makeConnection();
        conn.query("update shops set active = 0 where active = 1 and owner = ? and id != ?",
            [shop.owner, shop.id]);
    }
}