import {MyConnection} from 'my-core/index';
import {Request} from 'express';

interface IRouteWithConnection {
    path: string;

    execute(connection: MyConnection, request: Request): Promise<any>;
}

export default IRouteWithConnection;