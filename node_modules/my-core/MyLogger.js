"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MyLogger = /** @class */ (function () {
    function MyLogger() {
    }
    MyLogger.prototype.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.log.call(console, "[INF] [" + new Date() + "]:", args.join(' '));
    };
    MyLogger.prototype.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.log.call(console, "[ERR] [" + new Date() + "]:", args.join(' '));
    };
    return MyLogger;
}());
exports.MyLogger = MyLogger;
