import WoEAttributeLoader from './WoEAttributeLoader';
import {MyConnection} from 'my-core';

class WoEAttributeLoaderFactory {
    private _connection: MyConnection;

    constructor(connection: MyConnection) {
        this._connection = connection;
    }

    create() {
        return new WoEAttributeLoader(this._connection);
    }
}

export default WoEAttributeLoaderFactory;