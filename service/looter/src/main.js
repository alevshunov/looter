"use strict";
/// <reference path="./core.ts" />
/// <reference path="./freero.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var irc_1 = require("irc");
var st = require("./static");
var freero_1 = require("./freero");
var mysql = require("mysql");
var FreeRoIrcHub = freero_1.FreeRo.FreeRoIrcHub;
var FreeRoCardInfoExtractor = freero_1.FreeRo.FreeRoCardInfoExtractor;
var FreeRoCardLooter = freero_1.FreeRo.FreeRoCardLooter;
var dbConnection = {};
var ircClient = new irc_1.Client(st.config.IrcServer, st.config.IrcNick, { channels: ['#FreeRO'], userName: st.config.IrcNick });
// const ircClient = new Client(st.config.IrcServer, st.config.IrcNick, { channels: [], userName: st.config.IrcNick});
var cardLooter = new FreeRoCardLooter(new FreeRoIrcHub(ircClient), new FreeRoCardInfoExtractor());
cardLooter.onCardDropped().subscribe(function (sender, args) {
    var drop = args.drop;
    console.log(JSON.stringify(drop));
    var con = mysql.createConnection(dbConnection);
    con.connect(function (e) {
        if (e) {
            console.log(e);
            throw e;
        }
        con.query("insert into card_drop(owner, card, date) values (?,?,?);", [drop.owner, drop.cardName, drop.date], function (err, result) {
            if (err) {
                console.log(err);
                throw err;
            }
            console.log("Result: " + JSON.stringify(result));
            con.destroy();
        });
    });
});
//# sourceMappingURL=main.js.map