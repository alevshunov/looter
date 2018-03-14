import {Client} from "irc";
import * as st from "./static";
import {FreeRoIrcHub} from "./freero/hub/FreeRoIrcHub";
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
import {ShopItemsLooterProvider} from './freero/shopItemLooter/ShopItemsLooterProvider';
import ShopLooter from './freero/shopItemLooter/ShopLooter';
import {ShopItemsLoaderProvider} from './freero/shopItemLooter/itemsLoader/ShopItemsLoaderProvider';
import {ShopFetchValidatorProvider} from './freero/shopItemLooter/validators/ShopFetchValidatorProvider';
import FreeRoIrcPmHandler from './freero/hub/FreeRoIrcPmHandler';
import {FreeRoSayHub} from './freero/hub/FreeRoSayHub';

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
const ircHub = new FreeRoIrcHub(ircClient, logger);
const ircPmHub = new FreeRoIrcPmHandler(ircClient, logger);
const sayHub = new FreeRoSayHub(ircClient, logger);

let cardLooter = new CardLooter(ircHub);
let messageLooter = new MessageLooter(ircHub);
let shopSellLooter = new ShopSellLooter(ircHub);
let shopBuyLooter = new ShopBuyLooter(ircHub);

cardLooter.onEvent().subscribe(async (sender, drop) => {
    // logger.log(JSON.stringify(drop));
    await cardStorage.add(drop);
});

messageLooter.onEvent().subscribe(async (sender, message) => {
    // logger.log(JSON.stringify(message));
    await messageStorage.add(message);
});

shopSellLooter.onEvent().subscribe(async (sender, shop) => {
    // logger.log(JSON.stringify(shop));
    await shopStorage.add(shop);
});

shopBuyLooter.onEvent().subscribe(async (sender, shop) => {
    // logger.log(JSON.stringify(shop));
    await shopStorage.add(shop);
});

const shopItemsLoaderProvider = new ShopItemsLoaderProvider(ircPmHub, sayHub, logger);
const shopFetchValidatorProvider = new ShopFetchValidatorProvider(shopItemStorage, logger);
const shopItemsLooterProvider = new ShopItemsLooterProvider(shopStorage, shopItemStorage, shopItemsLoaderProvider, shopFetchValidatorProvider, logger);
const shopLooter = new ShopLooter(shopItemsLooterProvider);

shopLooter.run();


logger.log('Started...');