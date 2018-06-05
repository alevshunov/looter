import {adoptTermToLike} from '../tools/Common';
import IRouteWithConnection from './tools/IRouteWithConnection';
import {MyConnection} from 'my-core';
import {Request} from 'express-serve-static-core';

class CardsRoute implements IRouteWithConnection{
    public path = '/cards';

    async execute(connection: MyConnection, req: Request): Promise<any> {
        const term = adoptTermToLike(req.query.term);

        const data = await connection.query(`
            select owner, card, date, group_concat(distinct i.id order by i.id separator ', ') ids
            from card_drop left join item_db i on i.name_japanese = card
            where owner like ? or card like ? or i.id like ?
            group by card_drop.id
            order by date desc 
            limit 100
        `,
            term, term, term);

        return data;
    }
}

export default CardsRoute;