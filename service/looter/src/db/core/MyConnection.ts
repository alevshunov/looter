import {Connection, ConnectionConfig} from "mysql";
import * as mysql from "mysql";

export class MyConnection {
    private _config: ConnectionConfig;
    private _connection: Connection;

    constructor(config: ConnectionConfig) {
        this._config = config;
    }

    public async open() {
        return new Promise((resolve, reject) => {
            const connection = mysql.createConnection(this._config);
            connection.connect((e) => {
                if(e) {
                    return reject(e);
                }
                this._connection = connection;
                resolve(this);
            });
        });
    }

    public async query(query: string, ...args: any[]): Promise<any> {
        console.log('QUERY', query, JSON.stringify(args));

        return new Promise((resolve, reject) => {
            this._connection.query(query, args, (err, result) => {
                if (err) {
                    console.log('DB Error', JSON.stringify(err));
                    return reject (err);
                } else {
                    console.log('Query Success: ', JSON.stringify(result));
                    return resolve(result);
                }
            });
        });
    }

    public close() {
        this._connection.destroy();
        this._connection = null;
    }
}