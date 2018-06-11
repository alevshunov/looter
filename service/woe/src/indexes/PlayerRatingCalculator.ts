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

        for (let woeIndex=0; woeIndex<woes.length; woeIndex++) {
            const woe = woes[woeIndex];

            for (let attributeIndex=0; attributeIndex<attributes.length; attributeIndex++) {
                const attribute = attributes[attributeIndex];

                const rate = data
                    .filter(x => x.woeId == woe.id && x.attributeId == attribute.id)
                    .sort((a,b) => a.playerIndex < b.playerIndex ? -1 : a.playerIndex === b.playerIndex ? 0 : 1);

                for (let playerAIndex = 0; playerAIndex<rate.length; playerAIndex++) {
                    const playerA = this.getPlayerWithRate(rate[playerAIndex]);

                    for (let playerBIndex = rate.length-1; playerBIndex>=0; playerBIndex--) {
                        if (playerAIndex === playerBIndex) {
                            continue
                        }

                        const playerB = this.getPlayerWithRate(rate[playerBIndex]);


                        this.recalculate(playerA, rate[playerAIndex], playerB, rate[playerBIndex]);
                    }
                }
            }
        }

        const arr = [];

        for (let id in this._players) {
            if (!this._players.hasOwnProperty(id)) {
                continue;
            }

            const player = this._players[id];
            arr.push(player);
        }

        return arr.sort((a,b) => a.rate < b.rate ? 1 : a.rate === b.rate ? 0 : -1);

    }

    private recalculate(playerA, rateA, playerB, rateB) {
        const Ra = this.getNewPlayerARate(playerA, rateA, playerB, rateB);
        const Rb = this.getNewPlayerARate(playerB, rateB, playerA, rateA);

        playerA.rate = Ra;
        playerA.games++;

        playerB.rate = Rb;
        playerB.games++;

        if (rateA.rate > rateB.rate) {
            playerA.wins++;
            playerB.loses++;
        }

        if (rateA.rate < rateB.rate) {
            playerA.loses++;
            playerB.wins++;
        }

        if (rateA.rate === rateB.rate) {
            playerA.pat++
            playerB.pat++;
        }
    }

    private getNewPlayerARate(playerA, rateA, playerB, rateB) {
        const Ra = playerA.rate;
        const Rb = playerB.rate;
        const Ea = 1.0 / (1 + Math.pow(10, (Rb - Ra) / 400));

        const K = playerA.getK();
        const Sa = rateA.rate > rateB.rate ? 1.0 : rateA.rate === rateB.rate ? 0.5 : 0.0;

        const Ra2 = Ra + K * (Sa - Ea) * rateA.rateRate;

        return Ra2;
    }

    private getPlayerWithRate(rate) {
        if (!this._players[rate.playerId]) {
            this._players[rate.playerId] = {
                id: rate.playerId,
                name: rate.playerName,
                rate: 1000,
                games: 0,
                wins: 0,
                loses: 0,
                pat: 0,
                getK() {
                    if (this.rate > 2400) {
                        return 10;
                    } else if (this.games > 300) {
                        return 15;
                    } else {
                        return 30;
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
                w.id woeId, 
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
        return await this._connection.query(`select * from woe_attribute order by sort_order`);
    }
}

export default PlayerRatingCalculator;
