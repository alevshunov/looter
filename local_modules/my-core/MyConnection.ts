import {Connection, ConnectionConfig} from "mysql";
import * as mysql from "mysql";
import {MyLogger} from './MyLogger';

export class MyConnection {
    private _config: ConnectionConfig;
    private _connection: Connection;
    private _logger: MyLogger;

    constructor(config: ConnectionConfig, logger: MyLogger) {
        this._config = config;
        this._logger = logger;
    }

    public open() : Promise<MyConnection> {
        return new Promise((resolve, reject) => {
            const connection = mysql.createConnection(this._config);
            connection.connect((e: any) => {
                if(e) {
                    this._logger.error(e);
                    this._logger.error(e.stack);

                    return reject(e);
                }
                this._connection = connection;
                resolve(this);
            });
        });
    }

    public query(query: string, ...args: any[]): Promise<any> {
        const me = this;

        return new Promise((resolve, reject) => {
            try {
                const logQuery = query
                    .replace(/\t|\n/g, ' ')
                    .replace(/( +)/g, ' ')
                    .trim();

                this._logger.log('Query', logQuery, JSON.stringify(args));

                me._connection.query(query, args, (err: any, result: any) => {
                    if (err) {
                        me._logger.log('Query Error', JSON.stringify(err));
                        return reject (err);
                    } else {
                        if (result.length > 0) {
                            me._logger.log('Query Success', `Fetched ${result.length} lines.`);
                        } else if (result.length === 0) {
                            me._logger.log('Query Success', `Fetched ${result.length} lines.`);
                        } else {
                            me._logger.log('Query Success', `affectedRows: ${result.affectedRows}, insertId: ${result.insertId}.`);
                        }
                        return resolve(result);
                    }
                });
            } catch(e) {
                me._logger.error(e);
                me._logger.error(e.stack);
                reject(e);
            }
        });
    }

    public close() {
        this._connection.destroy();
        this._connection = null;
    }
}