import {ConnectionConfig} from "mysql";
import * as mysql from "mysql";
import {Shop} from "../freero/shopLooter/Shop";

export class ShopStorage {
    private _dbConnection: ConnectionConfig;

    constructor(dbConnection: ConnectionConfig) {
        this._dbConnection = dbConnection;
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
}