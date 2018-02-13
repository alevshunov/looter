import * as mysql from "mysql";
import {ConnectionConfig} from "mysql";

export class DbConnectionChecker {
    static tryConnect(dbConnection: ConnectionConfig) {
        const con = mysql.createConnection(dbConnection);
        con.connect((e) => {
            if (e) {
                console.log(e);
                throw e;
            }

            console.log('DB Connetion OK');
            con.destroy();
        });
    }
}