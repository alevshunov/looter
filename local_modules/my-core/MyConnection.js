"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mysql = require("mysql");
var MyConnection = /** @class */ (function () {
    function MyConnection(config, logger) {
        this._config = config;
        this._logger = logger;
    }
    MyConnection.prototype.open = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var connection = mysql.createConnection(_this._config);
            connection.connect(function (e) {
                if (e) {
                    return reject(e);
                }
                _this._connection = connection;
                resolve(_this);
            });
        });
    };
    MyConnection.prototype.query = function (query) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var me = this;
        return new Promise(function (resolve, reject) {
            var logQuery = query
                .replace(/\t|\n/g, ' ')
                .replace(/( +)/g, ' ')
                .trim();
            _this._logger.log('Query', logQuery, JSON.stringify(args));
            me._connection.query(query, args, function (err, result) {
                if (err) {
                    me._logger.log('Query Error', JSON.stringify(err));
                    return reject(err);
                }
                else {
                    me._logger.log('Query Success', "Fetched " + result.length + " lines");
                    return resolve(result);
                }
            });
        });
    };
    MyConnection.prototype.close = function () {
        this._connection.destroy();
        this._connection = null;
    };
    return MyConnection;
}());
exports.MyConnection = MyConnection;
