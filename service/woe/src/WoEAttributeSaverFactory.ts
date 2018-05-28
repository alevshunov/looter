import WoEAttributeSaver from './WoEAttributeSaver';
import {MyConnection} from 'my-core/index';

class WoEAttributeSaverFactory {
    private _connection: MyConnection;

    constructor(connection: MyConnection) {
        this._connection = connection;
    }

    createFor(woeId: number, attributeId: number, stringValue: string, intValue: number) {
        return new WoEAttributeSaver(woeId, attributeId, stringValue, intValue, this._connection);
    }
}

export default WoEAttributeSaverFactory;