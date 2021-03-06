import * as mysql from "mysql";
import {ConnectionConfig} from "mysql";
import {ILogger} from "my-core";

export class DbConnectionChecker {
    static tryConnect(dbConnection: ConnectionConfig, logger: ILogger) {
        const con = mysql.createConnection(dbConnection);
        con.connect((e) => {
            if (e) {
                logger.log(e);
                throw e;
            }

            logger.log('DB Connetion OK');
            con.destroy();
        });
    }
}