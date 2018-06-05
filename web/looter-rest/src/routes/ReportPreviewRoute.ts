import IRouteWithConnection from './tools/IRouteWithConnection';
import {MyConnection} from 'my-core';
import {Request} from 'express';

class ReportPreviewRoute implements IRouteWithConnection {
    public path: string = '/report/preview';

    public async execute(connection: MyConnection, args: Request): Promise<any> {
        const data = await connection.query(`select * from reports order by id desc limit 1`);
        return JSON.parse(data[0].report);
    }

}

export default ReportPreviewRoute;