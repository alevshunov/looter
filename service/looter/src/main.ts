import {Client} from "irc";
import * as st from "./static";
import {Core} from "./core";
import {FreeRo} from "./freero";
import * as mysql from "mysql";

import FreeRoIrcHub = FreeRo.FreeRoIrcHub;
import ICardLooter = Core.ICardLooter;
import ICardDroppedEventArgs = Core.ICardDroppedEventArgs;
import FreeRoCardInfoExtractor = FreeRo.FreeRoCardInfoExtractor;
import FreeRoCardLooter = FreeRo.FreeRoCardLooter;

const dbConnection = {

};

const ircClient = new Client(st.config.IrcServer, st.config.IrcNick, { channels: ['#FreeRO'], userName: st.config.IrcNick});
// const ircClient = new Client(st.config.IrcServer, st.config.IrcNick, { channels: [], userName: st.config.IrcNick});

let cardLooter = new FreeRoCardLooter(
    new FreeRoIrcHub(ircClient),
    new FreeRoCardInfoExtractor()
);


cardLooter.onCardDropped().subscribe((sender: ICardLooter, args: ICardDroppedEventArgs) => {
    const drop = args.drop;
    console.log(JSON.stringify(drop));

    const con = mysql.createConnection(dbConnection);
    con.connect((e) => {
        if(e) {
            console.log(e);
            throw e;
        }

        con.query("insert into card_drop(owner, card, date) values (?,?,?);",
            [drop.owner, drop.cardName, drop.date],
            (err, result) => {
                if (err) { console.log(err); throw err; }
                console.log("Result: " + JSON.stringify(result));
                con.destroy();
            }
        );
    });
});



