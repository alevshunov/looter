import {Connection, ConnectionConfig} from "mysql";
import * as mysql from "mysql";
import {MyLogger} from '../../core/MyLogger';

export class MyConnection {
    private _config: ConnectionConfig;
    private _connection: Connection;
    private _logger: MyLogger;

    constructor(config: ConnectionConfig, logger: MyLogger) {
        this._config = config;
        this._logger = logger;
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
        const me = this;

        return new Promise((resolve, reject) => {
            this._logger.log('QUERY', query.replace(/( +)|\t|\n/g, ' '), JSON.stringify(args));

            me._connection.query(query, args, (err, result) => {
                if (err) {
                    me._logger.log('DB Error', JSON.stringify(err));
                    return reject (err);
                } else {
                    me._logger.log('Query Success: ', JSON.stringify(result));
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