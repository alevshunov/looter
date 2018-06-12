import {MyConnection, MyLogger} from "my-core";

class PlayerRatingCalculator {
    private _connection: MyConnection;
    private _logger: MyLogger;
    private _players = {};

    constructor(connection: MyConnection, logger: MyLogger) {
        this._connection = connection;
        this._logger = logger;
    }
    
    public async calculate() {
        this._players = {};

        const data = await this.loadAllInfo();
        const woes = await this.getWoEs();
        const attributes = await this.loadAttributes();
        for (let attributeIndex=0; attributeIndex<attributes.length; attributeIndex++) {
            const attribute = attributes[attributeIndex];

            const attributePlayers = {};

            for (let woeIndex=0; woeIndex<woes.length; woeIndex++) {
                const woe = woes[woeIndex];
                if (woe.name.startsWith('WoE:SE')) {
                    woe.rate *= 2;
                }

                const woePlayersSet = {};
                const woePlayers = [];

                const rate = data
                    .filter(x => x.woeId == woe.id && x.attributeId == attribute.id)
                    .sort((a,b) => a.playerIndex < b.playerIndex ? -1 : a.playerIndex === b.playerIndex ? 0 : 1);

                for (let playerAIndex = 0; playerAIndex<rate.length; playerAIndex++) {
                    const playerA = this.getPlayerWithRate(rate[playerAIndex]);
                    this.recalculate(playerA, rate[playerAIndex], playerA, {rate: 0});

                    if (!woePlayersSet[playerA.id]) {
                        woePlayersSet[playerA.id] = playerA;
                        woePlayers.push(playerA);
                    }

                    attributePlayers[playerA.id] = playerA;

                    for (let playerBIndex = playerAIndex+1; playerBIndex<rate.length; playerBIndex++) {
                        const playerB = this.getPlayerWithRate(rate[playerBIndex]);

                        this.recalculate(playerA, rate[playerAIndex], playerB, rate[playerBIndex]);
                    }
                }

                woePlayers.forEach(p => { p.rate = p.rate2 + p.rate2 / 1000 * p.games; p.games++; p.h.push(p.rate); });

                for (let id in attributePlayers) {
                    if (!attributePlayers.hasOwnProperty(id)) {
                        continue;
                    }

                    const player = attributePlayers[id];

                    if (woePlayersSet[player.id]) {
                        continue;
                    }

                    player.rate -= (player.rate - 1000) / 100 * 2;
                }


                const arr = this.makeRating();
            }



            const arr = this.makeRating();

            for (let id in this._players) {
                if (!this._players.hasOwnProperty(id)) {
                    continue;
                }

                const player = this._players[id];
                // player.rate += player.rate / 1000 * player.games;
                player.rates[attribute.id] = { attribute: attribute, rate: player.rate, h: player.h };
                player.totalRate = Math.max(player.totalRate, player.rate);
                player.rate = 1000;
                player.rate2 = 1000;
                player.games = 0;
                player.h = [];
            }
        }

        const arr = this.makeRating(x => x.totalRate);

        for (let i=0; i<arr.length; i++) {
            const p = arr[i];

            let rate = 0;
            let rateId = 12;

            let rateAux = 0;
            let rateAuxId = 12;

            for (let id in p.rates) {
                if (!p.rates.hasOwnProperty(id)) {
                    continue;
                }

                const r = p.rates[id];
                if (r.rate > rate) {
                    rateAux = rate;
                    rateAuxId = rateId;

                    rate = r.rate;
                    rateId = r.attribute.id;
                } else if (r.rate > rateAux) {
                    rateAux = r.rate;
                    rateAuxId = r.attribute.id;
                }
            }

            if (rate === 1000) {
                rateId = 12;
            }

            if (rateAux === 1000) {
                rateAuxId = 12;
            }

            await this._connection.query(`
                update player
                set rate = ?, rate_woe_attribute_id = ?, rate_aux = ?, rate_aux_woe_attribute_id = ?
                where id = ?
            `, rate, rateId, rateAux, rateAuxId, p.id);
        }

    }

    private dump(p) {
        console.log(p.id, p.name);
        for (let id in p.rates) {
            if (!p.rates.hasOwnProperty(id)) {
                continue;
            }

            const r = p.rates[id];
            console.log(r.attribute.id, r.attribute.ui_name, r.rate);
        }
    }

    private makeRating(by = (x) => x.rate) {
        let arr = [];

        for (let id in this._players) {
            if (!this._players.hasOwnProperty(id)) {
                continue;
            }

            const player = this._players[id];
            arr.push(player);
        }

        arr = arr.sort((a,b) => by(a) < by(b) ? 1 : by(a) === by(b) ? 0 : -1);
        return arr;
    }

    private recalculate(playerA, rateA, playerB, rateB) {
        const delta = this.getNewPlayerARate(playerA, rateA, playerB, rateB);

        playerA.rate2 += delta * rateA.woeRate;
        // playerB.rate2 -= delta  * rateA.rateRate * rateA.woeRate;

        if (delta > 0) {
            playerA.wins++;
            playerB.loses++;
        }

        if (delta < 0) {
            playerA.loses++;
            playerB.wins++;
        }
    }

    private getNewPlayerARate(playerA, rateA, playerB, rateB) {
        const Ra = playerA.rate;
        const Rb = playerB.rate;
        const Ea = 1.0 / (1 + Math.pow(10, (Rb - Ra) / 400));

        const K = playerA.getK();
        // const Sa = rateA.rate > rateB.rate ? 1.0 : rateA.rate === rateB.rate ? 0.5 : 0.0;
        const Sa = 0.5 + rateA.rate - (rateA.rate + rateB.rate) / 2;

        const Ra2 = K * (Sa - Ea);

        return Ra2;
    }

    private getPlayerWithRate(rate) {
        if (!this._players[rate.playerId]) {
            this._players[rate.playerId] = {
                id: rate.playerId,
                name: rate.playerName,
                totalRate: 1000,
                rate: 1000,
                rate2: 1000,
                rates: {},
                games: 0,
                wins: 0,
                loses: 0,
                pat: 0,
                h: [1000],
                getK() {
                    if (this.rate > 1300) {
                        return 10;
                    } else if (this.games > 15) {
                        return 20;
                    } else {
                        return 40;
                    }
                }
            }
        }

        return this._players[rate.playerId];
    }

    private async getWoEs() {
        return await this._connection.query(`select * from woe order by date`);
    }

    private async loadAllInfo() {
        return await this._connection.query(`
            select 
                w.id woeId, w.rate woeRate,
                p.id playerId, p.name playerName, 
                a.id attributeId, a.name attributeName, 
                wpv.position_index playerIndex, wpv.rate,
                a.rate rateRate
            from woe_player wp 
            inner join woe w on w.id = wp.woe_id
            inner join player p on p.id = wp.player_id
            inner join woe_player_value wpv on wpv.woe_player_id = wp.id
            inner join woe_attribute a on a.id = wpv.woe_attribute_id
            order by w.date, a.sort_order, wpv.position_index
        `);
    }

    private async loadAttributes() {
        return await this._connection.query(`select * from woe_attribute where rate != 0 order by sort_order`);
    }
}

export default PlayerRatingCalculator;
