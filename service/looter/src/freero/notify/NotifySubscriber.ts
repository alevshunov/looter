import {FreeRoEventArgs} from "../hub/FreeRoEventArgs";
import {IEventProvider} from "../../core/IEventProvider";
import {MyLogger} from "my-core";

class NotifySubscriber {
    private _pms: IEventProvider<FreeRoEventArgs>;
    private _logger: MyLogger;
    private _storage: NotifyStorage;

}

export default NotifySubscriber;