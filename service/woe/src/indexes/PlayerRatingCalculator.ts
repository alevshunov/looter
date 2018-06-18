import {MyConnection, MyLogger} from "my-core";

class PlayerRatingCalculator {
    private _connection: MyConnection;
    private _logger: MyLogger;
    private _players = {};

    private GAMES_TO_RATE = 10;
    private WOESE_RATE = 1.25;
    private INIT_RATE = 1100;
    private AUX_MULTI = 0.15;
    private INACTIVE_DECREASE = 0.02;
    private RATE_STEP = 400;

    constructor(connection: MyConnection, logger: MyLogger) {
        this._connection = connection;
        this._logger = logger;
    }
    
    public async calculate() {
        this._players = {};
        const d = {};

        const data = await this.loadAllInfo();
        const woes = await this.getWoEs();
        woes.forEach(woe => {
            if (woe.name.startsWith('WoE:SE')) {
                woe.rate = woe.rate * this.WOESE_RATE;
            }
        });

        const attributes = await this.loadAttributes();
        for (let attributeIndex=0; attributeIndex<attributes.length; attributeIndex++) {
            const attribute = attributes[attributeIndex];

            const attributePlayers = {};

            this._logger.log(attribute.name);

            for (let woeIndex=0; woeIndex<woes.length; woeIndex++) {
                const woe = woes[woeIndex % woes.length];

                this._logger.log('');
                this._logger.log('---------------------------');
                this._logger.log(woe.name);

                const woePlayersSet = {};
                const woePlayers = [];

                const rate = data
                    .filter(x => x.woeId == woe.id && x.attributeId == attribute.id)
                // rate.push({rate: 0});

                for (let playerAIndex = 0; playerAIndex<rate.length; playerAIndex++) {
                    const playerA = { player: this.getPlayerWithRate(rate[playerAIndex]), rate: rate[playerAIndex] };

                    if (!woePlayersSet[playerA.player.id]) {
                        woePlayersSet[playerA.player.id] = playerA.player;
                        woePlayers.push(playerA.player);
                    }

                    attributePlayers[playerA.player.id] = playerA.player;

                    playerA.player.rate2 = playerA.player.rate;

                    this._logger.log('');

                    this.recalculate(playerA.player, playerA.rate, playerA.player, {rate: 0}, woe.rate * attribute.rate);

                    let playerB;
                    for (let playerBIndex = 0; playerBIndex<playerAIndex; playerBIndex++) {
                        const player = this.getPlayerWithRate(rate[playerBIndex]);

                        if (player.games > this.GAMES_TO_RATE) {
                            // this.recalculate(playerA.player, playerA.rate, player, rate[playerBIndex], woe.rate * attribute.rate);
                        }

                        if (!playerB || playerB.player.rate > player.rate && player.games > this.GAMES_TO_RATE) {
                            playerB = { player, rate: rate[playerBIndex] };
                        }
                    }

                    let playerC;
                    for (let playerCIndex = playerAIndex+1; playerCIndex<rate.length; playerCIndex++) {
                        const player = this.getPlayerWithRate(rate[playerCIndex]);

                        if (player.games > this.GAMES_TO_RATE) {
                            this.recalculate(playerA.player, playerA.rate, player, rate[playerCIndex], woe.rate * attribute.rate);
                        }

                        if (!playerC || playerC.player.rate <= player.rate && player.games > this.GAMES_TO_RATE) {
                            playerC = { player, rate: rate[playerCIndex] };
                        }
                    }

                    if (playerB) {
                        // this.recalculate(playerA.player, playerA.rate, playerB.player, playerB.rate, woe.rate * attribute.rate);
                    }

                    if (playerC) {
                        // this.recalculate(playerA.player, playerA.rate, playerC.player, playerC.rate, woe.rate * attribute.rate);
                    }

                    this._logger.log(`${playerA.player.name} ${playerA.player.rate2}`);
                }

                woePlayers.forEach(player => {
                    player.h.push({woe, attribute, player, rate: player.rate2, delta: player.rate2 - player.rate, active: true});
                    player.rate = player.rate2;
                    player.games++;
                });

                let lastPlayerRate;
                if (rate.length > 0) {
                    lastPlayerRate = { player: this.getPlayerWithRate(rate[rate.length-1]), rate: rate[rate.length-1] };
                } else {
                    lastPlayerRate = { player: { rate: this.INIT_RATE }, rate: { rate: 0 } };
                }

                for (let id in attributePlayers) {
                    if (!attributePlayers.hasOwnProperty(id)) {
                        continue;
                    }

                    const player = attributePlayers[id];

                    if (woePlayersSet[player.id]) {
                        continue;
                    }

                    player.rate2 = player.rate;
                    // player.rate2 = player.rate - (player.rate - this.INIT_RATE) * this.INACTIVE_DECREASE;
                    this.recalculate(player, { rate: 0 }, lastPlayerRate.player, lastPlayerRate.rate, woe.rate * attribute.rate);

                    player.h.push({woe, attribute, player, rate: player.rate2, delta: player.rate2 - player.rate, active: false});
                    player.rate = player.rate2;
                }
            }

            const arr = this.makeRating();
            if (arr) {
                d[attribute.name] = arr.map(p => { return {name: p.name, rate: p.rate, games: p.games, h: p.h};});
            }

            for (let id in this._players) {
                if (!this._players.hasOwnProperty(id)) {
                    continue;
                }

                const player = this._players[id];

                player.rates[attribute.id] = { attribute: attribute, rate: player.rate, h: player.h };
                player.rate = this.INIT_RATE;
                player.rate2 = this.INIT_RATE;
                player.games = 0;
                player.h = [];
            }
        }

        const arr = this.makeRating(x => x.totalRate + (x.totalRate2 - this.INIT_RATE) * this.AUX_MULTI);

        let woesRate = [];

        for (let playerIndex=0; playerIndex<arr.length; playerIndex++) {
            const res = arr[playerIndex];
            for (let attrIndex=0; attrIndex<attributes.length; attrIndex++) {
                const attribute = attributes[attrIndex];
                const rates = res.rates[attribute.id];
                if (!rates) {
                    continue;
                }

                const history = rates.h;
                for (let hIndex=0; hIndex<history.length; hIndex++) {
                    const entry = history[hIndex];

                    let woeRate = woesRate.find(x => x.woeId === entry.woe.id);
                    if (!woeRate) {
                        woeRate = {woeId: entry.woe.id, rates: []};
                        woesRate.push(woeRate);
                    }

                    woeRate.rates.push({
                        playerId: entry.player.id,
                        attributeId: entry.attribute.id,
                        rate: entry.rate,
                        rateDelta: entry.delta,
                        active: entry.active
                    });
                }
            }

        }

        woesRate = woesRate.sort((a,b) => a.woeId < b.woeId ? -1 : a.woeId == b.woeId ? 0 : 1);

        woesRate.forEach(w => {
            w.rates.forEach(r => {
                r.rateIndex = w.rates.filter(rr => rr.attributeId === r.attributeId && rr.rate > r.rate).length + 1;
            });
        });

        woesRate.forEach(w => {
            w.players = [];

            w.rates.forEach(r => {
                if (w.players.find(p => p.id === r.playerId))
                    return;

                const playerRates = w.rates
                    .filter(rr => rr.playerId === r.playerId)
                    .sort((a, b) => a.rate < b.rate ? 1 : a.rate === b.rate ? 0 : -1);

                const main = playerRates[0];
                const aux = playerRates[1] || { attributeId: 12, rate: this.INIT_RATE, delta: 0, active: false };

                const rate = main.rate + (aux.rate - this.INIT_RATE) * this.AUX_MULTI;
                let rateDelta = rate - this.INIT_RATE;

                const prevWoe = woesRate.find(ww => ww.woeId === w.woeId - 1);

                if (prevWoe) {
                    const player = prevWoe.players.find(pp => pp.id === r.playerId);

                    if (player) {
                        rateDelta = rate - player.rate;
                    }
                }

                w.players.push({
                    id: r.playerId,
                    rate,
                    rateDelta,
                    active: main.active || aux.active,
                    mainRate: main.rate,
                    auxRate: aux.rate,
                    mainAttributeId: main.attributeId,
                    auxAttributeId: aux.attributeId
                });
            });

            w.players.forEach(p => {
                p.rateIndex = w.players.filter(pp => pp.rate > p.rate).length + 1;
            });
        });

        // debugger;
        await this.save(woesRate);

    }

