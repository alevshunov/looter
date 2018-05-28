import {MyConnection} from "my-core";

class WoEAttributeLoader {
    private _connection: MyConnection;

    constructor(connection: MyConnection) {
        this._connection = connection;
    }

    async load() {
        const attributes = await this._connection.query('select * from woe_attribute');
        return attributes;
    }

    async loadAsMapByName() {
        const data = await this.load();
        return data.reduce((state, item) => {
            state[item.name] = item.id;
            return state;
        }, {});
    }

}

export default WoEAttributeLoader;