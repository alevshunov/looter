import {MyConnection} from "my-core";

class RateAndIndexRecalculator {
    private _connection: MyConnection;

    constructor(connection: MyConnection) {
        this._connection = connection;
    }

    async recalculate() {
        await this._connection.query(`
            update woe_player_value pv
            set pv.position_index = (
                select count(*) + 1
                from (select * from woe_player_value) pv2 
                where pv2.woe_id = pv.woe_id and pv2.woe_attribute_id = pv.woe_attribute_id and pv2.value > pv.value
            )
        `);

        await this._connection.query(`
            update player
            set games_played = (select count(distinct(woe_id)) from woe_player_value where player_id = player.id)
        `);

        await this._connection.query(`
            update woe 
            set rate = (
                select truncate(value_int/1000000,2)
                from woe_value
                where woe_attribute_id = 11 and woe_id = woe.id
            )
        `);

        await this._connection.query(`
            update woe_player_value pv 
            set rate = (
                select pv.value / max(value)
                from (select * from woe_player_value) t
                where pv.woe_id = t.woe_id and pv.woe_attribute_id = t.woe_attribute_id
            )
        `);

        await this._connection.query(`
            insert into woe_log(message_id, woe_id)
            select m.id message_id, w.id woe_id
            from messages m inner join woe w on date(m.date) = date(w.date)
            where 
            (
            originalMessage like '- У гильдии [%] новый GuildMaster - %!'
            or originalMessage like '- Война за Империум%началась!!'
            or originalMessage like '- Замок [%] захвачен гильдией [%]! Империум разбил%.'
            or originalMessage like '- Война за Империум%завершена!'
            or originalMessage like '- Замком [%] владеет гильдия [%].'
            )
            and originalOwner = 'FreeRO'
            and w.id not in (select distinct woe_id from (select * from woe_log) t)  
        `);

        await this._connection.query(`delete from woe_player;`);


        // await this._connection.query(`
        //     insert into woe_player(woe_id, player_id, \`index\`, rate, rate_delta)
        //     select pw.*,
        //     (
        //         select count(distinct(pv2.woe_id)) + 1
        //         from woe_player_value pv2
        //         where pv2.player_id = pw.player_id and pv2.woe_id < pw.woe_id
        //     ) idx,
        //     (
        //         select avg(rate) * idx / 100
        //         from woe_player_value wpv
        //         where wpv.woe_id <= pw.woe_id and wpv.player_id = pw.player_id
        //     ) rate, 0
        //     from
        //     (
        //         select distinct woe_id, player_id
        //         from woe_player_value
        //     ) pw
        // `);

    }
}

export default RateAndIndexRecalculator;