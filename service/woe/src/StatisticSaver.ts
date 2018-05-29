import {MyConnection, MyLogger} from "my-core";
import {AttributeGroup} from './Types';
import PlayerSaverFactory from './PlayerSaverFactory';
import WoEAttributeLoaderFactory from './WoEAttributeLoaderFactory';
import PlayerAttributeSaverFactory from './PlayerAttributeSaverFactory';
import WoEAttributeSaverFactory from './WoEAttributeSaverFactory';

class StatisticSaver {
    private _attributesMap = {};

    private _statistic: Array<AttributeGroup>;
    private _woeId: number;

    private _playerSaverFactory: PlayerSaverFactory;
    private _woeAttributeLoaderFactory: WoEAttributeLoaderFactory;
    private _playerAttributeSaverFactory: PlayerAttributeSaverFactory;
    private _woeAttributeSaverFactory: WoEAttributeSaverFactory;
    private _logger: MyLogger;

    constructor(woeId: number,
                statistic: Array<AttributeGroup>,
                logger: MyLogger,
                playerSaverFactory: PlayerSaverFactory,
                woeAttributeLoaderFactory: WoEAttributeLoaderFactory,
                playerAttributeSaverFactory: PlayerAttributeSaverFactory,
                woeAttributeSaverFactory: WoEAttributeSaverFactory) {

        this._woeId = woeId;
        this._statistic = statistic;
        this._logger = logger;
        this._playerSaverFactory = playerSaverFactory;
        this._woeAttributeLoaderFactory = woeAttributeLoaderFactory;
        this._playerAttributeSaverFactory = playerAttributeSaverFactory;
        this._woeAttributeSaverFactory = woeAttributeSaverFactory;
    }

    public async save() {
        this._attributesMap = await this._woeAttributeLoaderFactory.create().loadAsMapByName();

        for(let i=0; i<this._statistic.length; i++) {
            await this.saveAttribute(this._statistic[i]);
        }
    }

    private async saveAttribute(attributeGroup: AttributeGroup) {
        if (attributeGroup.players && attributeGroup.players.length > 0) {
            for (let i=0; i<attributeGroup.players.length; i++) {
                await this.savePlayerAttribute(attributeGroup.name, attributeGroup.players[i].name, attributeGroup.players[i].value);
            }
        }

        if (attributeGroup.rawString || attributeGroup.rawInt) {
            await this.saveWoEAttribute(attributeGroup.name, attributeGroup.rawString, attributeGroup.rawInt);
        }
    }

    private async savePlayerAttribute(attribute: string, player: string, value: number) {
        this._logger.log(attribute, player, value);
        const playerId = await this._playerSaverFactory.createFor(player).save();
        const attributeId = this._attributesMap[attribute];
        if (!attributeId) {
            debugger;
        } else {
            await this._playerAttributeSaverFactory.createFor(this._woeId, playerId, attributeId, value).save();
        }
    }

    private async saveWoEAttribute(attribute: string, stringValue: string, intValue: number) {
        const attributeId = this._attributesMap[attribute];
        if (!attributeId) {
            debugger;
        } else {
            await this._woeAttributeSaverFactory.createFor(this._woeId, attributeId, stringValue, intValue).save();
        }
    }
}

export default StatisticSaver;