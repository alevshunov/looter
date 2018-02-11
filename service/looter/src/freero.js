"use strict";
/// <reference path="./core.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var strongly_typed_events_1 = require("strongly-typed-events");
var core_1 = require("./core");
var FreeRo;
(function (FreeRo) {
    var CardLooter = core_1.Core.CardLooter;
    var FreeRoCardLooter = /** @class */ (function (_super) {
        __extends(FreeRoCardLooter, _super);
        function FreeRoCardLooter() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return FreeRoCardLooter;
    }(CardLooter));
    FreeRo.FreeRoCardLooter = FreeRoCardLooter;
    var FreeRoIrcHub = /** @class */ (function () {
        function FreeRoIrcHub(irc) {
            this.IRC_MESSAGE_EVENT = 'message';
            this.IRC_ERROR_EVENT = 'error';
            this._onEvent = new strongly_typed_events_1.EventDispatcher();
            this._irc = irc;
            this.init();
        }
        FreeRoIrcHub.prototype.init = function () {
            this._irc.addListener(this.IRC_MESSAGE_EVENT, this.ircMessageHandler.bind(this));
            this._irc.addListener(this.IRC_ERROR_EVENT, this.ircErrorHandler.bind(this));
        };
        FreeRoIrcHub.prototype.ircMessageHandler = function (from, to, message) {
            var freeRoEvent = new FreeRoEvent(from, new Date(), message);
            this._onEvent.dispatch(this, freeRoEvent);
        };
        FreeRoIrcHub.prototype.ircErrorHandler = function (message) {
            console.log(new Date(), 'Error:', message);
            this._irc.connect(10, function () { });
        };
        FreeRoIrcHub.prototype.onEvent = function () {
            return this._onEvent.asEvent();
        };
        return FreeRoIrcHub;
    }());
    FreeRo.FreeRoIrcHub = FreeRoIrcHub;
    var FreeRoEvent = /** @class */ (function () {
        function FreeRoEvent(author, date, message) {
            this.author = author;
            this.date = date;
            this.message = message;
        }
        return FreeRoEvent;
    }());
    FreeRo.FreeRoEvent = FreeRoEvent;
    var FreeRoCardInfoExtractor = /** @class */ (function () {
        function FreeRoCardInfoExtractor() {
            this.SERVER = 'FreeRO';
        }
        // private CARD_EXP: RegExp = /#main : \[Server\] '(.+)'.*'(.+)'. Грац!/g;
        FreeRoCardInfoExtractor.prototype.applicable = function (event) {
            var result = true;
            if (event.author !== this.SERVER) {
                result = false;
            }
            if (!/#main : \[Server\] '(.+)'.*'(.+)'. Грац!/g.test(event.message)) {
                result = false;
            }
            return result;
        };
        FreeRoCardInfoExtractor.prototype.extract = function (event) {
            var parts = /#main : \[Server\] '(.+)'.*'(.+)'. Грац!/g.exec(event.message);
            var owner = parts[1];
            var cardName = parts[2];
            return new core_1.Core.CardDrop(cardName, owner, event.date);
        };
        return FreeRoCardInfoExtractor;
    }());
    FreeRo.FreeRoCardInfoExtractor = FreeRoCardInfoExtractor;
})(FreeRo = exports.FreeRo || (exports.FreeRo = {}));
//# sourceMappingURL=freero.js.map