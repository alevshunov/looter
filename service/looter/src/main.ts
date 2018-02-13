import {Client} from "irc";
import * as st from "./static";
import {FreeRoIrcHub} from "./freero/hub/FreeRoIrcHub";
import {CardLooter} from "./freero/cardLooter/CardLooter";
import {CardDrop} from "./freero/cardLooter/CardDrop";
import {DbConnectionChecker} from "./tools/DbConnectionChecker";
import {CardDropStorage} from "./db/CardDropStorage";
import {MessageStorage} from "./db/MessageStorage";
import {MessageLooter} from "./freero/messageLooter/MessageLooter";

const dbConnection = {
    host: process.env.LOOTER_DB_HOST,
    user: process.env.LOOTER_DB_USER,
    password: process.env.LOOTER_DB_PASSWORD,
    database: process.env.LOOTER_DB_DBNAME
};

DbConnectionChecker.tryConnect(dbConnection);

const cardStorage = new CardDropStorage(dbConnection);
const messageStorage = new MessageStorage(dbConnection);

const ircClient = new Client(st.config.IrcServer, st.config.IrcNick, { channels: [st.config.IrcChannel], userName: st.config.IrcNick});
const ircHub = new FreeRoIrcHub(ircClient);

let cardLooter = new CardLooter(ircHub);


cardLooter.onEvent().subscribe((sender: CardLooter, drop: CardDrop) => {
    console.log(JSON.stringify(drop));
    cardStorage.add(drop);
});

let messageLooter = new MessageLooter(ircHub);
messageLooter.onEvent().subscribe((sender, message) => {
    console.log(JSON.stringify(message));
    messageStorage.add(message);
});

console.log('Started...');