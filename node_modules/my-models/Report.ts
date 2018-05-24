export class ReportEntry {
    reportInfo: { start: Date; end: Date; date: Date; };
    cardOfAWeek: string;
    cardDropActivity: Array<number>;
    cardTopPlayer: Array<{ owner: string; count: number }>;
    cardTopDrop: Array<{ card: string; count: number }>;
    cardLovelyPlaces: Array<{card: string; owner: string; count: number }>;

    chatStoreOfAWeek: { owner: string; message: string; date: Date; };
    chatActivity: Array<number>;
    chatTopSpeakers: Array<{ owner: string; count: number; randomMessage: string; }>;
    chatStoryTellers: Array<{ owner: string; averageLength: number; randomMessage: string; }>;
    // chatMostSmilest: Array<{owner: string; count: number; randomMessage: string;}>;

    shopActivity: Array<number>;
    shopOfAWeek: { id: number; owner: string; name: string; location: string; };
    shopLotOfAWeek: { id: number; name: string; owner: string; shopName: string; location: string; };
    shopMostExpensive: Array<{ owner: string; name: string; totalPrice: number; location: string; }>;
    shopMostCheapest: Array<{ owner: string; totalPrice: number; location: string; }>;
    shopMostUnstable: Array<{ owner: string; count: number; }>;
    // shopMostSellableItems: Array<{name: string; count: number; totalValue: number}>;
    shopMostExpensiveLots: Array<{ name: string; price: number; shopName: string; shopOwner: string; }>;

    levelUpped: Array<{ owner: string, date: Date}>;
    levelUppedOfAWeek: { owner: string, date: Date};
}