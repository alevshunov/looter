import {Request, Response} from 'express';

interface IRoute {
    path: string;
    execute(request: Request, response: Response);
}

export default IRoute;
