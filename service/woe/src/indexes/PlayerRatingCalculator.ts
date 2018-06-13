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
        const d = {};

        const data = await this.loadAllInfo();
        const woes = await this.getWoEs();
        woes.forEach(woe => {
            if (woe.name.startsWith('WoE:SE')) {
                woe.rate = woe.rate * 1.25;
            }
        });

        const attributes = await this.loadAttributes();
        for (let attributeIndex=0; attributeIndex<attributes.length; attributeIndex++) {
            const attribute = attributes[attributeIndex];

            const attributePlayers = {};

            console.log(attribute.name);

            for (let woeIndex=0; woeIndex<woes.length; woeIndex++) {
                const woe = woes[woeIndex];

                console.log('');
                console.log('---------------------------');
                console.log(woe.name);

                const woePlayersSet = {};
                const woePlayers = [];

                const rate = data
                    .filter(x => x.woeId == woe.id && x.attributeId == attribute.id)
                    .sort((a,b) => a.playerIndex < b.playerIndex ? -1 : a.playerIndex === b.playerIndex ? 0 : 1);
                rate.push({rate: 0});

                for (let playerAIndex = 0; playerAIndex<rate.length-1; playerAIndex++) {
                    const playerA = { player: this.getPlayerWithRate(rate[playerAIndex]), rate: rate[playerAIndex] };

                    if (!woePlayersSet[playerA.player.id]) {
                        woePlayersSet[playerA.player.id] = playerA.player;
                        woePlayers.push(playerA.player);
                    }

                    attributePlayers[playerA.player.id] = playerA.player;

                    console.log('');

                    this.recalculate(playerA.player, playerA.rate, playerA.player, {rate: 0}, woe.rate);

                    let playerB;
                    for (let playerBIndex = 0; playerBIndex<playerAIndex; playerBIndex++) {
                        const player = this.getPlayerWithRate(rate[playerBIndex]);

                        if (player.games > 10) {
                            this.recalculate(playerA.player, playerA.rate, player, rate[playerBIndex], woe.rate);
                        }

                        if (!playerB || playerB.player.rate > player.rate && player.rate > 1100) {
                            playerB = { player, rate: rate[playerBIndex] };
                        }
                    }

                    let playerC;
                    for (let playerCIndex = playerAIndex+1; playerCIndex<rate.length; playerCIndex++) {
                        const player = this.getPlayerWithRate(rate[playerCIndex]);

                        if (player.games > 10) {
                            this.recalculate(playerA.player, playerA.rate, player, rate[playerCIndex], woe.rate);
                        }

                        if (!playerC || playerC.player.rate <= player.rate && player.rate > 1100) {
                            playerC = { player, rate: rate[playerCIndex] };
                        }
                    }

                    if (playerB) {
                        // this.recalculate(playerA.player, playerA.rate, playerB.player, playerB.rate, woe.rate);
                    }

                    if (playerC) {
                        // this.recalculate(playerA.player, playerA.rate, playerC.player, playerC.rate, woe.rate);
                    } else {
                        // this.recalculate(playerA.player, playerA.rate, playerA.player, {rate: 0}, woe.rate);
                    }

                    console.log(`${playerA.player.name} ${playerA.player.rate2}`);
                }

                woePlayers.forEach(player => {
                    // player.rate2 = Math.max(1000, player.rate2);

                    player.rate = player.rate2;
                    // player.rate = player.rate2 + Math.abs(player.rate2 - 1100) / 100 * 3;
                    // console.log(`${player.name} +${(player.rate2 - 1100) / 100 * 5} = ${player.rate}`);

                    player.games++;
                    player.h.push({woe, rate: player.rate});
                });

                for (let id in attributePlayers) {
                    if (!attributePlayers.hasOwnProperty(id)) {
                        continue;
                    }

                    const player = attributePlayers[id];

                    if (woePlayersSet[player.id]) {
                        continue;
                    }

                    // console.log(`${player.name} ${player.rate} - ${(player.rate - 1100) / 100 * 5}`);

                    player.rate = player.rate - (player.rate - 1100) / 100;

                    player.h.push({woe, rate: player.rate});
                }


                const arr = this.makeRating();
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
                // player.rate += player.rate / 1000 * player.games;
                player.rate = 1000 + (player.rate - 1000) * attribute.rate;
                player.rates[attribute.id] = { attribute: attribute, rate: player.rate, h: player.h };

                if (player.rate > player.totalRate) {
                    player.totalRate2 = player.totalRate;
                    player.totalRate = player.rate;
                } else if (player.rate > player.totalRate2) {
                    player.totalRate2 = player.rate;
                }

                player.rate = 1100;
                player.rate2 = 1100;
                player.games = 0;
                player.h = [1100];
            }
        }

        const arr = this.makeRating(x => x.totalRate + (x.totalRate2 - 1000) * 0.25);
        debugger;

        for (let i=0; i<arr.length; i++) {
            const p = arr[i];

            p.totalRate = p.totalRate + (p.totalRate2 - 1000) * 0.25;

            let rate = 0;
            let rateId = 12;

            let rateAux = 0;
            let rateAuxId = 12;

            let rateAuxA, rateA = undefined;

            for (let id in p.rates) {
                if (!p.rates.hasOwnProperty(id)) {
                    continue;
                }

                const r = p.rates[id];
                if (r.rate > rate) {
                    rateAux = rate;
                    rateAuxId = rateId;
                    rateAuxA = rateA;

                    rate = r.rate;
                    rateId = r.attribute.id;
                    rateA = r.attribute;
                } else if (r.rate > rateAux) {
                    rateAux = r.rate;
                    rateAuxId = r.attribute.id;
                    rateAuxA = r.attribute;
                }
            }

            if (rate === 1000) {
                rateId = 12;
            }

            if (rateAux === 1000) {
                rateAuxId = 12;
            }

            console.log(`${p.name} ${p.totalRate} ${rateA.name} ${rateAuxA.name}`);

            // await this._connection.query(`
            //     update player
            //     set rate = ?, rate_woe_attribute_id = ?, rate_aux = ?, rate_aux_woe_attribute_id = ?
            //     where id = ?
            // `, rate, rateId, rateAux, rateAuxId, p.id);
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

    private recalculate(playerA, rateA, playerB, rateB, rate) {
        const deltaA = this.getNewPlayerARate(playerA.rate, rateA.rate, playerA.getK(), playerB.rate, rateB.rate);
        // const deltaB = this.getNewPlayerARate(playerB.rate, rateB.rate, playerB.getK(), playerA.rate, rateA.rate);

        // if (playerA.rate2 + deltaA * rate > 1000) {
        let realDelat = deltaA;// * rate;
        // if (playerA.rate2 < 1150 && realDelat < 0) {
        //     realDelat = 0;
        // }

        playerA.rate2 += realDelat;
        // }
        // playerB.rate2 += deltaB * rate

        console.log(`${playerA.name} ${playerA.rate} ${rateA.rate} vs ${playerB.name} ${playerB.rate} ${rateB.rate} -> delta: ${deltaA}, with WoE: ${realDelat}`)
    }

    private getNewPlayerARate(ra, va, ka, rb, vb) {
        const Ea = 1.0 / (1 + Math.pow(10, (rb - ra) / 400));
        const Sa = 0.5 + va - (va + vb) / 2;
        const Ra2 = ka * (Sa - Ea);

        return Ra2;
    }

    private getPlayerWithRate(rate) {
        if (!rate || !rate.playerName) {
            return {
                id: -99,
                name: 'SYSTEM',
                totalRate: 1200,
                totalRate2: 1200,
                rate: 1200,
                rate2: 1200,
                rates: {},
                games: 100,
                h: [1200],
                getK() {
                    if (this.rate > 1300) {
                        return 10;
                    } else if (this.games > 5) {
                        return 20;
                    } else {
                        return 40;
                    }
                }
            }
        }

        if (!this._players[rate.playerId]) {
            this._players[rate.playerId] = {
                id: rate.playerId,
                name: rate.playerName,
                totalRate: 1100,
                totalRate2: 1100,
                rate: 1100,
                rate2: 1100,
                rates: {},
                games: 0,
                h: [1100],
                getK() {
                    if (this.rate > 1300) {
                        return 10;
                    } else if (this.games > 5) {
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
