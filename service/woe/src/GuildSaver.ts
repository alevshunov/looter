import {MyConnection} from 'my-core';

class GuildSaver {
    private _iconUrl: string;

    private static _guildByIcon;
    private _connection: MyConnection;

    constructor(iconUrl: string, connection: MyConnection) {
        this._iconUrl = iconUrl;
        this._connection = connection;
    }

    public async save(): Promise<number> {
        if (!GuildSaver._guildByIcon) {
            const allGuilds = await this._connection.query('select id, name, icon_url iconUrl from guild');
            GuildSaver._guildByIcon = {};
            allGuilds.forEach(g => GuildSaver._guildByIcon[g.iconUrl] = g.id);
        }

        if (!GuildSaver._guildByIcon[this._iconUrl]) {
            let insertResult = await this._connection.query('insert into guild(icon_url) values(?)', this._iconUrl);
            // let data = await this._connection.query('select id, name, icon_url iconUrl from guild where id = ?', insertResult.insertId);

            GuildSaver._guildByIcon[this._iconUrl] = insertResult.insertId;
        }

        return GuildSaver._guildByIcon[this._iconUrl];
    }
}

export default GuildSaver;