"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var strongly_typed_events_1 = require("strongly-typed-events");
var Core;
(function (Core) {
    var CardDrop = /** @class */ (function () {
        function CardDrop(cardName, owner, date) {
            this.cardName = cardName;
            this.owner = owner;
            this.date = date;
        }
        return CardDrop;
    }());
    Core.CardDrop = CardDrop;
    var CardLooter = /** @class */ (function () {
        function CardLooter(ro, cardInfoExtractor) {
            var _this = this;
            this._onCardDroppedEvent = new strongly_typed_events_1.EventDispatcher();
            this._ro = ro;
            this._cardInfoExtractor = cardInfoExtractor;
            this._ro.onEvent().subscribe(function (sender, event) { return _this.onNewEvent(sender, event); });
        }
        CardLooter.prototype.onCardDropped = function () {
            return this._onCardDroppedEvent.asEvent();
        };
        CardLooter.prototype.onNewEvent = function (sender, event) {
            if (!this._cardInfoExtractor.applicable(event)) {
                return;
            }
            var drop = this._cardInfoExtractor.extract(event);
            this._onCardDroppedEvent.dispatch(this, new CardDroppedEventArgs(drop));
        };
        return CardLooter;
    }());
    Core.CardLooter = CardLooter;
    var CardDroppedEventArgs = /** @class */ (function () {
        function CardDroppedEventArgs(drop) {
            this.drop = drop;
        }
        return CardDroppedEventArgs;
    }());
    Core.CardDroppedEventArgs = CardDroppedEventArgs;
})(Core = exports.Core || (exports.Core = {}));
//# sourceMappingURL=core.js.map