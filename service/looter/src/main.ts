import {Client} from "irc";
import * as st from "./static";
import {CardLooter} from "./freero/cardLooter/CardLooter";
import {DbConnectionChecker} from "./tools/DbConnectionChecker";
import {CardDropStorage} from "./db/CardDropStorage";
import {MessageStorage} from "./db/MessageStorage";
import {MessageLooter} from "./freero/messageLooter/MessageLooter";
import {ShopSellLooter} from "./freero/shopLooter/ShopSellLooter";
import {ShopStorage} from "./db/ShopStorage";
import {ShopItemStorage} from "./db/ShopItemStorage";
import {ShopBuyLooter} from "./freero/shopLooter/ShopBuyLooter";
import {MyLogger} from "my-core";
import FreeRoIrcPmHandler from './freero/hub/FreeRoIrcPmHandler';
import {FreeRoSayHub} from './freero/hub/FreeRoSayHub';
import FreeRoIrcMessageHandler from './freero/hub/FreeRoIrcMessageHandler';
import ShopLooterProvider from './freero/shopItemLooter/ShopLooterProvider';

const dbConnection = {
    host: process.env.LOOTER_DB_HOST,
    user: process.env.LOOTER_DB_USER,
    password: process.env.LOOTER_DB_PASSWORD,
    database: process.env.LOOTER_DB_DBNAME
};

const logger = new MyLogger();

DbConnectionChecker.tryConnect(dbConnection, logger);

const cardStorage = new CardDropStorage(dbConnection, logger);
const messageStorage = new MessageStorage(dbConnection, logger);
const shopStorage = new ShopStorage(dbConnection, logger);
const shopItemStorage = new ShopItemStorage(dbConnection, logger);

const ircClient = new Client(st.config.IrcServer, st.config.IrcNick, { channels: [st.config.IrcChannel], userName: st.config.IrcNick});

const freeroSayHub = new FreeRoSayHub(ircClient, logger);
const freeroMainChat = new FreeRoIrcMessageHandler(ircClient, logger);
const freeroPmChat = new FreeRoIrcPmHandler(ircClient, logger);

let messageLooter = new MessageLooter(freeroMainChat);
let cardLooter = new CardLooter(freeroMainChat);
let shopSellLooter = new ShopSellLooter(freeroMainChat);
let shopBuyLooter = new ShopBuyLooter(freeroMainChat);

messageLooter.onEvent().subscribe(async (sender, message) => {
    // logger.log(JSON.stringify(message));
    await messageStorage.add(message);
});

cardLooter.onEvent().subscribe(async (sender, drop) => {
    // logger.log(JSON.stringify(drop));
    await cardStorage.add(drop);
});

shopSellLooter.onEvent().subscribe(async (sender, shop) => {
    // logger.log(JSON.stringify(shop));
    await shopStorage.add(shop);
});

shopBuyLooter.onEvent().subscribe(async (sender, shop) => {
    // logger.log(JSON.stringify(shop));
    await shopStorage.add(shop);
});

const shopLooter = new ShopLooterProvider().create(freeroPmChat, freeroSayHub, shopStorage, shopItemStorage, logger);
shopLooter.run();


logger.log('Started...');