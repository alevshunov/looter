import IRouteWithConnection from './tools/IRouteWithConnection';
import {MyConnection} from 'my-core';
import {Request} from 'express';

class ReportRoute implements IRouteWithConnection {
    public path: string = '/report';

    public async execute(connection: MyConnection, args: Request): Promise<any> {
        const data = await connection.query(`select * from reports where active = 1 order by id desc limit 1`);
        return JSON.parse(data[0].report);
    }

}

export default ReportRoute;