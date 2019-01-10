import {MyConnection, ILogger} from "my-core";
import {AttributeGroup, Statistic} from './Types';
import PlayerSaverFactory from './PlayerSaverFactory';
import WoEAttributeLoaderFactory from './WoEAttributeLoaderFactory';
import PlayerAttributeSaverFactory from './PlayerAttributeSaverFactory';
import WoEAttributeSaverFactory from './WoEAttributeSaverFactory';
import GuildSaverFactory from './GuildSaverFactory';
import PlayerOnWoESaverFactory from './PlayerOnWoESaverFactory';

class StatisticSaver {
    private _woeId: number;
    private _statistic: Statistic;

    private _logger: ILogger;

    private _playerSaverFactory: PlayerSaverFactory;
    private _woeAttributeLoaderFactory: WoEAttributeLoaderFactory;
    private _playerAttributeSaverFactory: PlayerAttributeSaverFactory;
    private _woeAttributeSaverFactory: WoEAttributeSaverFactory;
    private _guildSaverFactory: GuildSaverFactory;
    private _playerOnWoESaverFactory: PlayerOnWoESaverFactory;

    constructor(woeId: number,
                statistic: Statistic,
                logger: ILogger,
                playerSaverFactory: PlayerSaverFactory,
                woeAttributeLoaderFactory: WoEAttributeLoaderFactory,
                playerAttributeSaverFactory: PlayerAttributeSaverFactory,
                woeAttributeSaverFactory: WoEAttributeSaverFactory,
                guildSaverFactory: GuildSaverFactory,
                playerOnWoESaverFactory: PlayerOnWoESaverFactory) {

        this._woeId = woeId;
        this._statistic = statistic;

        this._logger = logger;

        this._playerSaverFactory = playerSaverFactory;
        this._woeAttributeLoaderFactory = woeAttributeLoaderFactory;
        this._playerAttributeSaverFactory = playerAttributeSaverFactory;
        this._woeAttributeSaverFactory = woeAttributeSaverFactory;
        this._guildSaverFactory = guildSaverFactory;
        this._playerOnWoESaverFactory = playerOnWoESaverFactory;
    }

    async save() {
        const attributesMap = await this._woeAttributeLoaderFactory.create().loadAsMapByName();

        for (let i=0; i<this._statistic.groups.length; i++) {
            const group = this._statistic.groups[i];
            const attributeName = group.name;
            const attributeId = attributesMap[attributeName];

            if (!attributeId) {
                debugger;
                continue;
            }

            if (group.rawString || group.rawInt) {
                await this._woeAttributeSaverFactory
                    .createFor(this._woeId, attributeId, group.rawString, group.rawInt)
                    .save();
            }

            for (let j=0; j<this._statistic.groups[i].players.length; j++) {

                const playerName = this._statistic.groups[i].players[j].name;
                const playerValue = this._statistic.groups[i].players[j].value;
                const iconUrl = this._statistic.icons[playerName];

                let guildId = null, playerId;

                if (iconUrl) {
                    guildId = await this._guildSaverFactory.createFor(iconUrl).save();
                }

                playerId = await this._playerSaverFactory.createFor(playerName).save();

                await this._playerOnWoESaverFactory
                    .createFor(this._woeId, playerId, guildId, attributeId, playerValue)
                    .save();
            }
        }
    }
}

export default StatisticSaver;