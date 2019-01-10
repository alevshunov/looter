import {MyConnection, ILogger} from "my-core";

function dd(v: string | number, l: number = 0, prefix: string = '', postfix: string = ' ') {
    let x = v.toString();
    while (x.length < l) {
        x = prefix + x + postfix;
    }

    return x;
}

class PlayerRatingCalculator {
    private _connection: MyConnection;
    private _logger: ILogger;
    private _players = {};

    private GAMES_TO_RATE = 1;
    private WOESE_RATE = 1.25;
    private INIT_RATE = 1100;
    private MIN_RATE = 1100;
    private AUX_MULTI = 0.15;
    private INACTIVE_DECREASE = 0.02;
    private RATE_STEP = 200;

    constructor(connection: MyConnection, logger: ILogger) {
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

                // this._logger.log('');
                // this._logger.log('---------------------------');
                this._logger.log(woe.name, woe.rate);

                const woePlayersSet = {};
                const woePlayers = [];

                const rate = data
                    .filter(x => x.woeId == woe.id && x.attributeId == attribute.id);
                // rate.push({rate: 0});

                for (let playerAIndex = 0; playerAIndex<rate.length; playerAIndex++) {
                    const playerA = {player: this.getPlayerWithRate(rate[playerAIndex]), rate: rate[playerAIndex]};

                    if (!woePlayersSet[playerA.player.id]) {
                        woePlayersSet[playerA.player.id] = playerA.player;
                        woePlayers.push(playerA.player);
                    }

                    attributePlayers[playerA.player.id] = playerA.player;
                }

                for (let playerAIndex = 0; playerAIndex<rate.length; playerAIndex++) {
                    const playerA = { player: this.getPlayerWithRate(rate[playerAIndex]), rate: rate[playerAIndex] };

                    playerA.player.rate2 = playerA.player.rate;


                    for (let playerBIndex = 0; playerBIndex<playerAIndex; playerBIndex++) {
                        const player = this.getPlayerWithRate(rate[playerBIndex]);
                        // this.recalculate(playerA.player, playerA.rate, player, rate[playerBIndex], woe.rate * attribute.rate);
                    }

                    // this.recalculate(playerA.player, playerA.rate, playerA.player, {rate: 0}, woe.rate * attribute.rate ,' <-- BONUS');

                    for (let playerCIndex = playerAIndex+1; playerCIndex<rate.length; playerCIndex++) {
                        const player = this.getPlayerWithRate(rate[playerCIndex]);
                        this.recalculate(playerA.player, playerA.rate, player, rate[playerCIndex], woe.rate * attribute.rate);
                    }

                    // this._logger.log('Not rated players:');

                    for (let id in attributePlayers) {
                        if (!attributePlayers.hasOwnProperty(id)) {
                            continue;
                        }
                        const player = attributePlayers[id];

                        if (woePlayersSet[player.id]) {
                            continue;
                        }

                        this.recalculate(playerA.player, playerA.rate, player, { rate: 0 }, woe.rate * attribute.rate / (Object.keys(attributePlayers).length + 1), ' <-- OOR');
                    }


                    playerA.player.rate2 = Math.round(Math.max(playerA.player.rate2, this.MIN_RATE));

                    this._logger.log(`\t\t${playerA.player.name} ==> ${playerA.player.rate2}`);
                    this._logger.log();
                }

                // console.log('Out of rating players:');

                for (let id in attributePlayers) {
                    if (!attributePlayers.hasOwnProperty(id)) {
                        continue;
                    }

                    const player = attributePlayers[id];

                    if (woePlayersSet[player.id]) {
                        continue;
                    }

                    player.rate2 = player.rate;

                    for (let playerIndex = 0; playerIndex<rate.length; playerIndex++) {
                        const playerB = this.getPlayerWithRate(rate[playerIndex]);

                        this.recalculate(player, {rate: 0}, playerB, rate[playerIndex], woe.rate * attribute.rate / (Object.keys(attributePlayers).length + 1), ' <-- OOR');
                    }

                    player.rate2 = Math.round(Math.max(player.rate2, this.MIN_RATE));

                    this._logger.log(`\t\t${player.name} ==> ${player.rate2}`);
                    this._logger.log();

                    player.h.push({woe, attribute, player, rate: player.rate2, delta: player.rate2 - player.rate, active: false});
                    player.rate = player.rate2;
                }

                woePlayers.forEach(player => {
                    player.h.push({woe, attribute, player, rate: player.rate2, delta: player.rate2 - player.rate, active: true});
                    player.rate = player.rate2;
                    player.games++;
                });

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

        const arr_dev = this.makeRating(x => x.totalRate(), true);
        const arr = this.makeRating(x => x.totalRate());

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
                        _player: entry.player,
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
                let rateIndexPrev = 0;

                const prevWoe = woesRate.find(ww => ww.woeId === w.woeId - 1);

                if (prevWoe) {
                    const player = prevWoe.players.find(pp => pp.id === r.playerId);

                    if (player) {
                        rateDelta = rate - player.rate;
                        rateIndexPrev = player.rateIndex;
                    }
                }

                w.players.push({
                    id: r.playerId,
                    rate,
                    rateDelta,
                    rateIndexPrev: rateIndexPrev, // delta calculation is below
                    active: main.active || aux.active,
                    mainRate: main.rate,
                    auxRate: aux.rate,
                    mainAttributeId: main.attributeId,
                    auxAttributeId: aux.attributeId
                });
            });

            w.players.forEach(p => {
                p.rateIndex = w.players.filter(pp => pp.rate > p.rate).length + 1;
                p.rateIndexDelta = p.rateIndexPrev === 0 ? 0 : p.rateIndexPrev - p.rateIndex;
            });
        });

        if (process.env.LOOTER_RATE_READONLY !== "true") {
            await this.save(woesRate);
        }
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

    private makeRating(by = (x) => x.rate, wrap: boolean = false) {
        let arr = [];

        for (let id in this._players) {
            if (!this._players.hasOwnProperty(id)) {
                continue;
            }

            const player = this._players[id];
            if (wrap) {
                arr.push({p: player, r: by(player), n: player.name});
            } else {
                arr.push(player);
            }
        }

        if (wrap) {
            arr = arr.sort((a, b) => a.r < b.r ? 1 : a.r === b.r ? 0 : -1);
        } else {
            arr = arr.sort((a,b) => by(a) < by(b) ? 1 : by(a) === by(b) ? 0 : -1);
        }

        return arr;
    }

    private recalculate(playerA, rateA, playerB, rateB, rate, extra = '') {
        let playerKRate = playerA.getK();
        // if (playerA.rate <= this.INIT_RATE && rateA.rate < rateB.rate) {
        //     playerKRate = 0;
        // }

        rateA.rate = Math.round(rateA.rate * 1000) / 1000;
        rateB.rate = Math.round(rateB.rate * 1000) / 1000;

        const deltaA = this.getNewPlayerARate(playerA.rate, rateA.rate, playerKRate, playerB.rate, rateB.rate);

        let realDelta = Math.round(deltaA * Math.min(1, rate) * 10000) / 10000;

        playerA.rate2 = playerA.rate2 + realDelta;
        playerA.rate2 = Math.round(playerA.rate2 * 10000) / 10000;
        // playerA.rate2 = Math.max(playerA.rate2, this.INIT_RATE);

        this._logger.log(`${dd(playerA.name, 19)}\tR: ${playerA.rate}\tV: ${dd(rateA.rate, 5)}\t\tvs\t\t${dd(playerB.name, 19)}\tR: ${playerB.rate}\tV: ${dd(rateB.rate, 5)}\t==>\t${dd(deltaA, 9)} ~ WoE: ${dd(realDelta,7)} => ${dd(playerA.rate2, 9)} ${extra}`)
    }

    private getNewPlayerARate(ra, va, ka, rb, vb) {
        const Ea = 1.0 / (1 + Math.pow(10, (rb - ra) / this.RATE_STEP));
        const Sa = 0.5 + va - (va + vb) / 2;
        const Ra2 = ka * (Sa - Ea);

        return Math.round(Ra2 * 10000) / 10000;
    }

    private getPlayerWithRate(rate) {
        const initRate = this.INIT_RATE;
        const auxMult = this.AUX_MULTI;
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
                    if (this.rate > 1800) {
                        return 25;
                    } else if (this.rate > 1600) {
                        return 50;
                    } else if (this.games > 2) {
                        return 75;
                    } else {
                        return 100;
                    }
                },
                totalRate() {
                    let r1 = initRate;
                    let r2 = initRate;
                    for (const k in this.rates) {
                        if (!this.rates.hasOwnProperty(k)) {
                            continue;
                        }

                        const rx = this.rates[k];

                        const r = rx.rate;

                        if (r1 < r) {
                            r2 = r1;
                            r1 = r;
                        } else if (r2 < r) {
                            r2 = r;
                        }
                    }

                    return r1 + (r2 - initRate) * auxMult;
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
        this._logger.silence(true);

        await this._connection.query(`delete from woe_player_rate`);
        await this._connection.query(`delete from woe_player_attribute_rate`);

        for (let i = 0; i<woesRate.length; i++) {
            const woe = woesRate[i];

            this._logger.logForce(`Saving woe #${woe.woeId}...`);

            for (let j=0; j<woe.players.length; j++) {
                const player = woe.players[j];

                const result = await this._connection.query(`
                    insert into woe_player_rate(player_id, woe_id, rate, rate_delta, rate_index, rate_index_delta, active, main_woe_attribute_id, aux_woe_attribute_id)
                    value(?,?,?,?,?,?,?,?,?)
                `, player.id, woe.woeId, player.rate, player.rateDelta, player.rateIndex, player.rateIndexDelta, player.active, player.mainAttributeId, player.auxAttributeId
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

        this._logger.silence(false);
    }
}

export default PlayerRatingCalculator;