    private dump(p) {
        this._logger.log(p.id, p.name);
        for (let id in p.rates) {
            if (!p.rates.hasOwnProperty(id)) {
                continue;
            }

            const r = p.rates[id];
            this._logger.log(r.attribute.id, r.attribute.ui_name, r.rate);
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

    private recalculate(playerA, rateA, playerB, rateB, rate) {
        const deltaA = this.getNewPlayerARate(playerA.rate, rateA.rate, playerA.getK(), playerB.rate, rateB.rate);

        let realDelta = deltaA * Math.min(1, rate);

        playerA.rate2 = playerA.rate2 + realDelta;
        playerA.rate2 = Math.round(playerA.rate2 * 10000) / 10000;

        // this._logger.log(`${playerA.name} ${playerA.rate} ${rateA.rate} vs ${playerB.name} ${playerB.rate} ${rateB.rate} -> delta: ${deltaA}, with WoE: ${realDelta} = ${playerA.rate2}`)
    }

    private getNewPlayerARate(ra, va, ka, rb, vb) {
        const Ea = 1.0 / (1 + Math.pow(10, (rb - ra) / this.RATE_STEP));
        const Sa = 0.5 + va - (va + vb) / 2;
        const Ra2 = ka * (Sa - Ea);

        return Ra2;
    }

    private getPlayerWithRate(rate) {
        if (!this._players[rate.playerId]) {
            this._players[rate.playerId] = {
                id: rate.playerId,
                name: rate.playerName,
                rate: this.INIT_RATE,
                rate2: this.INIT_RATE,
                rates: {},
                games: 0,
                h: [],
                getK() {
                    if (this.rate > 1600) {
                        return 25;
                    } else if (this.rate > 1400) {
                        return 50;
                    } else if (this.games > 5) {
                        return 75;
                    } else {
                        return 100;
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

    private async save(woesRate: any[]) {
        await this._connection.query(`delete from woe_player_rate`);
        await this._connection.query(`delete from woe_player_attribute_rate`);

        for (let i = 0; i<woesRate.length; i++) {
            const woe = woesRate[i];

            for (let j=0; j<woe.players.length; j++) {
                const player = woe.players[j];

                const result = await this._connection.query(`
                    insert into woe_player_rate(player_id, woe_id, rate, rate_delta, rate_index, active, main_woe_attribute_id, aux_woe_attribute_id)
                    value(?,?,?,?,?,?,?,?)
                `, player.id, woe.woeId, player.rate, player.rateDelta, player.rateIndex, player.active, player.mainAttributeId, player.auxAttributeId
                );
            }

            for (let j=0; j<woe.rates.length; j++) {
                const rate = woe.rates[j];
                // if (!rate.active) {
                //     continue;
                // }

                const result = await this._connection.query(`
                insert into woe_player_attribute_rate(woe_player_rate_id, woe_player_value_id, rate, rate_delta, rate_index, player_id, woe_attribute_id)
                value(
                    (select id from woe_player_rate where player_id = ? and woe_id = ?),
                    (select pv.id from woe_player_value pv inner join woe_player p on pv.woe_player_id = p.id where p.player_id = ? and p.woe_id = ? and pv.woe_attribute_id = ?),
                    ?, ?, ?, ?, ?
                )
            `,
                    rate.playerId, woe.woeId, rate.playerId, woe.woeId, rate.attributeId, rate.rate, rate.rateDelta, rate.rateIndex, rate.playerId, rate.attributeId
                );

            }
        }
    }
}

export default PlayerRatingCalculator;